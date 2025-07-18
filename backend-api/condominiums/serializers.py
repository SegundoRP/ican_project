from rest_framework import serializers
from .models import Department, Condominium

class CondominiumSerializer(serializers.ModelSerializer):
    departments = serializers.SerializerMethodField(read_only=True)
    departments_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Condominium
        fields = ['id', 'name', 'address', 'district', 'region', 'entries',
                  'departments', 'departments_count']

    def get_departments(self, obj):
        # Only include departments in detail view, not in list view
        if self.context.get('include_departments', False):
            departments = obj.departments.all()
            return DepartmentSerializer(departments, many=True, read_only=True).data
        return None

    def get_departments_count(self, obj):
        return obj.departments.count()

class DepartmentSerializer(serializers.ModelSerializer):
    condominium_name = serializers.ReadOnlyField(source='condominium.name')

    class Meta:
        model = Department
        fields = ['id', 'name', 'tower', 'floor', 'condominium', 'condominium_name']

    def to_representation(self, instance):
        """
        Add additional information of the condominium for the representation
        """
        representation = super().to_representation(instance)
        representation['condominium_details'] = {
            'name': instance.condominium.name,
            'address': instance.condominium.address,
            'district': instance.condominium.district
        }
        return representation
