from rest_framework import serializers
from users.models import UserAccount
from .models import Service, Order, TypeOfService, Payment, Review

class ServiceSerializer(serializers.ModelSerializer):
    type_of_service_name = serializers.ReadOnlyField(source='type_of_service.name')
    user_email = serializers.ReadOnlyField(source='user.email')
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'type_of_service', 'type_of_service_name', 'user', 'user_email', 'status', 'status_display']

    def validate(self, data):
        user = self.context['request'].user
        if user.role not in [UserAccount.UserRole.DELIVERER, UserAccount.UserRole.RECEIVER_AND_DELIVERER]:
            raise serializers.ValidationError("Solo los usuarios con rol de repartidor pueden crear servicios.")
        return data

class OrderSerializer(serializers.ModelSerializer):
    receiver_name = serializers.ReadOnlyField(source='receiver.get_full_name')
    receiver_email = serializers.ReadOnlyField(source='receiver.email')
    deliverer_name = serializers.ReadOnlyField(source='deliverer.get_full_name')
    deliverer_email = serializers.ReadOnlyField(source='deliverer.email')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    service_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'service', 'service_info', 'status', 'status_display',
                  'scheduled_date', 'amount', 'receiver', 'receiver_name',
                  'receiver_email', 'deliverer', 'deliverer_name', 'deliverer_email']
        read_only_fields = ['id', 'status_display', 'receiver_name', 'receiver_email',
                           'deliverer_name', 'deliverer_email', 'service_info']

    def get_service_info(self, obj):
        if obj.service:
            return {
                'id': obj.service.id,
                'type_of_service': obj.service.type_of_service.name,
                'status': obj.service.get_status_display(),
                'user': obj.service.user.email
            }
        return None

    def validate(self, data):
        # Set receiver from request user if creating
        if self.instance is None:  # Creating
            data['receiver'] = self.context['request'].user

        # Validate scheduled_date is in the future
        import datetime
        from django.utils import timezone
        if data.get('scheduled_date'):
            if data['scheduled_date'] < timezone.now():
                raise serializers.ValidationError("La fecha programada debe ser futura.")

        return data


class TypeOfServiceSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = TypeOfService
        fields = ['id', 'name', 'description', 'price', 'category', 'category_display']
        read_only_fields = ['id', 'category_display']


class PaymentSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    order_status = serializers.ReadOnlyField(source='order.get_status_display')

    class Meta:
        model = Payment
        fields = ['id', 'order', 'amount', 'status', 'status_display',
                  'payment_method', 'payment_method_display', 'order_status']
        read_only_fields = ['id', 'status_display', 'payment_method_display', 'order_status']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0.")
        return value


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    user_email = serializers.ReadOnlyField(source='user.email')
    service_name = serializers.ReadOnlyField(source='service.type_of_service.name')

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'user_email', 'order', 'rating',
                  'comment', 'service', 'service_name']
        read_only_fields = ['id', 'user', 'user_name', 'user_email', 'service_name']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value

    def validate(self, data):
        # Set user from request
        if self.instance is None:
            data['user'] = self.context['request'].user

        # Validate that the order is completed
        order = data.get('order')
        if order and order.status != Order.OrderStatus.COMPLETED:
            raise serializers.ValidationError("Solo se pueden calificar ordenes completadas.")

        # Validate that the user is either receiver or deliverer of the order
        user = data.get('user', self.context['request'].user)
        if order and user not in [order.receiver, order.deliverer]:
            raise serializers.ValidationError("Solo puedes calificar ordenes en las que participaste.")

        return data
