from django.contrib import admin
from django.utils.html import format_html
from .models import TypeOfService, Service, Order, Payment, Review


@admin.register(TypeOfService)
class TypeOfServiceAdmin(admin.ModelAdmin):
    """Admin configuration for TypeOfService model"""
    list_display = ('name', 'category', 'price', 'description')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """Admin configuration for Service model"""
    list_display = ('id', 'type_of_service', 'user', 'status', 'get_orders_count')
    list_filter = ('status', 'type_of_service')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    ordering = ('-id',)

    def get_orders_count(self, obj):
        return obj.orders.count()
    get_orders_count.short_description = 'Órdenes'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin configuration for Order model"""
    list_display = ('id', 'receiver', 'deliverer', 'status_colored', 'scheduled_date',
                   'is_immediate', 'amount', 'created_at')
    list_filter = ('status', 'is_immediate', 'scheduled_date', 'created_at')
    search_fields = ('receiver__email', 'deliverer__email', 'receiver__first_name',
                    'deliverer__first_name')
    ordering = ('-created_at',)
    date_hierarchy = 'scheduled_date'
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Información Básica', {
            'fields': ('service', 'status', 'amount')
        }),
        ('Participantes', {
            'fields': ('receiver', 'deliverer')
        }),
        ('Detalles de Entrega', {
            'fields': ('scheduled_date', 'is_immediate', 'delivery_notes')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['mark_as_accepted', 'mark_as_completed', 'mark_as_cancelled', 'assign_deliverer']

    def status_colored(self, obj):
        """Display status with color"""
        colors = {
            Order.OrderStatus.PENDING: 'orange',
            Order.OrderStatus.ACCEPTED: 'blue',
            Order.OrderStatus.COMPLETED: 'green',
            Order.OrderStatus.CANCELLED: 'red',
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_colored.short_description = 'Estado'

    def mark_as_accepted(self, request, queryset):
        """Mark selected orders as accepted"""
        updated = queryset.filter(status=Order.OrderStatus.PENDING).update(
            status=Order.OrderStatus.ACCEPTED
        )
        self.message_user(request, f'{updated} órdenes marcadas como aceptadas.')
    mark_as_accepted.short_description = "Marcar como Aceptadas"

    def mark_as_completed(self, request, queryset):
        """Mark selected orders as completed"""
        updated = queryset.filter(status=Order.OrderStatus.ACCEPTED).update(
            status=Order.OrderStatus.COMPLETED
        )
        self.message_user(request, f'{updated} órdenes marcadas como completadas.')
    mark_as_completed.short_description = "Marcar como Completadas"

    def mark_as_cancelled(self, request, queryset):
        """Mark selected orders as cancelled"""
        updated = queryset.exclude(
            status__in=[Order.OrderStatus.COMPLETED, Order.OrderStatus.CANCELLED]
        ).update(status=Order.OrderStatus.CANCELLED)
        self.message_user(request, f'{updated} órdenes canceladas.')
    mark_as_cancelled.short_description = "Cancelar Órdenes"

    def assign_deliverer(self, request, queryset):
        """Auto-assign deliverer to orders without one"""
        from .assignment import OrderAssignmentService

        assigned_count = 0
        for order in queryset.filter(deliverer__isnull=True):
            deliverer = OrderAssignmentService.assign_order_to_deliverer(order)
            if deliverer:
                assigned_count += 1

        self.message_user(request, f'{assigned_count} órdenes asignadas a repartidores.')
    assign_deliverer.short_description = "Asignar Repartidor Automáticamente"


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for Payment model"""
    list_display = ('id', 'order', 'amount', 'status_colored', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order__id', 'order__receiver__email')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    actions = ['verify_payment', 'mark_as_completed']

    def status_colored(self, obj):
        """Display payment status with color"""
        colors = {
            Payment.PaymentStatus.PENDING: 'orange',
            Payment.PaymentStatus.COMPLETED: 'green',
            Payment.PaymentStatus.FAILED: 'red',
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_colored.short_description = 'Estado'

    def verify_payment(self, request, queryset):
        """Verify and complete selected payments"""
        verified = 0
        for payment in queryset.filter(status=Payment.PaymentStatus.PENDING):
            # Here you would normally verify with payment provider
            # For now, just mark as completed
            payment.status = Payment.PaymentStatus.COMPLETED
            payment.save()
            verified += 1

        self.message_user(request, f'{verified} pagos verificados y completados.')
    verify_payment.short_description = "Verificar y Completar Pagos"

    def mark_as_completed(self, request, queryset):
        """Mark selected payments as completed"""
        updated = queryset.filter(status=Payment.PaymentStatus.PENDING).update(
            status=Payment.PaymentStatus.COMPLETED
        )
        self.message_user(request, f'{updated} pagos marcados como completados.')
    mark_as_completed.short_description = "Marcar como Completados"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Admin configuration for Review model"""
    list_display = ('id', 'user', 'order', 'service', 'rating_stars', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__email', 'comment')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)

    def rating_stars(self, obj):
        """Display rating as stars"""
        return format_html('⭐' * obj.rating)
    rating_stars.short_description = 'Calificación'
