from rest_framework import serializers
from .models import Sale, SaleItem, Payment, POSSession, DayOpen, DayClose
from products.models import Product
from customers.models import Customer
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import uuid

User = get_user_model()

# Import models for serializer querysets (import here to avoid circular imports)
try:
    from pos_masters.models import Terminal
    from organization.models import Location
    from pos_masters.models import SettlementReason
except ImportError:
    # Models not available yet during initial import
    Terminal = None
    Location = None
    SettlementReason = None


class SaleItemSerializer(serializers.ModelSerializer):
    """Serializer for sale line items."""
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_barcode = serializers.CharField(source='product.barcode', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True, help_text="Tax rate percentage (write-only, used to calculate tax_amount)")
    subtotal = serializers.SerializerMethodField(read_only=True)
    total = serializers.SerializerMethodField(read_only=True)
    
    def get_total(self, obj):
        """Alias for line_total for API compatibility"""
        return obj.line_total
    
    class Meta:
        model = SaleItem
        fields = [
            'id', 'product', 'product_name', 'product_barcode', 'product_sku',
            'quantity', 'unit_price', 'discount_amount',
            'tax_rate', 'tax_amount', 'subtotal', 'total', 'line_total'
        ]
        read_only_fields = ['id', 'tax_amount', 'line_total']
    
    def get_subtotal(self, obj):
        """Calculate subtotal: quantity * unit_price"""
        return obj.quantity * obj.unit_price
    
    def create(self, validated_data):
        """Calculate amounts when creating item."""
        # Remove tax_rate from validated_data as it's not a model field
        tax_rate = validated_data.pop('tax_rate', None)
        
        product = validated_data['product']
        quantity = validated_data['quantity']
        unit_price = validated_data.get('unit_price')
        if unit_price is None:
            # Try to get price from product
            unit_price = getattr(product, 'price', Decimal('0.00'))
        else:
            unit_price = Decimal(str(unit_price))
        
        discount_amount = validated_data.get('discount_amount', Decimal('0.00'))
        if not isinstance(discount_amount, Decimal):
            discount_amount = Decimal(str(discount_amount))
        
        # Get tax_rate from input or product
        if tax_rate is None:
            tax_rate = getattr(product, 'tax_rate', Decimal('0.00'))
        else:
            tax_rate = Decimal(str(tax_rate))
        
        # Ensure quantity is Decimal
        if not isinstance(quantity, Decimal):
            quantity = Decimal(str(quantity))
        
        # Calculate subtotal (before discount and tax)
        subtotal = quantity * unit_price
        
        # Calculate tax on amount after discount
        taxable_amount = subtotal - discount_amount
        tax_amount = (taxable_amount * tax_rate) / Decimal('100')
        
        # Calculate line_total (after discount + tax)
        line_total = taxable_amount + tax_amount
        
        # Set calculated values (remove any non-model fields)
        validated_data['unit_price'] = unit_price
        validated_data['discount_amount'] = discount_amount
        validated_data['tax_amount'] = tax_amount
        validated_data['line_total'] = line_total
        
        return super().create(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payments."""
    
    payment_method_display = serializers.CharField(
        source='get_payment_method_display',
        read_only=True
    )
    change_amount = serializers.DecimalField(max_digits=18, decimal_places=2, required=False, write_only=True, help_text="Change amount (write-only, not stored in database)")
    sale = serializers.PrimaryKeyRelatedField(queryset=Payment.objects.none(), required=False, allow_null=True, help_text="Sale ID (auto-set when creating via SaleCreateSerializer)")
    
    class Meta:
        model = Payment
        fields = [
            'id', 'sale', 'payment_method', 'payment_method_display',
            'amount', 'change_amount', 'status', 'payment_date', 'reference_number', 'notes'
        ]
        read_only_fields = ['id', 'payment_date']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # When creating payments as part of a sale, sale field is not required
        if self.parent and isinstance(self.parent, serializers.ListSerializer):
            self.fields['sale'].required = False
            self.fields['sale'].allow_null = True


class SaleSerializer(serializers.ModelSerializer):
    """Serializer for sales transactions."""
    
    items = SaleItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    cashier_name = serializers.CharField(source='cashier.username', read_only=True)
    
    sale_type_display = serializers.CharField(source='get_sale_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Sale
        fields = [
            'id', 'sale_number', 'sale_type', 'sale_type_display',
            'customer', 'customer_name', 'cashier', 'cashier_name',
            'delivery_type', 'delivery_address',
            'subtotal', 'tax_amount', 'discount_amount',
            'total_amount', 'status', 'status_display',
            'sale_date', 'completed_at', 'notes',
            'items', 'payments',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'sale_number', 'subtotal', 'tax_amount', 'total_amount',
            'sale_date', 'created_at', 'updated_at'
        ]


class SaleCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new sales with line items and payments."""
    
    items = SaleItemSerializer(many=True, read_only=False)
    payments = PaymentSerializer(many=True, required=False, read_only=False)
    discount_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, default=0, write_only=True, help_text="Bill-level discount percentage")
    
    class Meta:
        model = Sale
        fields = [
            'id', 'sale_number',  # Include id and sale_number so they're returned in response
            'sale_type', 'customer', 'cashier',
            'delivery_type', 'delivery_address',
            'discount_percentage', 'notes', 'status',
            'location', 'pos_session', 'terminal',
            'subtotal', 'tax_amount', 'discount_amount', 'total_amount',  # Include calculated fields
            'sale_date', 'completed_at', 'created_at', 'updated_at',
            'items', 'payments'
        ]
        read_only_fields = ['id', 'sale_number', 'subtotal', 'tax_amount', 'discount_amount', 'total_amount', 
                           'sale_date', 'completed_at', 'created_at', 'updated_at']
    
    @transaction.atomic
    def create(self, validated_data):
        """Create sale with items and payments in a transaction."""
        # Import here to avoid circular imports
        from .models import DayOpen
        
        items_data = validated_data.pop('items')
        payments_data = validated_data.pop('payments', [])
        
        # Get location from multiple sources
        location = validated_data.get('location')
        
        # Try to get location from pos_session if provided
        if not location and 'pos_session' in validated_data:
            pos_session = validated_data.get('pos_session')
            if pos_session:
                try:
                    from .models import POSSession
                    if isinstance(pos_session, POSSession):
                        location = pos_session.location
                    else:
                        # If it's an ID, fetch the session
                        session_obj = POSSession.objects.select_related('location').get(id=pos_session)
                        location = session_obj.location
                except (POSSession.DoesNotExist, AttributeError, ValueError):
                    pass
        
        # Try to get location from cashier's pos_location
        if not location and 'cashier' in validated_data and validated_data['cashier']:
            try:
                cashier = validated_data['cashier']
                if hasattr(cashier, 'pos_location') and cashier.pos_location:
                    location = cashier.pos_location
            except (AttributeError, ValueError):
                pass
        
        # Try to get location from request user's session location
        if not location and self.context.get('request'):
            try:
                request = self.context['request']
                # Check if user has a session location stored
                session_location_id = request.session.get('session_location_id')
                if session_location_id:
                    from organization.models import Location
                    location = Location.objects.get(id=session_location_id)
            except (AttributeError, ValueError, Exception):
                pass
        
        # If still no location, try to get from first available location
        if not location:
            try:
                from organization.models import Location
                location = Location.objects.filter(is_active=True).first()
            except Exception:
                pass
        
        # Location is required - raise error if still not found
        if not location:
            raise serializers.ValidationError({
                'location': 'Unable to determine location. Please ensure a location is assigned to the POS session, terminal, or user.'
            })
        
        # Set location in validated_data
        validated_data['location'] = location
        
        # Find active Day Open for sequence generation
        day_open = None
        try:
            day_open = DayOpen.objects.filter(
                location=location,
                is_active=True
            ).first()
        except Exception:
            pass
        
        # Generate sale number from Day Open sequence if available
        if day_open:
            try:
                sale_number = Sale.generate_sale_number(day_open=day_open)
                validated_data['sale_number'] = sale_number
            except Exception as e:
                # Fallback: generate sale number without Day Open
                validated_data['sale_number'] = f"SALE-{timezone.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        else:
            # Generate sale number without Day Open (fallback)
            validated_data['sale_number'] = f"SALE-{timezone.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Remove discount_percentage as it's not a model field (write-only)
        discount_percentage = validated_data.pop('discount_percentage', 0)
        
        # Create the sale
        sale = Sale.objects.create(**validated_data)
        
        # Create sale items
        total_subtotal = Decimal('0.00')
        total_tax = Decimal('0.00')
        
        for item_data in items_data:
            try:
                product = item_data['product']
                quantity = Decimal(str(item_data['quantity']))
                
                # Get unit_price - Product model uses 'price', not 'unit_price'
                unit_price = item_data.get('unit_price')
                if unit_price is None:
                    unit_price = getattr(product, 'price', Decimal('0.00'))
                else:
                    unit_price = Decimal(str(unit_price))
                
                discount_amount = Decimal(str(item_data.get('discount_amount', 0)))
                tax_rate = Decimal(str(item_data.get('tax_rate', getattr(product, 'tax_rate', Decimal('0.00')))))
                
                # Ensure all values are Decimal
                if not isinstance(unit_price, Decimal):
                    unit_price = Decimal(str(unit_price))
                if not isinstance(discount_amount, Decimal):
                    discount_amount = Decimal(str(discount_amount))
                if not isinstance(tax_rate, Decimal):
                    tax_rate = Decimal(str(tax_rate))
                
                # Calculate amounts
                subtotal = quantity * unit_price
                taxable_amount = subtotal - discount_amount
                tax_amount = (taxable_amount * tax_rate) / Decimal('100')
                line_total = taxable_amount + tax_amount
                
                # Create item (SaleItem model has: quantity, unit_price, discount_amount, tax_amount, line_total)
                SaleItem.objects.create(
                    sale=sale,
                    product=product,
                    quantity=quantity,
                    unit_price=unit_price,
                    discount_amount=discount_amount,
                    tax_amount=tax_amount,
                    line_total=line_total
                )
                
                total_subtotal += subtotal
                total_tax += tax_amount
            except Exception as e:
                # Rollback transaction on error
                raise serializers.ValidationError({
                    'items': f'Error creating sale item: {str(e)}'
                })
        
        # Update sale totals
        sale.subtotal = total_subtotal
        sale.tax_amount = total_tax
        
        # Apply bill-level discount from discount_percentage if provided
        if discount_percentage and discount_percentage > 0:
            sale.discount_amount = (sale.subtotal * Decimal(str(discount_percentage))) / Decimal('100')
        else:
            sale.discount_amount = Decimal('0.00')
        
        # Calculate final total
        sale.total_amount = (
            sale.subtotal +
            sale.tax_amount -
            sale.discount_amount
        )
        
        # Mark as completed if status is completed
        if sale.status == 'completed':
            from django.utils import timezone
            sale.completed_at = timezone.now()
        
        sale.save()
        
        # Create payments if provided
        for payment_data in payments_data:
            try:
                # Create a copy to avoid modifying the original dict
                payment_dict = payment_data.copy()
                # Remove change_amount as it's not a model field (write-only)
                payment_dict.pop('change_amount', None)
                # Remove sale from payment_dict if present (will be set automatically)
                payment_dict.pop('sale', None)
                # Ensure amount is Decimal
                if 'amount' in payment_dict:
                    payment_dict['amount'] = Decimal(str(payment_dict['amount']))
                Payment.objects.create(sale=sale, **payment_dict)
            except Exception as e:
                # Rollback transaction on error
                raise serializers.ValidationError({
                    'payments': f'Error creating payment: {str(e)}'
                })
        
        return sale


