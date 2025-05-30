from rest_framework.permissions import BasePermission
from users.models import UserAccount

class IsDeliverer(BasePermission):
    def has_permission(self, request, _view):
        if not request.user.is_authenticated:
            return False
        
        return request.user.role in [UserAccount.UserRole.DELIVERER, UserAccount.UserRole.RECEIVER_AND_DELIVERER]
