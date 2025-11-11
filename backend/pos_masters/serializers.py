from rest_framework import serializers
from .models import (
    POSMaster, POSMasterSettings, POSMasterHistory, POSMasterMapping, 
    CurrencyDenomination, Terminal, PrinterTemplate, TerminalTransactionSetting,
    TerminalTenderMapping, TerminalDepartmentMapping, SettlementReason
)

class POSMasterSerializer(serializers.ModelSerializer):
    master_type_display = serializers.CharField(source='get_master_type_display', read_only=True)
    can_be_deleted_display = serializers.SerializerMethodField()
    
    class Meta:
        model = POSMaster
        fields = [
            'id', 'name', 'code', 'master_type', 'master_type_display',
            'description', 'is_active', 'is_system_generated', 'requires_authorization',
            'display_order', 'icon_name', 'color_code', 'allow_edit', 'allow_delete',
            'can_be_deleted_display', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']
    
    def get_can_be_deleted_display(self, obj):
        """Get whether this master data can be deleted"""
        return obj.can_be_deleted()

class POSMasterCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = POSMaster
        fields = [
            'name', 'code', 'master_type', 'description', 'is_active',
            'requires_authorization', 'display_order', 'icon_name',
            'color_code', 'allow_edit', 'allow_delete'
        ]
    
    def validate_code(self, value):
        """Ensure code is uppercase and unique within master type"""
        value = value.upper()
        master_type = self.initial_data.get('master_type')
        if POSMaster.objects.filter(code=value, master_type=master_type).exclude(
            id=self.instance.id if self.instance else None
        ).exists():
            raise serializers.ValidationError("A master data with this code already exists for this type.")
        return value
    
    def validate_name(self, value):
        """Validate name uniqueness if required"""
        master_type = self.initial_data.get('master_type')
        if POSMaster.objects.filter(name=value, master_type=master_type).exclude(
            id=self.instance.id if self.instance else None
        ).exists():
            raise serializers.ValidationError("A master data with this name already exists for this type.")
        return value

class POSMasterSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = POSMasterSettings
        fields = [
            'id', 'enable_auto_code_generation', 'code_prefix_length',
            'allow_duplicate_names', 'default_display_order', 'show_inactive_items',
            'require_description', 'validate_code_format', 'created_at', 'updated_at', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'updated_by']

class POSMasterHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.full_name', read_only=True)
    pos_master_name = serializers.CharField(source='pos_master.name', read_only=True)
    
    class Meta:
        model = POSMasterHistory
        fields = [
            'id', 'pos_master', 'pos_master_name', 'field_name',
            'old_value', 'new_value', 'changed_by', 'changed_by_name',
            'changed_at', 'reason'
        ]
        read_only_fields = ['id', 'changed_at']

class POSMasterMappingSerializer(serializers.ModelSerializer):
    mapping_type_display = serializers.CharField(source='get_mapping_type_display', read_only=True)
    pos_master_name = serializers.CharField(source='pos_master.name', read_only=True)
    
    class Meta:
        model = POSMasterMapping
        fields = [
            'id', 'pos_master', 'pos_master_name', 'mapping_type', 'mapping_type_display',
            'mapped_entity_id', 'mapped_entity_name', 'is_active',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']

class CurrencyDenominationSerializer(serializers.ModelSerializer):
    """Serializer for Currency Denomination"""
    denomination_type_display = serializers.CharField(source='get_denomination_type_display', read_only=True)
    currency_code = serializers.CharField(source='currency.code', read_only=True)
    currency_name = serializers.CharField(source='currency.name', read_only=True)
    
    class Meta:
        model = CurrencyDenomination
        fields = [
            'id', 'currency', 'currency_code', 'currency_name',
            'denomination_type', 'denomination_type_display',
            'value', 'display_name', 'display_order', 'is_active',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def validate_currency(self, value):
        """Ensure currency has master_type='currency'"""
        if value.master_type != 'currency':
            raise serializers.ValidationError("Selected POS Master must be of type 'currency'")
        return value


class PrinterTemplateSerializer(serializers.ModelSerializer):
    """Serializer for PrinterTemplate model"""
    template_type_display = serializers.CharField(source='get_template_type_display', read_only=True)
    
    class Meta:
        model = PrinterTemplate
        fields = [
            'id', 'name', 'template_type', 'template_type_display',
            'template_content', 'is_default', 'is_active',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class TerminalTransactionSettingSerializer(serializers.ModelSerializer):
    """Serializer for TerminalTransactionSetting model"""
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    printer_template_detail = PrinterTemplateSerializer(source='printer_template', read_only=True)
    
    class Meta:
        model = TerminalTransactionSetting
        fields = [
            'id', 'terminal', 'transaction_type', 'transaction_type_display',
            'allow', 'printer_template', 'printer_template_detail',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class TerminalTenderMappingSerializer(serializers.ModelSerializer):
    """Serializer for TerminalTenderMapping model"""
    tender_type_display = serializers.CharField(source='get_tender_type_display', read_only=True)
    
    class Meta:
        model = TerminalTenderMapping
        fields = [
            'id', 'terminal', 'tender_type', 'tender_type_display',
            'minimum_value', 'maximum_value', 'allow_tender', 'allow_refund',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class TerminalDepartmentMappingSerializer(serializers.ModelSerializer):
    """Serializer for TerminalDepartmentMapping model"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_id = serializers.UUIDField(source='department.id', read_only=True)
    
    class Meta:
        model = TerminalDepartmentMapping
        fields = [
            'id', 'terminal', 'department', 'department_id', 'department_name',
            'allow', 'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class SettlementReasonSerializer(serializers.ModelSerializer):
    reason_type_display = serializers.CharField(source='get_reason_type_display', read_only=True)

    class Meta:
        model = SettlementReason
        fields = [
            'id', 'code', 'name', 'reason_type', 'reason_type_display',
            'module_ref', 'app_ref', 'description', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class TerminalSerializer(serializers.ModelSerializer):
    """Serializer for Terminal model with related objects"""
    terminal_type_display = serializers.CharField(source='get_terminal_type_display', read_only=True)
    network_type_display = serializers.CharField(source='get_network_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_id = serializers.UUIDField(source='company.id', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    location_id = serializers.UUIDField(source='location.id', read_only=True)
    
    # Nested serializers for related objects
    transaction_settings = TerminalTransactionSettingSerializer(many=True, read_only=True)
    tender_mappings = TerminalTenderMappingSerializer(many=True, read_only=True)
    department_mappings = TerminalDepartmentMappingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Terminal
        fields = [
            'id', 'name', 'terminal_code', 'terminal_type', 'terminal_type_display',
            'description', 'is_active', 'status', 'status_display',
            'company', 'company_id', 'company_name',
            'location', 'location_id', 'location_name',
            'floor_location', 'department',
            'contact_person', 'contact_phone', 'contact_email',
            'operating_hours', 'installation_date',
            'ip_address', 'mac_address', 'serial_number',
            'network_type', 'network_type_display',
            'wifi_ssid', 'wifi_password',
            'hardware_config',
            'currency', 'language', 'timezone', 'date_format', 'time_format',
            'allow_discounts', 'allow_refunds', 'require_customer_info',
            'max_transaction_amount', 'min_transaction_amount',
            'max_discount_percentage', 'require_manager_approval',
            'auto_receipt', 'auto_print', 'enable_loyalty', 'enable_offline_mode',
            'sync_interval', 'session_timeout',
            'tax_rate', 'tax_inclusive', 'enable_tax_calculation',
            'auto_backup', 'backup_interval', 'backup_retention',
            'require_pin', 'audit_log_enabled', 'enable_biometric',
            'max_login_attempts', 'lockout_duration',
            'system_name', 'auto_login_pos',  # NEW FIELDS
            'transaction_settings', 'tender_mappings', 'department_mappings',  # NESTED RELATIONSHIPS
            'last_sync', 'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by', 'last_sync', 'system_name', 
                          'transaction_settings', 'tender_mappings', 'department_mappings']


class TerminalCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating Terminal"""
    
    # Make system_name writable so it can be set manually (e.g., from client hostname)
    # If not provided, it will be auto-populated in the model's save() method
    system_name = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
        help_text="System hostname/PC name. If not provided, will be auto-generated from server hostname."
    )
    
    class Meta:
        model = Terminal
        fields = [
            'name', 'terminal_code', 'terminal_type', 'description', 'is_active',
            'company', 'location', 'floor_location', 'department',
            'contact_person', 'contact_phone', 'contact_email',
            'operating_hours', 'installation_date',
            'ip_address', 'mac_address', 'serial_number',
            'network_type', 'wifi_ssid', 'wifi_password',
            'hardware_config',
            'currency', 'language', 'timezone', 'date_format', 'time_format',
            'allow_discounts', 'allow_refunds', 'require_customer_info',
            'max_transaction_amount', 'min_transaction_amount',
            'max_discount_percentage', 'require_manager_approval',
            'auto_receipt', 'auto_print', 'enable_loyalty', 'enable_offline_mode',
            'sync_interval', 'session_timeout',
            'tax_rate', 'tax_inclusive', 'enable_tax_calculation',
            'auto_backup', 'backup_interval', 'backup_retention',
            'require_pin', 'audit_log_enabled', 'enable_biometric',
            'max_login_attempts', 'lockout_duration',
            'system_name',  # Now writable - can be set manually
            'auto_login_pos',
            'status'
        ]
    
    def validate_terminal_code(self, value):
        """Ensure terminal code is unique"""
        if Terminal.objects.filter(terminal_code=value).exclude(
            id=self.instance.id if self.instance else None
        ).exists():
            raise serializers.ValidationError("A terminal with this code already exists.")
        return value.upper()  # Convert to uppercase


# Additional serializer for detailed terminal view with nested relationships
class TerminalDetailSerializer(TerminalSerializer):
    """Enhanced Terminal serializer with all nested relationships - extends TerminalSerializer"""
    pass  # Already has all fields from TerminalSerializer
