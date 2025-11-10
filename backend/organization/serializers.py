from rest_framework import serializers
from .models import Company, Location, OperatingHours


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company model"""
    
    full_address = serializers.ReadOnlyField()
    contact_info = serializers.ReadOnlyField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'code', 'description',
            'address', 'city', 'state', 'country', 'postal_code',
            'phone', 'email', 'website',
            'tax_id', 'registration_number', 'currency', 'timezone',
            'logo', 'is_active', 'created_at', 'updated_at',
            'full_address', 'contact_info'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_code(self, value):
        """Validate company code"""
        if not value.isupper():
            raise serializers.ValidationError("Code must be uppercase")
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        if value and value.strip():
            # Basic email validation - check for @ and basic format
            if '@' not in value or '.' not in value.split('@')[1]:
                raise serializers.ValidationError("Invalid email format")
        return value


class CompanyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for company list views"""
    
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'code', 'logo', 'logo_url', 'is_active', 'city', 'country']
        read_only_fields = ['logo_url']
    
    def get_logo_url(self, obj):
        """Return full URL for logo if it exists"""
        try:
            if obj.logo and hasattr(obj.logo, 'url'):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.logo.url)
                # Fallback if no request context
                return obj.logo.url if obj.logo.url else None
        except (AttributeError, ValueError) as e:
            # Handle cases where logo field exists but file is missing
            return None
        return None


class LocationSerializer(serializers.ModelSerializer):
    """Serializer for Location model"""
    
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_code = serializers.CharField(source='company.code', read_only=True)
    full_address = serializers.ReadOnlyField()
    coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = Location
        fields = [
            'id', 'name', 'code', 'description', 'company',
            'company_name', 'company_code',
            'address', 'city', 'state', 'country', 'postal_code',
            'phone', 'email', 'manager',
            'location_type', 'latitude', 'longitude', 'coordinates',
            'operating_hours', 'is_active', 'created_at', 'updated_at',
            'full_address'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'company_name', 'company_code']
    
    def validate_code(self, value):
        """Validate location code"""
        if not value.isupper():
            raise serializers.ValidationError("Code must be uppercase")
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        if value and value.strip():
            # Basic email validation - check for @ and basic format
            if '@' not in value or '.' not in value.split('@')[1]:
                raise serializers.ValidationError("Invalid email format")
        return value
    
    def validate_latitude(self, value):
        """Validate latitude"""
        if value is not None and (value < -90 or value > 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value
    
    def validate_location_type(self, value):
        """Validate location type"""
        if value == 'headquarters':
            company_id = self.initial_data.get('company')
            if company_id:
                # Check if company already has a headquarters
                existing_headquarters = Location.objects.filter(
                    company_id=company_id,
                    location_type='headquarters',
                    is_active=True
                ).exclude(id=self.instance.id if self.instance else None)
                
                if existing_headquarters.exists():
                    raise serializers.ValidationError(
                        "Only one headquarters location is allowed per company."
                    )
        return value


class LocationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for location list views"""
    
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'code', 'company_name', 'location_type', 'city', 'is_active']


class OperatingHoursSerializer(serializers.ModelSerializer):
    """Serializer for OperatingHours model"""
    
    class Meta:
        model = OperatingHours
        fields = ['id', 'location', 'day', 'is_open', 'open_time', 'close_time']
        read_only_fields = ['id']


class CompanyDetailSerializer(CompanySerializer):
    """Detailed serializer for company with related locations"""
    
    locations = LocationListSerializer(many=True, read_only=True)
    location_count = serializers.SerializerMethodField()
    
    class Meta(CompanySerializer.Meta):
        fields = CompanySerializer.Meta.fields + ['locations', 'location_count']
    
    def get_location_count(self, obj):
        """Get count of locations for this company"""
        return obj.locations.count()


class LocationDetailSerializer(LocationSerializer):
    """Detailed serializer for location with operating hours"""
    
    operating_hours_detail = OperatingHoursSerializer(many=True, read_only=True)
    
    class Meta(LocationSerializer.Meta):
        fields = LocationSerializer.Meta.fields + ['operating_hours_detail']
