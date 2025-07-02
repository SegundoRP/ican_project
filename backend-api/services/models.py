from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

class TypeOfService(models.Model):
    class ServiceType(models.IntegerChoices):
        DELIVERY = 1, _('Entrega')

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.IntegerField(
        choices=ServiceType.choices,
        default=ServiceType.DELIVERY
    )

    def __str__(self):
        return f"{self.name} - {self.category}"

class Service(models.Model):
    class ServiceStatus(models.IntegerChoices):
        ACTIVE = 1, _('Activo')
        INACTIVE = 2, _('Inactivo')

    status = models.IntegerField(
        choices=ServiceStatus.choices,
        default=ServiceStatus.ACTIVE
    )
    type_of_service = models.ForeignKey(TypeOfService, on_delete=models.CASCADE, related_name="services")
    user = models.ForeignKey('users.UserAccount', on_delete=models.CASCADE, related_name="services")

    def __str__(self):
        return f"{self.type_of_service.name} - {self.user.email}"

class Order(models.Model):
    class OrderStatus(models.IntegerChoices):
        PENDING = 1, _('Pendiente')
        ASSIGNED = 2, _('Asignado')
        NOT_ASSIGNED = 3, _('No Asignado')
        ACCEPTED = 4, _('Aceptado')
        IN_PROGRESS = 5, _('En Progreso')
        COMPLETED = 6, _('Completado')
        CANCELLED = 7, _('Cancelado')

    status = models.IntegerField(
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING
    )
    scheduled_date = models.DateTimeField()
    service = models.ForeignKey(Service, on_delete=models.CASCADE, null=True, blank=True, related_name="orders")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    receiver = models.ForeignKey('users.UserAccount', on_delete=models.CASCADE, related_name="receiver_orders", verbose_name="Receptor")
    deliverer = models.ForeignKey('users.UserAccount', on_delete=models.SET_NULL, null=True, blank=True, related_name="deliverer_orders", verbose_name="Repartidor")

    def __str__(self):
        return f"Order {self.id} - {self.status} - {self.scheduled_date} - {self.receiver.email}"

    def clean(self):
        if self.deliverer and self.receiver == self.deliverer:
            raise ValidationError("El receptor y el repartidor no pueden ser el mismo usuario.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class Payment(models.Model):
    class PaymentStatus(models.IntegerChoices):
        PENDING = 1, _('Pendiente')
        COMPLETED = 2, _('Completado')
        REJECTED = 3, _('Rechazado')
        CANCELLED = 4, _('Cancelado')

    class PaymentMethod(models.IntegerChoices):
        CASH = 1, _('Efectivo')
        CREDIT_CARD = 2, _('Tarjeta de Credito')
        DEBIT_CARD = 3, _('Tarjeta de Debito')

    status = models.IntegerField(
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.IntegerField(
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH
    )

    def __str__(self):
        return f"Payment {self.id} - {self.status} - {self.amount} - {self.payment_method}"

class Review(models.Model):
    user = models.ForeignKey('users.UserAccount', on_delete=models.CASCADE, related_name="reviews")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField()
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="reviews")

    def __str__(self):
        return f"Review {self.id} - {self.user.email} - {self.order.id}"
