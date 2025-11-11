from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class POSProgram(models.Model):
    """
    POS Programs/Operations that can be mapped to roles and users
    """
    name = models.CharField(max_length=100, unique=True, help_text="Program name (e.g., Point of Sale)")
    code = models.CharField(max_length=20, unique=True, help_text="Program code (e.g., POS)")
    description = models.TextField(blank=True, null=True, help_text="Program description")
    is_active = models.BooleanField(default=True, help_text="Whether this program is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_pos_programs')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_pos_programs')

    class Meta:
        db_table = 'pos_programs'
        verbose_name = 'POS Program'
        verbose_name_plural = 'POS Programs'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def is_mapped(self):
        """
        Check if this program is mapped to any roles
        """
        from .role_program_mapping import RoleProgramMapping
        return RoleProgramMapping.objects.filter(program=self).exists()

    def can_delete(self):
        """
        Check if this program can be deleted (not mapped to any roles)
        """
        return not self.is_mapped
