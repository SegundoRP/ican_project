from django.contrib import admin
from .models import Condominium, Department


@admin.register(Condominium)
class CondominiumAdmin(admin.ModelAdmin):
    """Admin configuration for Condominium model"""
    list_display = ('name', 'address', 'district', 'region', 'entries', 'get_departments_count')
    list_filter = ('district', 'region')
    search_fields = ('name', 'address', 'district')
    ordering = ('name',)

    def get_departments_count(self, obj):
        """Get count of departments in condominium"""
        return obj.departments.count()
    get_departments_count.short_description = 'Número de Departamentos'


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    """Admin configuration for Department model"""
    list_display = ('name', 'tower', 'floor', 'condominium', 'get_residents_count')
    list_filter = ('condominium', 'tower', 'floor')
    search_fields = ('name', 'condominium__name')
    ordering = ('condominium', 'tower', 'floor', 'name')
    autocomplete_fields = ['condominium']

    def get_residents_count(self, obj):
        """Get count of residents in department"""
        return obj.users.count()
    get_residents_count.short_description = 'Número de Residentes'
