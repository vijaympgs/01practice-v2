from rest_framework import serializers
from .models import BusinessRule, BusinessRuleHistory, SettlementSettings, SettlementSettingDefinition

class BusinessRuleSerializer(serializers.ModelSerializer):
    current_value_display = serializers.SerializerMethodField()
    
    class Meta:
        model = BusinessRule
        fields = [
            'id', 'name', 'code', 'description', 'category', 'rule_type',
            'default_value', 'current_value', 'current_value_display',
            'is_active', 'is_required', 'help_text', 'validation_rules',
            'sequence', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = ['sequence', 'created_at', 'updated_at', 'created_by', 'updated_by']
    
    def get_current_value_display(self, obj):
        """Get formatted display value based on rule type"""
        if obj.rule_type == 'boolean':
            return 'Yes' if obj.get_value() else 'No'
        elif obj.rule_type == 'choice':
            choices = obj.validation_rules.get('choices', [])
            value = obj.get_value()
            for choice in choices:
                if choice['value'] == value:
                    return choice['label']
            return value
        else:
            return obj.current_value

class BusinessRuleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessRule
        fields = ['current_value']
    
    def validate_current_value(self, value):
        """Validate value based on rule type"""
        rule_type = self.instance.rule_type
        
        if rule_type == 'boolean':
            if value.lower() not in ['true', 'false']:
                raise serializers.ValidationError("Boolean value must be 'true' or 'false'")
        elif rule_type == 'integer':
            try:
                int(value)
            except ValueError:
                raise serializers.ValidationError("Value must be a valid integer")
        elif rule_type == 'decimal':
            try:
                float(value)
            except ValueError:
                raise serializers.ValidationError("Value must be a valid decimal number")
        elif rule_type == 'choice':
            choices = self.instance.validation_rules.get('choices', [])
            valid_values = [choice['value'] for choice in choices]
            if value not in valid_values:
                raise serializers.ValidationError(f"Value must be one of: {', '.join(valid_values)}")
        
        return value

class BusinessRuleHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.full_name', read_only=True)
    
    class Meta:
        model = BusinessRuleHistory
        fields = [
            'id', 'business_rule', 'old_value', 'new_value',
            'changed_by', 'changed_by_name', 'changed_at', 'reason'
        ]
        read_only_fields = ['id', 'changed_at']

class SettlementSettingsSerializer(serializers.ModelSerializer):
    """Serializer for Settlement Settings"""
    updated_by_name = serializers.CharField(source='updated_by.full_name', read_only=True)
    
    class Meta:
        model = SettlementSettings
        fields = [
            'id',
            'check_suspended_bills',
            'check_partial_transactions',
            'require_settlement_before_session_close',
            'allow_deferred_settlement',
            'require_session_ownership_to_close',
            'block_billing_on_pending_settlement',
            'block_session_start_on_pending_settlement',
            'show_pending_settlement_alert',
            'auto_remind_pending_settlement',
            'created_at',
            'updated_at',
            'updated_by',
            'updated_by_name'
        ]
        read_only_fields = ['created_at', 'updated_at', 'updated_by']


class SettlementSettingDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettlementSettingDefinition
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
