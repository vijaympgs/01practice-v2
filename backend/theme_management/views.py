from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ThemeSetting
from .serializers import (
    ThemeSettingSerializer,
    ThemeSettingListSerializer,
    ActiveThemeSerializer
)

class ThemeSettingListCreateView(generics.ListCreateAPIView):
    """List all theme settings and create new ones"""
    queryset = ThemeSetting.objects.all()
    serializer_class = ThemeSettingListSerializer
    permission_classes = [AllowAny]  # Allow public read access for theme selector
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ThemeSettingSerializer
        return ThemeSettingListSerializer
    
    def get_permissions(self):
        """Require authentication only for POST (create) requests"""
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

class ThemeSettingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a theme setting"""
    queryset = ThemeSetting.objects.all()
    serializer_class = ThemeSettingSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow public read access for theme selector
def get_active_theme(request):
    """Get the currently active theme"""
    try:
        active_theme = ThemeSetting.get_active_theme()
        if active_theme:
            serializer = ActiveThemeSerializer(active_theme)
            return Response(serializer.data)
        else:
            # Return default theme if none is active
            return Response({
                'id': None,
                'name': 'Blue',
                'primary_color': '#1976d2',
                'secondary_color': '#1565c0',
                'is_active': False
            })
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error getting active theme: {str(e)}", exc_info=True)
        # Return default theme on error instead of 500
        return Response({
            'id': None,
            'name': 'Blue',
            'primary_color': '#1976d2',
            'secondary_color': '#1565c0',
            'is_active': False
        })

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow public theme switching
def set_active_theme(request):
    """Set a theme as active"""
    try:
        theme_id = request.data.get('theme_id')
        if not theme_id:
            return Response(
                {'error': 'theme_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        theme = get_object_or_404(ThemeSetting, id=theme_id)
        theme.is_active = True
        # Only set created_by if user is authenticated
        if request.user and request.user.is_authenticated:
            theme.created_by = request.user
        theme.save()
        
        serializer = ActiveThemeSerializer(theme)
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': 'Failed to set active theme'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_theme_from_request(request):
    """Create a new theme from request data"""
    try:
        theme_data = request.data.copy()
        theme_data['created_by'] = request.user.id
        
        serializer = ThemeSettingSerializer(data=theme_data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': 'Failed to create theme'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
