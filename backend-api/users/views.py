from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .models import UserAccount
from .serializers import UserAccountSerializer
from services.availability import AvailabilityService
from services.assignment import OrderAssignmentService

class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, _request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response


class UserAccountViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user profile management.
    Users can only view and update their own profile.
    """
    queryset = UserAccount.objects.all()
    serializer_class = UserAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'create']:
            # Only admin can list all users or create new ones
            return [permissions.IsAdminUser()]
        elif self.action in ['destroy']:
            # Only admin can delete users
            return [permissions.IsAdminUser()]
        else:
            # For retrieve, update, partial_update - user must be authenticated
            return [permissions.IsAuthenticated()]

    def get_object(self):
        # Allow users to only access their own profile unless admin
        obj = super().get_object()
        if not self.request.user.is_staff and obj != self.request.user:
            self.permission_denied(self.request)
        return obj

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update the current user's profile"""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def toggle_availability(self, request):
        """Toggle delivery availability for deliverer users"""
        success, message = AvailabilityService.toggle_deliverer_availability(request.user)

        if not success:
            return Response(
                {"error": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "is_available_for_delivery": request.user.is_available_for_delivery,
            "message": message
        })

    @action(detail=False, methods=['get'])
    def earnings_summary(self, request):
        """Get earnings summary for deliverer users"""
        user = request.user

        # Check if user has deliverer role
        if user.role not in [UserAccount.UserRole.DELIVERER,
                           UserAccount.UserRole.RECEIVER_AND_DELIVERER]:
            return Response(
                {"error": "Solo los repartidores pueden ver ganancias"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get date filters
        date_from = request.query_params.get('date_from', None)
        date_to = request.query_params.get('date_to', None)

        # Import required models
        from services.models import Order, Review
        from django.db.models import Sum, Count, Avg
        from django.utils import timezone
        from datetime import timedelta

        # Base query for completed orders
        orders_query = Order.objects.filter(
            deliverer=user,
            status=Order.OrderStatus.COMPLETED
        )

        # Apply date filters
        if date_from:
            orders_query = orders_query.filter(scheduled_date__gte=date_from)
        if date_to:
            orders_query = orders_query.filter(scheduled_date__lte=date_to)

        # Calculate earnings
        earnings_data = orders_query.aggregate(
            total_earnings=Sum('amount') or 0,
            total_orders=Count('id')
        )

        # Calculate weekly earnings (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        weekly_earnings = Order.objects.filter(
            deliverer=user,
            status=Order.OrderStatus.COMPLETED,
            scheduled_date__gte=week_ago
        ).aggregate(amount=Sum('amount'))['amount'] or 0

        # Calculate monthly earnings (last 30 days)
        month_ago = timezone.now() - timedelta(days=30)
        monthly_earnings = Order.objects.filter(
            deliverer=user,
            status=Order.OrderStatus.COMPLETED,
            scheduled_date__gte=month_ago
        ).aggregate(amount=Sum('amount'))['amount'] or 0

        # Get average rating
        avg_rating = Review.objects.filter(
            order__deliverer=user,
            order__status=Order.OrderStatus.COMPLETED
        ).aggregate(avg=Avg('rating'))['avg'] or 0

        # Get rating distribution
        rating_distribution = Review.objects.filter(
            order__deliverer=user,
            order__status=Order.OrderStatus.COMPLETED
        ).values('rating').annotate(count=Count('rating')).order_by('rating')

        return Response({
            'earnings': {
                'total': float(earnings_data['total_earnings']) if earnings_data['total_earnings'] else 0,
                'weekly': float(weekly_earnings),
                'monthly': float(monthly_earnings),
                'total_orders': earnings_data['total_orders']
            },
            'ratings': {
                'average': round(avg_rating, 2) if avg_rating else 0,
                'total_reviews': sum(r['count'] for r in rating_distribution),
                'distribution': {r['rating']: r['count'] for r in rating_distribution}
            }
        })

    @action(detail=False, methods=['put'])
    def update_department(self, request):
        """Update user's department assignment"""
        department_id = request.data.get('department_id')

        if not department_id:
            return Response(
                {"error": "Se requiere department_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Import Department model
        from condominiums.models import Department

        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response(
                {"error": "Departamento no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update user's department
        user = request.user
        user.department = department
        user.save()

        serializer = self.get_serializer(user)
        return Response({
            "message": "Departamento actualizado exitosamente",
            "user": serializer.data
        })

    @action(detail=False, methods=['get'])
    def available_deliverers(self, request):
        """Search for available deliverers in a condominium"""
        condominium_id = request.query_params.get('condominium_id', None)

        # If no condominium specified, use user's condominium
        if not condominium_id and request.user.department:
            condominium_id = request.user.department.condominium.id

        if not condominium_id:
            return Response(
                {"error": "Se requiere condominium_id o el usuario debe tener departamento asignado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Import models
        from condominiums.models import Condominium
        from services.models import Order
        from django.db.models import Avg

        try:
            condominium = Condominium.objects.get(id=condominium_id)
        except Condominium.DoesNotExist:
            return Response(
                {"error": "Condominio no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get available deliverers
        deliverers = OrderAssignmentService.get_available_deliverers(
            condominium, exclude_user=request.user
        )

        # Add statistics for each deliverer
        deliverer_data = []
        for deliverer in deliverers:
            # Get completed orders count
            completed_orders = Order.objects.filter(
                deliverer=deliverer,
                status=Order.OrderStatus.COMPLETED
            ).count()

            # Get average rating
            from services.models import Review
            avg_rating = Review.objects.filter(
                order__deliverer=deliverer,
                order__status=Order.OrderStatus.COMPLETED
            ).aggregate(avg=Avg('rating'))['avg'] or 0

            # Check current availability
            is_currently_available = OrderAssignmentService.check_deliverer_availability(deliverer)

            deliverer_info = UserAccountSerializer(deliverer).data
            deliverer_info['statistics'] = {
                'completed_orders': completed_orders,
                'average_rating': round(avg_rating, 2) if avg_rating else 0,
                'is_currently_available': is_currently_available
            }

            deliverer_data.append(deliverer_info)

        # Sort by rating and completed orders
        deliverer_data.sort(
            key=lambda x: (x['statistics']['average_rating'], x['statistics']['completed_orders']),
            reverse=True
        )

        return Response({
            'condominium': {
                'id': condominium.id,
                'name': condominium.name
            },
            'available_deliverers_count': len(deliverer_data),
            'deliverers': deliverer_data
        })
