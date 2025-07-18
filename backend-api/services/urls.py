from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, TypeOfServiceViewSet, OrderViewSet,
    PaymentViewSet, ReviewViewSet
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'service-types', TypeOfServiceViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
