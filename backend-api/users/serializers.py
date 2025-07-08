from rest_framework import serializers
from condominiums.models import Department
from .models import UserAccount


class UserAccountSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    department_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'role',
                  'role_display', 'department', 'department_info', 'is_available',
                  'date_joined', 'last_login']
        read_only_fields = ['id', 'email', 'date_joined', 'last_login',
                           'full_name', 'role_display', 'department_info']

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_department_info(self, obj):
        if obj.department:
            return {
                'id': obj.department.id,
                'number': obj.department.number,
                'floor': obj.department.floor,
                'tower': obj.department.tower,
                'condominium': {
                    'id': obj.department.condominium.id,
                    'name': obj.department.condominium.name,
                    'address': obj.department.condominium.address
                }
            }
        return None

    def validate_role(self, value):
        if value not in [UserAccount.UserRole.RECEIVER,
                        UserAccount.UserRole.DELIVERER,
                        UserAccount.UserRole.RECEIVER_AND_DELIVERER]:
            raise serializers.ValidationError("Rol inválido.")
        return value

    def validate_department(self, value):
        if value and not Department.objects.filter(id=value.id).exists():  # pylint: disable=no-member
            raise serializers.ValidationError("El departamento no existe.")
        return value
