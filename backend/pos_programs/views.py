from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import POSProgram
from .serializers import POSProgramSerializer

class POSProgramViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing POS Programs
    """
    queryset = POSProgram.objects.all()
    serializer_class = POSProgramSerializer

    def get_queryset(self):
        """
        Filter by active status if requested
        """
        queryset = POSProgram.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset.order_by('name')

    def perform_create(self, serializer):
        """
        Set created_by and updated_by fields
        """
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

    def perform_update(self, serializer):
        """
        Set updated_by field
        """
        serializer.save(updated_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Prevent deletion if program is mapped to roles
        """
        instance = self.get_object()
        if not instance.can_delete():
            return Response(
                {
                    'error': 'Cannot delete program',
                    'message': f'Program "{instance.name}" is mapped to one or more roles and cannot be deleted.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Get only active programs
        """
        active_programs = POSProgram.objects.filter(is_active=True).order_by('name')
        serializer = self.get_serializer(active_programs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """
        Toggle active status of a program
        """
        program = get_object_or_404(POSProgram, pk=pk)
        program.is_active = not program.is_active
        program.updated_by = request.user
        program.save()
        
        serializer = self.get_serializer(program)
        return Response(serializer.data)