class POSSessionSerializer(serializers.ModelSerializer):
    """Serializer for POS sessions."""
    
    cashier_name = serializers.CharField(source='cashier.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    settlement_status_display = serializers.CharField(source='get_settlement_status_display', read_only=True)
    variance_reason_name = serializers.CharField(source='variance_reason.name', read_only=True, default=None)
    
    # Make terminal and location writable for create/update, returns UUID on read
    # These fields are writable (can be set during creation) but return just the UUID when reading
    terminal = serializers.PrimaryKeyRelatedField(
        queryset=Terminal.objects.all() if Terminal else None,
        allow_null=True,
        required=False
    )
    location = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all() if Location else None,
        allow_null=True,
        required=False
    )
    variance_reason = serializers.PrimaryKeyRelatedField(
        queryset=SettlementReason.objects.all() if SettlementReason else None,
        allow_null=True,
        required=False
    )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure querysets are set (in case models weren't available at module import time)
        if Terminal and 'terminal' in self.fields:
            self.fields['terminal'].queryset = Terminal.objects.all()
        if Location and 'location' in self.fields:
            self.fields['location'].queryset = Location.objects.all()
        if SettlementReason and 'variance_reason' in self.fields:
            self.fields['variance_reason'].queryset = SettlementReason.objects.all()
    
    class Meta:
        model = POSSession
        fields = [
            'id', 'session_number', 'cashier', 'cashier_name',
            'terminal', 'location',
            'opening_cash', 'closing_cash', 'expected_cash', 'cash_difference',
            'opened_at', 'closed_at', 'status', 'status_display',
            'close_mode', 'settlement_status', 'settlement_status_display',
            'total_sales', 'notes',
            'base_expected_cash', 'total_counted_cash',
            'interim_settlements', 'variance_reason', 'variance_reason_name'
        ]
        read_only_fields = [
            'id', 'session_number', 'expected_cash', 'cash_difference',
            'opened_at', 'closed_at', 'total_sales',
            'interim_settlements', 'variance_reason_name'
        ]
        extra_kwargs = {
            'interim_settlements': {'required': False},
            'base_expected_cash': {'required': False},
            'total_counted_cash': {'required': False},
        }
    
    def validate(self, attrs):
        """Validate that Day Open exists and no other open session for terminal."""
        # Import here to avoid circular imports
        from .models import DayOpen, POSSession
        
        # Only validate on create
        if self.instance is None:
            # Get terminal and location
            terminal = attrs.get('terminal')
            location = attrs.get('location')
            
            # Validate terminal: Check if another open session exists for this terminal
            if terminal:
                existing_session = POSSession.objects.filter(
                    terminal=terminal,
                    status='open'
                ).exclude(id=self.instance.id if self.instance else None).first()
                
                if existing_session:
                    raise serializers.ValidationError({
                        'terminal': f'Terminal "{terminal.name}" already has an open session ({existing_session.session_number}). Please close the existing session before opening a new one.'
                    })
            
            # Get location from terminal if not provided
            if not location and terminal:
                try:
                    if hasattr(terminal, 'location') and terminal.location:
                        location = terminal.location
                        attrs['location'] = location  # Set it for use later
                except (AttributeError, ValueError):
                    pass
            
            # Try to get from cashier if terminal doesn't have location
            if not location and 'cashier' in attrs and attrs['cashier']:
                try:
                    cashier = attrs['cashier']
                    if hasattr(cashier, 'pos_location') and cashier.pos_location:
                        location = cashier.pos_location
                        attrs['location'] = location  # Set it for use later
                except (AttributeError, ValueError):
                    pass
            
            # Last resort: get from request user
            if not location and self.context.get('request'):
                try:
                    user = self.context['request'].user
                    if hasattr(user, 'pos_location') and user.pos_location:
                        location = user.pos_location
                        attrs['location'] = location  # Set it for use later
                except (AttributeError, ValueError):
                    pass
            
            if not location:
                raise serializers.ValidationError({
                    'location': 'Unable to determine location. Please ensure terminal has a location assigned or user has a POS location.'
                })
            
            # Check if active Day Open exists for this location
            day_open = DayOpen.objects.filter(
                location=location,
                is_active=True
            ).first()
            
            if not day_open:
                raise serializers.ValidationError({
                    'day_open': f'No active day open found for location "{location.name}". Please open a day first from the Day Open page.'
                })
            
            # Store day_open for use in create method
            self._day_open = day_open
        
        return attrs
    
    def create(self, validated_data):
        """Create session using Day Open sequence."""
        # Generate session number from Day Open sequence
        if hasattr(self, '_day_open'):
            validated_data['session_number'] = self.Meta.model.generate_session_number(day_open=self._day_open)
        
        return super().create(validated_data)


class DayOpenSerializer(serializers.ModelSerializer):
    """Serializer for Day Open."""
    
    location_name = serializers.CharField(source='location.name', read_only=True)
    opened_by_name = serializers.CharField(source='opened_by.username', read_only=True)
    closed_by_name = serializers.CharField(source='closed_by.username', read_only=True)
    
    class Meta:
        model = DayOpen
        fields = [
            'id', 'location', 'location_name', 'business_date',
            'opened_by', 'opened_by_name', 'opened_at',
            'next_sale_number', 'next_session_number',
            'is_active', 'closed_at', 'closed_by', 'closed_by_name',
            'notes'
        ]
        read_only_fields = ['id', 'opened_at', 'opened_by', 'location']


class DayCloseSerializer(serializers.ModelSerializer):
    """Serializer for Day Close."""
    
    location_name = serializers.CharField(source='location.name', read_only=True)
    initiated_by_name = serializers.CharField(source='initiated_by.username', read_only=True)
    reverted_by_name = serializers.CharField(source='reverted_by.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = DayClose
        fields = [
            'id', 'location', 'location_name', 'business_date',
            'initiated_by', 'initiated_by_name', 'initiated_at',
            'completed_at', 'reverted_at', 'reverted_by', 'reverted_by_name',
            'status', 'status_display',
            'checklist_items', 'total_transactions', 'total_sales_amount',
            'total_sessions', 'total_items_sold',
            'next_sale_number', 'next_session_number',
            'notes', 'errors', 'warnings'
        ]
        read_only_fields = [
            'id', 'initiated_at', 'initiated_by', 'location',
            'total_transactions', 'total_sales_amount', 'total_sessions', 'total_items_sold',
            'next_sale_number', 'next_session_number', 'errors', 'warnings'
        ]





