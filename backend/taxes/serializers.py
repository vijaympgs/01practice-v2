from rest_framework import serializers
from .models import TaxType, TaxRate

class TaxTypeSerializer(serializers.ModelSerializer):
    """Serializer for TaxType model"""
    tax_rate_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TaxType
        fields = [
            'id', 'name', 'code', 'description', 'country', 
            'is_active', 'created_at', 'updated_at', 'tax_rate_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'tax_rate_count']

    def get_tax_rate_count(self, obj):
        return obj.tax_rates.count()

class TaxRateSerializer(serializers.ModelSerializer):
    """Serializer for TaxRate model"""
    tax_type_name = serializers.CharField(source='tax_type.name', read_only=True)
    tax_type_code = serializers.CharField(source='tax_type.code', read_only=True)
    
    class Meta:
        model = TaxRate
        fields = [
            'id', 'tax_type', 'tax_type_name', 'tax_type_code', 'name', 
            'rate', 'description', 'country', 'sort_order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class TaxRateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating TaxRate instances"""
    
    class Meta:
        model = TaxRate
        fields = [
            'tax_type', 'name', 'rate', 'description', 
            'country', 'sort_order', 'is_active'
        ]

class BulkTaxRateCreateSerializer(serializers.Serializer):
    """Serializer for bulk creating tax rates"""
    tax_rates = TaxRateCreateSerializer(many=True)
    
    def create(self, validated_data):
        tax_rates_data = validated_data['tax_rates']
        created_tax_rates = []
        
        for tax_rate_data in tax_rates_data:
            tax_rate = TaxRate.objects.create(**tax_rate_data)
            created_tax_rates.append(tax_rate)
        
        return {'tax_rates': created_tax_rates}



