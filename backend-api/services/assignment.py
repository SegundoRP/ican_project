"""
Order Assignment Service
Handles fair distribution of orders among available deliverers
"""
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from users.models import UserAccount
from .models import Order


class OrderAssignmentService:
    """Service for assigning orders to deliverers with fair distribution"""

    @staticmethod
    def get_available_deliverers(condominium, exclude_user=None):
        """Get all available deliverers in a condominium"""
        queryset = UserAccount.objects.filter(
            Q(role=UserAccount.UserRole.DELIVERER) |
            Q(role=UserAccount.UserRole.RECEIVER_AND_DELIVERER),
            is_available_for_delivery=True,
            department__condominium=condominium
        )

        if exclude_user:
            queryset = queryset.exclude(id=exclude_user.id)

        return queryset

    @staticmethod
    def assign_order_to_deliverer(order):
        """
        Assign an order to the most suitable deliverer using round-robin approach
        Returns the assigned deliverer or None if no one is available
        """
        receiver = order.receiver

        # Validate receiver has a department
        if not receiver.department or not receiver.department.condominium:
            return None

        condominium = receiver.department.condominium

        # Get available deliverers
        available_deliverers = OrderAssignmentService.get_available_deliverers(
            condominium,
            exclude_user=receiver
        )

        if not available_deliverers.exists():
            return None

        # Get order counts for fair distribution
        # Count orders from last 7 days to keep it relevant
        seven_days_ago = timezone.now() - timedelta(days=7)

        deliverers_with_counts = available_deliverers.annotate(
            recent_order_count=Count(
                'deliverer_orders',
                filter=Q(
                    deliverer_orders__created_at__gte=seven_days_ago,
                    deliverer_orders__status__in=[
                        Order.OrderStatus.PENDING,
                        Order.OrderStatus.ACCEPTED,
                        Order.OrderStatus.COMPLETED
                    ]
                )
            )
        ).order_by('recent_order_count', '?')  # Order by count, then random for ties

        # Assign to deliverer with least recent orders
        selected_deliverer = deliverers_with_counts.first()

        if selected_deliverer:
            order.deliverer = selected_deliverer
            order.save()

        return selected_deliverer

    @staticmethod
    def reassign_order(order):
        """Reassign an order that was rejected or needs new deliverer"""
        # Remove current deliverer
        order.deliverer = None
        order.save()

        # Try to assign to a new deliverer
        return OrderAssignmentService.assign_order_to_deliverer(order)

    @staticmethod
    def check_deliverer_availability(deliverer):
        """Check if a deliverer is truly available considering their current load"""
        # Maximum concurrent orders a deliverer can handle
        MAX_CONCURRENT_ORDERS = 5

        # Count active orders
        active_orders = Order.objects.filter(
            deliverer=deliverer,
            status__in=[Order.OrderStatus.PENDING, Order.OrderStatus.ACCEPTED]
        ).count()

        return active_orders < MAX_CONCURRENT_ORDERS

    @staticmethod
    def validate_same_condominium(receiver, deliverer):
        """Validate that receiver and deliverer are in the same condominium"""
        if not receiver.department or not deliverer.department:
            return False

        return receiver.department.condominium == deliverer.department.condominium

    @staticmethod
    def get_proximity_score(receiver_dept, deliverer_dept):
        """
        Calculate proximity score between departments
        Lower score = closer proximity
        """
        if not receiver_dept or not deliverer_dept:
            return float('inf')

        # Same tower is preferred
        if receiver_dept.tower == deliverer_dept.tower:
            # Calculate floor difference
            floor_diff = abs(receiver_dept.floor - deliverer_dept.floor)
            return floor_diff
        else:
            # Different towers have higher base score
            return 100 + abs(receiver_dept.floor - deliverer_dept.floor)
