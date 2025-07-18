from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, CondominiumViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'condominiums', CondominiumViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
