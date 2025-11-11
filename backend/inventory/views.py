from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, models
from django.utils import timezone
from django.db.models import Sum, Count, Q
from .models import Inventory, StockMovement, PurchaseOrder, PurchaseOrderItem, StockAlert
from .serializers import (
    InventorySerializer, InventoryListSerializer, StockMovementSerializer,
    PurchaseOrderSerializer, PurchaseOrderCreateSerializer, StockAlertSerializer,
    StockAdjustmentSerializer, InventoryStatsSerializer
)


class InventoryViewSet(viewsets.ModelViewSet):
    """ViewSet for inventory management"""
    
    queryset = Inventory.objects.select_related('product', 'product__category').all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return InventoryListSerializer
        return InventorySerializer

    def get_queryset(self):
        """Filter inventory by various parameters"""
        queryset = Inventory.objects.select_related('product', 'product__category').all()
        
        # Filter by product
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
            
        # Filter by category
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(product__category_id=category_id)
            
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        # Search by product name or SKU
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(product__name__icontains=search) |
                Q(product__sku__icontains=search) |
                Q(product__description__icontains=search)
            )
            
        # Filter low stock items
        low_stock = self.request.query_params.get('low_stock')
        if low_stock == 'true':
            queryset = queryset.filter(current_stock__lte=models.F('min_stock_level'))
            
        return queryset

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        """Adjust stock levels"""
        inventory = self.get_object()
        serializer = StockAdjustmentSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            
            with transaction.atomic():
                # Calculate new quantity
                if data['adjustment_type'] == 'increase':
                    quantity_change = data['quantity']
                elif data['adjustment_type'] == 'decrease':
                    quantity_change = -data['quantity']
                else:  # set
                    quantity_change = data['quantity'] - inventory.current_stock
                
                # Create stock movement
                StockMovement.objects.create(
                    inventory=inventory,
                    movement_type='adjustment',
                    quantity_change=quantity_change,
                    unit_cost=inventory.cost_price,
                    reason=data['reason'],
                    notes=data.get('notes', ''),
                    created_by=request.user
                )
                
            return Response({'message': 'Stock adjusted successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reserve_stock(self, request, pk=None):
        """Reserve stock for an order"""
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        if quantity <= 0:
            return Response({'error': 'Quantity must be greater than 0'}, status=status.HTTP_400_BAD_REQUEST)
            
        if inventory.reserve_stock(quantity):
            return Response({'message': f'Reserved {quantity} units of {inventory.product.name}'})
        else:
            return Response({'error': 'Not enough stock available'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def release_stock(self, request, pk=None):
        """Release reserved stock"""
        inventory = self.get_object()  
        quantity = request.data.get('quantity', 0)
        
        inventory.release_reserved_stock(quantity)
        return Response({'message': f'Released {quantity} units of {inventory.product.name}'})

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get low stock items"""
        queryset = self.get_queryset().filter(current_stock__lte=models.F('min_stock_level'))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get inventory statistics"""
        stats = Inventory.objects.aggregate(
            total_items=Count('id'),
            total_value=Sum(models.F('current_stock') * models.F('cost_price')),
            low_stock_count=Count('id', filter=Q(current_stock__lte=models.F('min_stock_level'))),
            out_of_stock_count=Count('id', filter=Q(current_stock=0))
        )
        
        alert_count = StockAlert.objects.filter(is_active=True).count()
        recent_movements = StockMovement.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()
        
        stats.update({
            'alert_count': alert_count,
            'recent_movements': recent_movements
        })
        
        serializer = InventoryStatsSerializer(stats)
        return Response(serializer.data)


class StockMovementViewSet(viewsets.ModelViewSet):
    """ViewSet for stock movements - supports create for opening stock"""
    
    queryset = StockMovement.objects.select_related(
        'inventory', 'inventory__product', 'supplier', 'created_by'
    ).all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """Set created_by to current user"""
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        """Filter movements by various parameters"""
        queryset = StockMovement.objects.select_related(
            'inventory', 'inventory__product', 'supplier', 'created_by'
        ).all()
        
        # Filter by inventory item
        inventory_id = self.request.query_params.get('inventory_id')
        if inventory_id:
            queryset = queryset.filter(inventory_id=inventory_id)
            
        # Filter by movement type
        movement_type = self.request.query_params.get('movement_type')
        if movement_type:
            queryset = queryset.filter(movement_type=movement_type)
            
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
            
        # Filter by supplier
        supplier_id = self.request.query_params.get('supplier_id')
        if supplier_id:
            queryset = queryset.filter(supplier_id=supplier_id)
            
        return queryset


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """ViewSet for purchase order management"""
    
    queryset = PurchaseOrder.objects.select_related('supplier', 'created_by', 'approved_by').prefetch_related('items').all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return PurchaseOrderCreateSerializer
        return PurchaseOrderSerializer

    def get_queryset(self):
        """Filter purchase orders"""
        queryset = PurchaseOrder.objects.select_related('supplier', 'created_by', 'approved_by').prefetch_related('items').all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        # Filter by supplier
        supplier_id = self.request.query_params.get('supplier_id')
        if supplier_id:
            queryset = queryset.filter(supplier_id=supplier_id)
            
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(order_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(order_date__lte=end_date)
            
        return queryset

    def create(self, request, *args, **kwargs):
        """Create purchase order with items"""
        serializer = PurchaseOrderCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                # Create purchase order
                purchase_order = PurchaseOrder.objects.create(
                    supplier=serializer.validated_data['supplier'],
                    priority=serializer.validated_data.get('priority', 'medium'),
                    expected_delivery_date=serializer.validated_data.get('expected_delivery_date'),
                    notes=serializer.validated_data.get('notes', ''),
                    terms_conditions=serializer.validated_data.get('terms_conditions', ''),
                    created_by=request.user
                )
                
                # Create purchase order items
                for item_data in serializer.validated_data['items']:
                    PurchaseOrderItem.objects.create(
                        purchase_order=purchase_order,
                        product=item_data['product'],
                        quantity_ordered=item_data['quantity_ordered'],
                        unit_cost=item_data['unit_cost'],
                        discount_percentage=item_data.get('discount_percentage', 0),
                        expected_delivery_date=item_data.get('expected_delivery_date'),
                        notes=item_data.get('notes', '')
                    )
                
                # Calculate totals
                purchase_order.calculate_total()
                
            response_serializer = PurchaseOrderSerializer(purchase_order)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve purchase order"""
        purchase_order = self.get_object()
        purchase_order.approve(request.user)
        
        serializer = PurchaseOrderSerializer(purchase_order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        """Receive purchase order items"""
        purchase_order = self.get_object()
        item_data = request.data.get('items', [])
        
        if not item_data:
            return Response({'error': 'Items data required'}, status=status.HTTP_400_BAD_REQUEST)
            
        with transaction.atomic():
            for item_info in item_data:
                try:
                    item = PurchaseOrderItem.objects.get(
                        id=item_info['id'],
                        purchase_order=purchase_order
                    )
                    received_qty = item_info.get('quantity_received', 0)
                    
                    if received_qty > 0:
                        item.quantity_received += received_qty
                        item.save()
                        
                        if item.is_fully_received():
                            purchase_order.status = 'partial'
                            
                except PurchaseOrderItem.DoesNotExist:
                    return Response({'error': f'Item {item_info["id"]} not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if all items are fully received
            if all(item.is_fully_received() for item in purchase_order.items.all()):
                purchase_order.status = 'received'
                purchase_order.save()
                purchase_order.create_stock_movements()
                
        serializer = PurchaseOrderSerializer(purchase_order)
        return Response(serializer.data)


class StockAlertViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only ViewSet for stock alerts"""
    
    queryset = StockAlert.objects.select_related('product', 'resolved_by').all()
    serializer_class = StockAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter stock alerts"""
        queryset = StockAlert.objects.select_related('product', 'resolved_by').all()
        
        # Filter active alerts
        active_only = self.request.query_params.get('active_only')
        if active_only == 'true':
            queryset = queryset.filter(is_active=True, is_resolved=False)
            
        # Filter by alert type
        alert_type = self.request.query_params.get('alert_type')
        if alert_type:
            queryset = queryset.filter(alert_type=alert_type)
            
        # Filter by severity
        severity = self.request.query_params.get('severity')
        if severity:
            queryset = queryset.filter(severity=severity)
            
        return queryset

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve stock alert"""
        alert = self.get_object()
        notes = request.data.get('notes', '')
        
        alert.resolve(request.user, notes)
        
        serializer = StockAlertSerializer(alert)
        return Response(serializer.data)
