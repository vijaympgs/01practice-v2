from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ThemeSetting(models.Model):
    """
    System-wide theme settings stored in database
    """
    THEME_CHOICES = [
        ('blue', 'Blue Theme'),
        ('black', 'Black Theme'),
    ]
    
    theme_name = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default='blue',
        help_text='Selected theme for the system'
    )
    
    primary_color = models.CharField(
        max_length=7,
        default='#1565C0',
        help_text='Primary color hex code'
    )
    
    secondary_color = models.CharField(
        max_length=7,
        default='#FF5722',
        help_text='Secondary color hex code'
    )
    
    background_color = models.CharField(
        max_length=7,
        default='#f5f5f5',
        help_text='Background color hex code'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this theme is currently active'
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
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_theme_name_display()} - {self.primary_color}"
    
    def save(self, *args, **kwargs):
        # Ensure only one active theme at a time
        if self.is_active:
            ThemeSetting.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)
    
    @classmethod
    def get_active_theme(cls):
        """Get the currently active theme"""
        try:
            active_theme = cls.objects.filter(is_active=True).first()
            if active_theme:
                return active_theme
            # If no active theme, try to get any theme or return None
            # Don't auto-create as it might cause issues
            return cls.objects.first()
        except Exception as e:
            # Log error but don't raise - let view handle it
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error getting active theme: {str(e)}", exc_info=True)
            return None
