from rest_framework import serializers
from .models import Country, State, City


class CountrySerializer(serializers.ModelSerializer):
    """Serializer for Country model"""
    
    state_count = serializers.SerializerMethodField()
    city_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Country
        fields = [
            'id', 'name', 'code', 'phone_code', 'currency_code',
            'is_active', 'created_at', 'updated_at',
            'state_count', 'city_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'state_count', 'city_count']
    
    def validate_code(self, value):
        """Validate country code"""
        if not value.isupper():
            raise serializers.ValidationError("Country code must be uppercase")
        return value
    
    def get_state_count(self, obj):
        """Get count of states for this country"""
        return obj.states.count()
    
    def get_city_count(self, obj):
        """Get count of cities for this country"""
        return obj.cities.count()


class StateSerializer(serializers.ModelSerializer):
    """Serializer for State model"""
    
    country_name = serializers.CharField(source='country.name', read_only=True)
    country_code = serializers.CharField(source='country.code', read_only=True)
    city_count = serializers.SerializerMethodField()
    
    class Meta:
        model = State
        fields = [
            'id', 'name', 'code', 'country', 'country_name', 'country_code',
            'is_active', 'created_at', 'updated_at', 'city_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'country_name', 'country_code', 'city_count']
    
    def get_city_count(self, obj):
        """Get count of cities for this state"""
        return obj.cities.count()


class CitySerializer(serializers.ModelSerializer):
    """Serializer for City model"""
    
    state_name = serializers.CharField(source='state.name', read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)
    country_code = serializers.CharField(source='country.code', read_only=True)
    full_address = serializers.ReadOnlyField()
    
    class Meta:
        model = City
        fields = [
            'id', 'name', 'code', 'state', 'country', 'state_name', 'country_name', 'country_code',
            'postal_code', 'latitude', 'longitude', 'is_active', 'created_at', 'updated_at',
            'full_address'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'state_name', 'country_name', 'country_code', 'full_address']


class CountryListSerializer(serializers.ModelSerializer):
    """Simplified serializer for country list views"""
    
    class Meta:
        model = Country
        fields = ['id', 'name', 'code', 'phone_code', 'currency_code', 'is_active']


class StateListSerializer(serializers.ModelSerializer):
    """Simplified serializer for state list views"""
    
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = State
        fields = ['id', 'name', 'code', 'country', 'country_name', 'is_active']


class CityListSerializer(serializers.ModelSerializer):
    """Simplified serializer for city list views"""
    
    state_name = serializers.CharField(source='state.name', read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = City
        fields = ['id', 'name', 'code', 'state', 'country', 'state_name', 'country_name', 'is_active']
