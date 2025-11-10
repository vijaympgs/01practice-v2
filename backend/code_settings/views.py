from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CodeSetting, CodeSettingHistory, CodeSettingTemplate, CodeSettingRule
from .serializers import CodeSettingSerializer, CodeSettingHistorySerializer, CodeSettingTemplateSerializer, CodeSettingRuleSerializer

class CodeSettingViewSet(viewsets.ModelViewSet):
    queryset = CodeSetting.objects.all()
    serializer_class = CodeSettingSerializer

    @action(detail=True, methods=['post'])
    def generate_code(self, request, pk=None):
        """Generate next code in sequence"""
        code_setting = self.get_object()
        next_code = code_setting.generate_next_code()
        return Response({'next_code': next_code})

    @action(detail=True, methods=['post'])
    def reset_counter(self, request, pk=None):
        """Reset counter to starting number"""
        code_setting = self.get_object()
        code_setting.reset_counter()
        return Response({'message': 'Counter reset successfully'})

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get code settings grouped by category"""
        category = request.query_params.get('category')
        if category:
            queryset = self.queryset.filter(category=category)
        else:
            queryset = self.queryset
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CodeSettingHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CodeSettingHistory.objects.all()
    serializer_class = CodeSettingHistorySerializer

class CodeSettingTemplateViewSet(viewsets.ModelViewSet):
    queryset = CodeSettingTemplate.objects.all()
    serializer_class = CodeSettingTemplateSerializer

    @action(detail=True, methods=['post'])
    def apply_template(self, request, pk=None):
        """Apply template to create new code setting"""
        template = self.get_object()
        # Create new code setting from template
        code_setting = CodeSetting.objects.create(
            category=template.category,
            code_type=template.code_type,
            code_prefix=template.code_prefix,
            code_suffix=template.code_suffix,
            starting_number=template.starting_number,
            number_format=template.number_format,
            description=template.description,
            created_by=request.user
        )
        serializer = CodeSettingSerializer(code_setting)
        return Response(serializer.data)

class CodeSettingRuleViewSet(viewsets.ModelViewSet):
    queryset = CodeSettingRule.objects.all()
    serializer_class = CodeSettingRuleSerializer