from rest_framework import serializers
from .models import Department, Condominium

class CondominiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condominium
        fields = ['id', 'name', 'address', 'district', 'region', 'entries']

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
