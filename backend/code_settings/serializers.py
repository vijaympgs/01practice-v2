from rest_framework import serializers
from .models import CodeSetting, CodeSettingHistory, CodeSettingTemplate, CodeSettingRule

class CodeSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSetting
        fields = '__all__'

class CodeSettingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSettingHistory
        fields = '__all__'

class CodeSettingTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSettingTemplate
        fields = '__all__'

class CodeSettingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSettingRule
        fields = '__all__'
