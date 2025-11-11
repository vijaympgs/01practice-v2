from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ThemeSetting(models.Model):
    """
    System-wide theme settings stored in database
    """
    THEME_CHOICES = [
        ('red', 'Red Theme'),
        ('green', 'Green Theme'),
        ('blue', 'Blue Theme'),
        ('black', 'Black Theme'),
    ]
    
    name = models.CharField(
        max_length=50,
        default='',
        help_text='Display name for the theme'
    )
    
    theme_name = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default='blue',
        help_text='Theme identifier for the system'
    )
    
    primary_color = models.CharField(
        max_length=7,
        default='#1976D2',
        help_text='Primary color hex code (e.g., #FF0000)'
    )
    
    secondary_color = models.CharField(
        max_length=7,
        default='#2196F3',
        help_text='Secondary color hex code (e.g., #FF5722)'
    )
    
    background_color = models.CharField(
        max_length=7,
        default='#ffffff',
        help_text='Background color hex code'
    )
    
    text_color = models.CharField(
        max_length=7,
        default='#000000',
        help_text='Text color hex code'
    )
    
    is_active = models.BooleanField(
        default=False,
        help_text='Whether this theme is currently active'
    )
    
    is_default = models.BooleanField(
        default=False,
        help_text='Whether this is a default system theme'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='User who created this theme setting'
    )
    
    class Meta:
        verbose_name = 'Theme Setting'
        verbose_name_plural = 'Theme Settings'
        ordering = ['theme_name']
    
    def __str__(self):
        return f"{self.name} ({self.theme_name})"
    
    def clean(self):
        """Validate theme data"""
        from django.core.exceptions import ValidationError
        
        # Validate hex color format
        import re
        hex_pattern = r'^#[0-9A-Fa-f]{6}$'
        
        for field_name in ['primary_color', 'secondary_color', 'background_color', 'text_color']:
            color = getattr(self, field_name)
            if color and not re.match(hex_pattern, color):
                raise ValidationError(f'{field_name.replace("_", " ").title()} must be a valid hex color (e.g., #FF0000)')
        
        # Enforce maximum 4 themes
        if not self.pk and ThemeSetting.objects.count() >= 4:
            raise ValidationError('Maximum 4 themes are allowed in the system.')
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Run validation
        
        # Ensure only one active theme at a time
        if self.is_active:
            ThemeSetting.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        
        super().save(*args, **kwargs)
    
    @classmethod
    def get_active_theme(cls):
        """Get the currently active theme"""
        try:
            active_theme = cls.objects.filter(is_active=True).first()
            if active_theme:
                return active_theme
            # If no active theme, return blue theme as default
            return cls.objects.filter(theme_name='blue').first()
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error getting active theme: {str(e)}", exc_info=True)
            return None
    
    @classmethod
    def get_all_themes(cls):
        """Get all available themes"""
        return cls.objects.all().order_by('theme_name')
    
    @classmethod
    def create_default_themes(cls):
        """Create default themes if they don't exist"""
        default_themes = [
            {
                'name': 'Red Theme',
                'theme_name': 'red',
                'primary_color': '#D32F2F',
                'secondary_color': '#FF5722',
                'background_color': '#FFEBEE',
                'text_color': '#000000',
                'is_default': True,
            },
            {
                'name': 'Green Theme',
                'theme_name': 'green',
                'primary_color': '#388E3C',
                'secondary_color': '#4CAF50',
                'background_color': '#E8F5E8',
                'text_color': '#000000',
                'is_default': True,
            },
            {
                'name': 'Blue Theme',
                'theme_name': 'blue',
                'primary_color': '#1976D2',
                'secondary_color': '#2196F3',
                'background_color': '#E3F2FD',
                'text_color': '#000000',
                'is_default': True,
            },
            {
                'name': 'Black Theme',
                'theme_name': 'black',
                'primary_color': '#000000',
                'secondary_color': '#333333',
                'background_color': '#0d0d0d',
                'text_color': '#ffffff',
                'is_default': True,
            },
        ]
        
        created_themes = []
        for theme_data in default_themes:
            theme, created = cls.objects.get_or_create(
                theme_name=theme_data['theme_name'],
                defaults=theme_data
            )
            if created:
                created_themes.append(theme)
        
        # Set blue theme as active if no active theme exists
        if not cls.objects.filter(is_active=True).exists():
            blue_theme = cls.objects.filter(theme_name='blue').first()
            if blue_theme:
                blue_theme.is_active = True
                blue_theme.save()
        
        return created_themes
