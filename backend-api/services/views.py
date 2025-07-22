from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from .models import Service, TypeOfService, Order, Payment, Review
from .serializers import (
    ServiceSerializer, TypeOfServiceSerializer, OrderSerializer,
    PaymentSerializer, ReviewSerializer
)
from .permissions import IsDeliverer
from .assignment import OrderAssignmentService
from .availability import AvailabilityService
from backend.permissions import (
    IsOwner, IsReceiver, IsDeliverer as IsDelivererRole,
    IsOrderParticipant, IsReceiverOfOrder
)

class ServiceViewSet(viewsets.GenericViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliverer]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Service.objects.all()
        return Service.objects.filter(user=user)

    def list(self, _request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, pk=None):
        service = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(service, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, _request, pk=None):
        service = get_object_or_404(self.get_queryset(), pk=pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TypeOfServiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing service types.
    Only admin users can create, update or delete.
    Regular users can only list and retrieve.
    """
    queryset = TypeOfService.objects.all()
    serializer_class = TypeOfServiceSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing orders.
    Includes auto-assignment of available deliverers.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.all()

        # Non-staff users only see their orders
        if not user.is_staff:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(receiver=user) | Q(deliverer=user)
            )

        # Apply filters from query parameters
        status = self.request.query_params.get('status', None)
        condominium_id = self.request.query_params.get('condominium', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        is_immediate = self.request.query_params.get('is_immediate', None)

        if status:
            queryset = queryset.filter(status=status)

        if condominium_id:
            queryset = queryset.filter(
                receiver__department__condominium_id=condominium_id
            )

        if date_from:
            queryset = queryset.filter(scheduled_date__gte=date_from)

        if date_to:
            queryset = queryset.filter(scheduled_date__lte=date_to)

        if is_immediate is not None:
            queryset = queryset.filter(is_immediate=is_immediate.lower() == 'true')

        # Default ordering
        return queryset.order_by('-created_at')

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsReceiver()]
        elif self.action in ['accept_order', 'reject_order', 'complete_order']:
            return [permissions.IsAuthenticated(), IsDelivererRole()]
        elif self.action == 'cancel_order':
            return [permissions.IsAuthenticated(), IsReceiverOfOrder()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Validate receiver has proper setup
        receiver = self.request.user

        if not receiver.department:
            raise serializers.ValidationError(
                "Debes tener un departamento asignado para crear órdenes"
            )

        if not receiver.department.condominium:
            raise serializers.ValidationError(
                "Tu departamento debe estar asociado a un condominio"
            )

        # Save order first
        order = serializer.save(receiver=receiver)

        # Use assignment service for fair distribution
        assigned_deliverer = OrderAssignmentService.assign_order_to_deliverer(order)

        if not assigned_deliverer:
            # No deliverers available - order stays pending without deliverer
            order.status = Order.OrderStatus.PENDING
            order.save()

    @action(detail=True, methods=['post'])
    def accept_order(self, request, pk=None):
        """Deliverer accepts an order"""
        order = self.get_object()

        if order.deliverer != request.user:
            return Response(
                {"error": "Solo el repartidor asignado puede aceptar esta orden"},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status != Order.OrderStatus.PENDING:
            return Response(
                {"error": "Solo se pueden aceptar órdenes pendientes"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = Order.OrderStatus.ACCEPTED
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject_order(self, request, pk=None):
        """Deliverer rejects an order"""
        order = self.get_object()

        if order.deliverer != request.user:
            return Response(
                {"error": "Solo el repartidor asignado puede rechazar esta orden"},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status != Order.OrderStatus.PENDING:
            return Response(
                {"error": "Solo se pueden rechazar órdenes pendientes"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use assignment service to reassign
        new_deliverer = OrderAssignmentService.reassign_order(order)

        if new_deliverer:
            message = f"Orden reasignada a {new_deliverer.get_full_name()}"
        else:
            message = "Orden rechazada. No hay repartidores disponibles en este momento"

        serializer = self.get_serializer(order)
        return Response({
            "message": message,
            "order": serializer.data
        })

    @action(detail=True, methods=['post'])
    def complete_order(self, request, pk=None):
        """Mark order as completed"""
        order = self.get_object()

        if order.deliverer != request.user:
            return Response(
                {"error": "Solo el repartidor asignado puede completar esta orden"},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status != Order.OrderStatus.ACCEPTED:
            return Response(
                {"error": "Solo se pueden completar órdenes aceptadas"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = Order.OrderStatus.COMPLETED
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """Receiver cancels an order"""
        order = self.get_object()

        if order.receiver != request.user:
            return Response(
                {"error": "Solo el receptor puede cancelar esta orden"},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status in [Order.OrderStatus.COMPLETED, Order.OrderStatus.CANCELLED]:
            return Response(
                {"error": "No se pueden cancelar órdenes completadas o ya canceladas"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = Order.OrderStatus.CANCELLED
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_deliveries(self, request):
        """Get orders where user is the deliverer with statistics"""
        # Get filter parameters
        status = request.query_params.get('status', None)
        date_from = request.query_params.get('date_from', None)
        date_to = request.query_params.get('date_to', None)

        # Base query
        orders = self.get_queryset().filter(deliverer=request.user)

        # Apply filters
        if status:
            orders = orders.filter(status=status)
        if date_from:
            orders = orders.filter(scheduled_date__gte=date_from)
        if date_to:
            orders = orders.filter(scheduled_date__lte=date_to)

        # Order by date
        orders = orders.order_by('-scheduled_date')

        # Calculate statistics
        from django.db.models import Sum, Count, Q
        stats = orders.aggregate(
            total_orders=Count('id'),
            completed_orders=Count('id', filter=Q(status=Order.OrderStatus.COMPLETED)),
            pending_orders=Count('id', filter=Q(status=Order.OrderStatus.PENDING)),
            accepted_orders=Count('id', filter=Q(status=Order.OrderStatus.ACCEPTED)),
            total_earnings=Sum('amount', filter=Q(status=Order.OrderStatus.COMPLETED)) or 0
        )

        # Calculate average rating
        avg_rating = Review.objects.filter(
            order__deliverer=request.user,
            order__status=Order.OrderStatus.COMPLETED
        ).aggregate(avg=Avg('rating'))['avg'] or 0

        serializer = self.get_serializer(orders, many=True)

        return Response({
            'orders': serializer.data,
            'statistics': {
                'total_orders': stats['total_orders'],
                'completed_orders': stats['completed_orders'],
                'pending_orders': stats['pending_orders'],
                'accepted_orders': stats['accepted_orders'],
                'total_earnings': float(stats['total_earnings']) if stats['total_earnings'] else 0,
                'average_rating': round(avg_rating, 2) if avg_rating else 0,
                'completion_rate': round((stats['completed_orders'] / stats['total_orders'] * 100), 2) if stats['total_orders'] > 0 else 0
            }
        })

    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Get orders where user is the receiver with statistics"""
        # Get filter parameters
        status = request.query_params.get('status', None)
        date_from = request.query_params.get('date_from', None)
        date_to = request.query_params.get('date_to', None)

        # Base query
        orders = self.get_queryset().filter(receiver=request.user)

        # Apply filters
        if status:
            orders = orders.filter(status=status)
        if date_from:
            orders = orders.filter(scheduled_date__gte=date_from)
        if date_to:
            orders = orders.filter(scheduled_date__lte=date_to)

        # Order by date
        orders = orders.order_by('-scheduled_date')

        # Calculate statistics
        from django.db.models import Sum, Count, Q
        stats = orders.aggregate(
            total_orders=Count('id'),
            completed_orders=Count('id', filter=Q(status=Order.OrderStatus.COMPLETED)),
            pending_orders=Count('id', filter=Q(status=Order.OrderStatus.PENDING)),
            cancelled_orders=Count('id', filter=Q(status=Order.OrderStatus.CANCELLED)),
            total_spent=Sum('amount', filter=Q(status=Order.OrderStatus.COMPLETED)) or 0
        )

        serializer = self.get_serializer(orders, many=True)

        return Response({
            'orders': serializer.data,
            'statistics': {
                'total_orders': stats['total_orders'],
                'completed_orders': stats['completed_orders'],
                'pending_orders': stats['pending_orders'],
                'cancelled_orders': stats['cancelled_orders'],
                'total_spent': float(stats['total_spent']) if stats['total_spent'] else 0,
                'completion_rate': round((stats['completed_orders'] / stats['total_orders'] * 100), 2) if stats['total_orders'] > 0 else 0
            }
        })

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        """Check deliverer availability in user's condominium"""
        user = request.user

        if not user.department or not user.department.condominium:
            return Response({
                "error": "Usuario sin departamento o condominio asignado"
            }, status=status.HTTP_400_BAD_REQUEST)

        condominium = user.department.condominium

        # Get available deliverers count
        available_deliverers = OrderAssignmentService.get_available_deliverers(
            condominium, exclude_user=user
        )

        # Check immediate delivery availability
        immediate_available = AvailabilityService.is_immediate_delivery_available(
            condominium, exclude_user=user
        )

        # Get today's time slots
        from datetime import date
        time_slots = AvailabilityService.get_available_time_slots(
            condominium, date.today(), exclude_user=user
        )

        return Response({
            "condominium": {
                "id": condominium.id,
                "name": condominium.name
            },
            "available_deliverers_count": available_deliverers.count(),
            "immediate_delivery_available": immediate_available,
            "time_slots_today": time_slots[:6]  # Next 6 available slots
        })


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing payments.
    Only receivers can create payments for their orders.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()

        # Users can only see payments for their orders
        from django.db.models import Q
        return Payment.objects.filter(
            Q(order__receiver=user) | Q(order__deliverer=user)
        )

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsReceiverOfOrder()]
        elif self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsReceiverOfOrder()]
        elif self.action == 'destroy':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        order = serializer.validated_data['order']

        # Check if payment already exists for this order
        if Payment.objects.filter(order=order).exists():
            raise serializers.ValidationError("Ya existe un pago para esta orden")

        # Validate order status
        if order.status not in [Order.OrderStatus.ACCEPTED, Order.OrderStatus.COMPLETED]:
            raise serializers.ValidationError("Solo se pueden pagar órdenes aceptadas o completadas")

        # Validate amount matches order amount
        if serializer.validated_data['amount'] != order.amount:
            raise serializers.ValidationError(f"El monto debe ser {order.amount}")

        serializer.save()

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        """Confirm payment as completed"""
        payment = self.get_object()

        if payment.order.receiver != request.user and not request.user.is_staff:
            return Response(
                {"error": "Solo el receptor o admin puede confirmar el pago"},
                status=status.HTTP_403_FORBIDDEN
            )

        if payment.status != Payment.PaymentStatus.PENDING:
            return Response(
                {"error": "Solo se pueden confirmar pagos pendientes"},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment.status = Payment.PaymentStatus.COMPLETED
        payment.save()

        serializer = self.get_serializer(payment)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing reviews.
    Users can only create reviews for completed orders they participated in.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Review.objects.all()

        # Filter by query parameters
        queryset = Review.objects.all()

        # Filter by user
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        # Filter by service
        service_id = self.request.query_params.get('service', None)
        if service_id:
            queryset = queryset.filter(service_id=service_id)

        return queryset

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsOrderParticipant()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        order = serializer.validated_data['order']
        user = self.request.user

        # Check if user already reviewed this order
        if Review.objects.filter(order=order, user=user).exists():
            raise serializers.ValidationError("Ya has calificado esta orden")

        # Ensure order is completed
        if order.status != Order.OrderStatus.COMPLETED:
            raise serializers.ValidationError("Solo se pueden calificar órdenes completadas")

        # Ensure user is part of the order
        if user not in [order.receiver, order.deliverer]:
            raise serializers.ValidationError("Solo puedes calificar órdenes en las que participaste")

        # Auto-assign the service from the order
        service = order.service
        serializer.save(user=user, service=service)

    @action(detail=False, methods=['get'])
    def average_rating(self, request):
        """Get average ratings with filters"""
        queryset = self.get_queryset()

        # Filter by service type if provided
        service_type_id = request.query_params.get('service_type', None)
        if service_type_id:
            queryset = queryset.filter(service__type_of_service_id=service_type_id)

        # Filter by user if provided
        user_id = request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(order__deliverer_id=user_id)

        # Calculate averages
        result = queryset.aggregate(
            average_rating=Avg('rating'),
            total_reviews=Count('id')
        )

        return Response({
            'average_rating': result['average_rating'] or 0,
            'total_reviews': result['total_reviews']
        })

    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get reviews created by the current user"""
        reviews = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def reviews_about_me(self, request):
        """Get reviews about the current user as deliverer"""
        reviews = Review.objects.filter(order__deliverer=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
