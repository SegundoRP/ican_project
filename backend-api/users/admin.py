from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import UserAccount


@admin.register(UserAccount)
class UserAccountAdmin(BaseUserAdmin):
    """Admin configuration for UserAccount model"""
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_available_for_delivery',
                   'department', 'is_active', 'is_staff')
    list_filter = ('role', 'is_available_for_delivery', 'is_active', 'is_staff',
                  'department__condominium')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Role and Location'), {'fields': ('role', 'department', 'is_available_for_delivery')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name',
                      'role', 'department'),
        }),
    )

    actions = ['make_deliverer', 'make_receiver', 'toggle_availability']

    def make_deliverer(self, request, queryset):
        """Change selected users to deliverer role"""
        updated = queryset.update(role=UserAccount.UserRole.DELIVERER)
        self.message_user(request, f'{updated} usuarios cambiados a rol Repartidor.')
    make_deliverer.short_description = "Cambiar a rol Repartidor"

    def make_receiver(self, request, queryset):
        """Change selected users to receiver role"""
        updated = queryset.update(role=UserAccount.UserRole.RECEIVER)
        self.message_user(request, f'{updated} usuarios cambiados a rol Receptor.')
    make_receiver.short_description = "Cambiar a rol Receptor"

    def toggle_availability(self, request, queryset):
        """Toggle delivery availability for selected users"""
        for user in queryset:
            if user.role in [UserAccount.UserRole.DELIVERER,
                           UserAccount.UserRole.RECEIVER_AND_DELIVERER]:
                user.is_available_for_delivery = not user.is_available_for_delivery
                user.save()
        self.message_user(request, 'Disponibilidad actualizada para los usuarios seleccionados.')
    toggle_availability.short_description = "Alternar disponibilidad de entrega"
