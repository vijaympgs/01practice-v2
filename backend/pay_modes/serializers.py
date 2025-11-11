from rest_framework import serializers
from .models import PayMode, PayModeSettings, PayModeHistory, PayModeSettingDefinition

class PayModeSerializer(serializers.ModelSerializer):
    payment_type_display = serializers.CharField(source='get_payment_type_display', read_only=True)
    is_available = serializers.SerializerMethodField()
    
    class Meta:
        model = PayMode
        fields = [
            'id', 'name', 'code', 'payment_type', 'payment_type_display',
            'description', 'is_active', 'requires_authorization',
            'min_amount', 'max_amount', 'display_order', 'icon_name',
            'color_code', 'allow_refund', 'allow_partial_refund',
            'requires_receipt', 'is_available', 'created_at', 'updated_at',
            'created_by', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']
    
    def get_is_available(self, obj):
        """Check if payment method is available for a given amount"""
        amount = self.context.get('amount', 0)
        return obj.is_available_for_amount(amount)

class PayModeCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayMode
        fields = [
            'name', 'code', 'payment_type', 'description', 'is_active',
            'requires_authorization', 'min_amount', 'max_amount',
            'display_order', 'icon_name', 'color_code', 'allow_refund',
            'allow_partial_refund', 'requires_receipt'
        ]
    
    def validate_code(self, value):
        """Ensure code is uppercase and unique"""
        value = value.upper()
        if PayMode.objects.filter(code=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("A payment method with this code already exists.")
        return value
    
    def validate_min_amount(self, value):
        """Validate minimum amount"""
        if value < 0:
            raise serializers.ValidationError("Minimum amount cannot be negative.")
        return value
    
    def validate_max_amount(self, value):
        """Validate maximum amount"""
        if value <= 0:
            raise serializers.ValidationError("Maximum amount must be positive.")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        min_amount = data.get('min_amount', 0)
        max_amount = data.get('max_amount', 999999.99)
        
        if min_amount > max_amount:
            raise serializers.ValidationError("Minimum amount cannot be greater than maximum amount.")
        
        return data

class PayModeSettingsSerializer(serializers.ModelSerializer):
    default_cash_paymode_name = serializers.CharField(source='default_cash_paymode.name', read_only=True)
    
    class Meta:
        model = PayModeSettings
        fields = [
            'id', 'default_cash_paymode', 'default_cash_paymode_name',
            'require_payment_confirmation', 'allow_multiple_payments',
            'enable_cash_drawer', 'auto_open_cash_drawer',
            'enable_card_payments', 'require_card_pin',
            'enable_upi_payments', 'enable_qr_code',
            'allow_refunds', 'require_refund_authorization',
            'max_refund_percentage', 'created_at', 'updated_at', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'updated_by']

class PayModeHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.full_name', read_only=True)
    paymode_name = serializers.CharField(source='paymode.name', read_only=True)
    
    class Meta:
        model = PayModeHistory
        fields = [
            'id', 'paymode', 'paymode_name', 'field_name',
            'old_value', 'new_value', 'changed_by', 'changed_by_name',
            'changed_at', 'reason'
        ]
        read_only_fields = ['id', 'changed_at']


class PayModeSettingDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayModeSettingDefinition
        fields = [
            'id',
            'category_key',
            'category_title',
            'category_sequence',
            'field_name',
            'field_label',
            'description',
            'sequence',
            'is_active',
            'help_text',
        ]
        read_only_fields = fields
