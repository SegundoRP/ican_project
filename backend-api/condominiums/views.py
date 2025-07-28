from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Department, Condominium
from .serializers import DepartmentSerializer, CondominiumSerializer

class DepartmentViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            # Only admin can create/update/delete departments
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        # Regular users can view departments
        return [permissions.IsAuthenticated()]

    def create(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, _request, pk=None):
        department = get_object_or_404(Department, pk=pk)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)

    def update(self, request, pk=None):
        department = get_object_or_404(Department, pk=pk)
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CondominiumViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving condominiums.
    Read-only access for all authenticated users.
    - ReadOnlyModelViewSet = ViewSet only allows reading(no creating, editing or deleting)
    - Gets automatically:
    - list() → GET /api/condominiums/
    - retrieve() → GET /api/condominiums/1/
    """
    queryset = Condominium.objects.all()
    serializer_class = CondominiumSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # Include departments only in retrieve action
        if self.action == 'retrieve':
            context['include_departments'] = True
        return context
