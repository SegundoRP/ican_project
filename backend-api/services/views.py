from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Service
from .serializers import ServiceSerializer
from .permissions import IsDeliverer
from django.shortcuts import get_object_or_404

class ServiceViewSet(viewsets.GenericViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliverer]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Service.objects.all()
        return Service.objects.filter(user=user)
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        service = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(service, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        service = get_object_or_404(self.get_queryset(), pk=pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
