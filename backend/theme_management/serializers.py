from rest_framework import serializers
from .models import ThemeSetting

class ThemeSettingSerializer(serializers.ModelSerializer):
    """Serializer for Theme Setting model"""
    
    class Meta:
        model = ThemeSetting
        fields = [
            'id',
            'theme_name',
            'primary_color',
            'secondary_color',
            'background_color',
            'is_active',
            'created_at',
            'updated_at',
            'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        # Set the current user as creator
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class ThemeSettingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for theme list"""
    
    class Meta:
        model = ThemeSetting
        fields = [
            'id',
            'theme_name',
            'primary_color',
            'secondary_color',
            'is_active',
            'created_at'
        ]

class ActiveThemeSerializer(serializers.ModelSerializer):
    """Serializer for active theme only"""
    
    class Meta:
        model = ThemeSetting
        fields = [
            'theme_name',
            'primary_color',
            'secondary_color',
            'background_color'
        ]
