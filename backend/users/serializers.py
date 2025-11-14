from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

User = get_user_model()

try:
    from .models import MenuItemType, UserPermission, GroupPermission, POSFunction, RolePOSFunctionMapping, UserLocationMapping
except ImportError:
    MenuItemType = None
    UserPermission = None
    GroupPermission = None
    POSFunction = None
    RolePOSFunctionMapping = None
    UserLocationMapping = None


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    full_name = serializers.ReadOnlyField()
    
    pos_location = serializers.SerializerMethodField()
    pos_location_id = serializers.UUIDField(source='pos_location.id', read_only=True)
    pos_location_name = serializers.CharField(source='pos_location.name', read_only=True)
    pos_location_code = serializers.CharField(source='pos_location.code', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'role', 'phone', 'profile_image', 
            'pos_location', 'pos_location_id', 'pos_location_name', 'pos_location_code',
            'is_active', 'is_staff', 'is_superuser', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'pos_location', 'pos_location_id', 'pos_location_name', 'pos_location_code', 'is_staff', 'is_superuser']
    
    def get_pos_location(self, obj):
        """Return location details if user has a POS location assigned"""
        if obj.pos_location:
            return {
                'id': str(obj.pos_location.id),
                'name': obj.pos_location.name,
                'code': obj.pos_location.code,
                'location_type': obj.pos_location.location_type,
            }
        return None


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that ensures proper authentication with custom User model.
    """
    username_field = 'username'  # Explicitly set to match our User model
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        token['is_superuser'] = user.is_superuser
        return token
    
    def validate(self, attrs):
        """
        Validate username and password with custom user info in response.
        """
        # Use parent validation first
        data = super().validate(attrs)
        
        # Add user info to response
        if self.user:
            data['user'] = {
                'id': str(self.user.id),
                'username': self.user.username,
                'email': self.user.email,
                'role': self.user.role,
                'full_name': self.user.full_name,
            }
        
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'phone'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user information."""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 
            'phone', 'profile_image', 'role', 'pos_location'
        ]
        read_only_fields = []  # Allow role and pos_location updates for admin


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing user password."""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=6)
    new_password_confirm = serializers.CharField(required=True, write_only=True, min_length=6)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs


# Permission Serializers
if MenuItemType:
    class MenuItemTypeSerializer(serializers.ModelSerializer):
        """Serializer for MenuItemType."""
        
        class Meta:
            model = MenuItemType
            fields = [
                'id', 'menu_item_id', 'display_name', 'menu_type',
                'transaction_subtype', 'category', 'path', 'description',
                'is_active', 'order'
            ]
            read_only_fields = ['id']


if UserPermission:
    class UserPermissionSerializer(serializers.ModelSerializer):
        """Serializer for UserPermission."""
        menu_item_id = serializers.CharField(source='menu_item.menu_item_id', read_only=True)
        menu_item_name = serializers.CharField(source='menu_item.display_name', read_only=True)
        user_username = serializers.CharField(source='user.username', read_only=True)
        
        class Meta:
            model = UserPermission
            fields = [
                'id', 'user', 'user_username', 'menu_item', 'menu_item_id',
                'menu_item_name', 'can_access', 'can_view', 'can_create', 'can_edit',
                'can_delete', 'override', 'created_at', 'updated_at'
            ]
            read_only_fields = ['id', 'created_at', 'updated_at']
        
        def create(self, validated_data):
            # Get menu_item by menu_item_id if passed as string
            menu_item_id = self.initial_data.get('menu_item_id')
            if menu_item_id and isinstance(menu_item_id, str):
                try:
                    menu_item = MenuItemType.objects.get(menu_item_id=menu_item_id)
                    validated_data['menu_item'] = menu_item
                except MenuItemType.DoesNotExist:
                    raise serializers.ValidationError(f'Menu item {menu_item_id} does not exist')
            return super().create(validated_data)


if GroupPermission:
    class GroupPermissionSerializer(serializers.ModelSerializer):
        """Serializer for GroupPermission."""
        
        class Meta:
            model = GroupPermission
            fields = [
                'id', 'group', 'role_key', 'menu_item', 'can_access', 'can_view',
                'can_create', 'can_edit', 'can_delete', 'created_at', 'updated_at'
            ]
            read_only_fields = ['id', 'created_at', 'updated_at']


# Bulk Permission Serializers
class BulkUserPermissionSerializer(serializers.Serializer):
    """Serializer for bulk user permission updates."""
    user_id = serializers.UUIDField()
    permissions = serializers.DictField(
        child=serializers.DictField(
            child=serializers.BooleanField()
        )
    )


class BulkRolePermissionSerializer(serializers.Serializer):
    """Serializer for bulk role permission updates."""
    permissions = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DictField()
        )
    )
    
    def validate(self, attrs):
        """Validate the permissions structure."""
        permissions = attrs.get('permissions', [])
        for role_perm in permissions:
            if 'role_key' not in role_perm:
                raise serializers.ValidationError("Each permission entry must have 'role_key'")
            if 'permissions' not in role_perm:
                raise serializers.ValidationError("Each permission entry must have 'permissions' dict")
        return attrs
    # Format: { menu_item_id: { can_view: true, can_create: true, ... } }


if POSFunction:
    class POSFunctionSerializer(serializers.ModelSerializer):
        """Serializer for POS Function model."""
        
        category_display = serializers.CharField(source='get_category_display', read_only=True)
        
        class Meta:
            model = POSFunction
            fields = [
                'id', 'function_code', 'function_name', 'description',
                'category', 'category_display', 'keyboard_shortcut',
                'is_critical', 'order', 'is_active',
                'created_at', 'updated_at'
            ]
            read_only_fields = ['id', 'created_at', 'updated_at']


if RolePOSFunctionMapping:
    class RolePOSFunctionMappingSerializer(serializers.ModelSerializer):
        """Serializer for Role POS Function Mapping."""
        
        function_code = serializers.CharField(source='function.function_code', read_only=True)
        function_name = serializers.CharField(source='function.function_name', read_only=True)
        keyboard_shortcut = serializers.CharField(source='function.keyboard_shortcut', read_only=True)
        category = serializers.CharField(source='function.category', read_only=True)
        created_by_username = serializers.CharField(source='created_by.username', read_only=True, allow_null=True)
        
        class Meta:
            model = RolePOSFunctionMapping
            fields = [
                'id', 'role', 'function', 'function_code', 'function_name',
                'keyboard_shortcut', 'category', 'is_allowed', 'requires_approval',
                'created_by', 'created_by_username', 'created_at', 'updated_at'
            ]
            read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
        
        def create(self, validated_data):
            """Set created_by to current user."""
            validated_data['created_by'] = self.context['request'].user
            return super().create(validated_data)
        
        def update(self, instance, validated_data):
            """Update mapping."""
            return super().update(instance, validated_data)


if UserLocationMapping:
    class UserLocationMappingSerializer(serializers.ModelSerializer):
        """Serializer for User Location Mapping."""
        
        user_username = serializers.CharField(source='user.username', read_only=True)
        user_full_name = serializers.CharField(source='user.full_name', read_only=True)
        location_name = serializers.CharField(source='location.name', read_only=True)
        location_code = serializers.CharField(source='location.code', read_only=True)
        location_type = serializers.CharField(source='location.location_type', read_only=True)
        access_type_display = serializers.CharField(source='get_access_type_display', read_only=True)
        created_by_username = serializers.CharField(source='created_by.username', read_only=True, allow_null=True)
        
        class Meta:
            model = UserLocationMapping
            fields = [
                'id', 'user', 'user_username', 'user_full_name', 'location', 
                'location_name', 'location_code', 'location_type', 'access_type', 
                'access_type_display', 'is_active', 'is_default', 'created_at', 
                'updated_at', 'created_by', 'created_by_username'
            ]
            read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
        
        def create(self, validated_data):
            """Set created_by to current user."""
            validated_data['created_by'] = self.context['request'].user
            return super().create(validated_data)
        
        def update(self, instance, validated_data):
            """Update mapping."""
            return super().update(instance, validated_data)


class UserLocationMappingGridSerializer(serializers.Serializer):
    """Serializer for user-location mapping grid data."""
    
    user_id = serializers.UUIDField()
    username = serializers.CharField()
    full_name = serializers.CharField()
    role = serializers.CharField()
    location_mappings = serializers.DictField(
        child=serializers.DictField(
            child=serializers.BooleanField()
        )
    )
    
    def to_representation(self, instance):
        """Custom representation for grid format."""
        if isinstance(instance, dict):
            return instance
        return super().to_representation(instance)


class BulkUserLocationMappingSerializer(serializers.Serializer):
    """Serializer for bulk user-location mapping updates."""
    
    mappings = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    
    def validate(self, attrs):
        """Validate the mappings structure."""
        mappings = attrs.get('mappings', [])
        for mapping in mappings:
            if 'user_id' not in mapping:
                raise serializers.ValidationError("Each mapping must have 'user_id'")
            if 'location_id' not in mapping:
                raise serializers.ValidationError("Each mapping must have 'location_id'")
            if 'access_type' not in mapping:
                raise serializers.ValidationError("Each mapping must have 'access_type'")
        return attrs
