"""
Availability Management Service
Handles deliverer availability and scheduling
"""
from django.utils import timezone
from django.db.models import Q, Count
from datetime import datetime, timedelta
from users.models import UserAccount
from .models import Order


class AvailabilityService:
    """Service for managing deliverer availability and scheduling"""

    @staticmethod
    def toggle_deliverer_availability(user):
        """Toggle availability status for a deliverer"""
        if user.role not in [UserAccount.UserRole.DELIVERER,
                            UserAccount.UserRole.RECEIVER_AND_DELIVERER]:
            return False, "Usuario no tiene rol de repartidor"

        # Check if deliverer has active orders before disabling
        if user.is_available_for_delivery:
            active_orders = Order.objects.filter(
                deliverer=user,
                status__in=[Order.OrderStatus.PENDING, Order.OrderStatus.ACCEPTED]
            ).count()

            if active_orders > 0:
                return False, f"No puedes desactivar tu disponibilidad con {active_orders} órdenes activas"

        user.is_available_for_delivery = not user.is_available_for_delivery
        user.save()

        status = "activada" if user.is_available_for_delivery else "desactivada"
        return True, f"Disponibilidad {status} exitosamente"

    @staticmethod
    def get_deliverer_orders_by_date(deliverer, date=None):
        """Get deliverer's orders for a specific date"""
        if not date:
            date = timezone.now().date()

        # Get all orders for the deliverer on the specified date
        orders = Order.objects.filter(
            deliverer=deliverer,
            scheduled_date__date=date,
            status__in=[Order.OrderStatus.PENDING, Order.OrderStatus.ACCEPTED]
        ).order_by('scheduled_date')

        return orders

    @staticmethod
    def check_time_slot_availability(deliverer, scheduled_datetime, duration_minutes=30):
        """
        Check if a deliverer is available for a specific time slot
        duration_minutes: estimated time for delivery (default 30 min)
        """
        if not deliverer.is_available_for_delivery:
            return False, "Repartidor no está disponible"

        # Define time window
        start_time = scheduled_datetime
        end_time = scheduled_datetime + timedelta(minutes=duration_minutes)

        # Check for overlapping orders
        overlapping_orders = Order.objects.filter(
            deliverer=deliverer,
            status__in=[Order.OrderStatus.PENDING, Order.OrderStatus.ACCEPTED],
            scheduled_date__gte=start_time - timedelta(minutes=duration_minutes),
            scheduled_date__lt=end_time
        )

        if overlapping_orders.exists():
            return False, "Repartidor ocupado en ese horario"

        return True, "Horario disponible"

    @staticmethod
    def get_available_time_slots(condominium, date, exclude_user=None):
        """
        Get available time slots for a condominium on a specific date
        Returns a list of time slots with available deliverers count
        """
        # Define business hours (8 AM to 8 PM)
        start_hour = 8
        end_hour = 20
        slot_duration = 30  # minutes

        time_slots = []
        current_time = timezone.now()

        for hour in range(start_hour, end_hour):
            for minute in [0, 30]:  # 30-minute slots
                slot_time = timezone.make_aware(
                    datetime.combine(date, datetime.min.time().replace(hour=hour, minute=minute))
                )

                # Skip past time slots
                if slot_time < current_time:
                    continue

                # Get available deliverers for this slot
                available_deliverers = UserAccount.objects.filter(
                    Q(role=UserAccount.UserRole.DELIVERER) |
                    Q(role=UserAccount.UserRole.RECEIVER_AND_DELIVERER),
                    is_available_for_delivery=True,
                    department__condominium=condominium
                )

                if exclude_user:
                    available_deliverers = available_deliverers.exclude(id=exclude_user.id)

                # Check each deliverer's availability for this time slot
                available_count = 0
                for deliverer in available_deliverers:
                    is_available, _ = AvailabilityService.check_time_slot_availability(
                        deliverer, slot_time, slot_duration
                    )
                    if is_available:
                        available_count += 1

                time_slots.append({
                    'time': slot_time,
                    'available_deliverers': available_count,
                    'is_available': available_count > 0
                })

        return time_slots

    @staticmethod
    def is_immediate_delivery_available(condominium, exclude_user=None):
        """Check if immediate delivery is available (within next 30 minutes)"""
        available_deliverers = OrderAssignmentService.get_available_deliverers(
            condominium, exclude_user
        )

        # Check if any deliverer has capacity for immediate delivery
        for deliverer in available_deliverers:
            if OrderAssignmentService.check_deliverer_availability(deliverer):
                return True

        return False


# Import at the end to avoid circular import
from .assignment import OrderAssignmentService
