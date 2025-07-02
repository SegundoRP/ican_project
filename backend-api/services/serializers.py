from rest_framework import serializers
from users.models import UserAccount
from .models import Service, Order

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
    receiver_name = serializers.ReadOnlyField(source='receiver.first_name')
    deliverer_name = serializers.ReadOnlyField(source='deliverer.first_name')

    class Meta:
        model = Order
        fields = ['id', 'service', 'status', 'scheduled_date', 'receiver', 'deliverer', 'receiver_name', 'deliverer_name']
        read_only_fields = ['id', 'receiver', 'deliverer', 'receiver_name', 'deliverer_name']
