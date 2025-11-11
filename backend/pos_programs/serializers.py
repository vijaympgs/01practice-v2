from rest_framework import serializers
from .models import POSProgram

class POSProgramSerializer(serializers.ModelSerializer):
    is_mapped = serializers.ReadOnlyField()
    can_delete = serializers.ReadOnlyField()
    
    class Meta:
        model = POSProgram
        fields = [
            'id', 'name', 'code', 'description', 'is_active',
            'created_at', 'updated_at', 'created_by', 'updated_by',
            'is_mapped', 'can_delete'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']

    def validate_name(self, value):
        """
        Validate that name is unique
        """
        if self.instance:
            # Update case
            if POSProgram.objects.filter(name=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A program with this name already exists.")
        else:
            # Create case
            if POSProgram.objects.filter(name=value).exists():
                raise serializers.ValidationError("A program with this name already exists.")
        return value

    def validate_code(self, value):
        """
        Validate that code is unique and uppercase
        """
        value = value.upper()
        if self.instance:
            # Update case
            if POSProgram.objects.filter(code=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A program with this code already exists.")
        else:
            # Create case
            if POSProgram.objects.filter(code=value).exists():
                raise serializers.ValidationError("A program with this code already exists.")
        return value
