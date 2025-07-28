from rest_framework import permissions
from users.models import UserAccount


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Used for models that have a 'user' field (Review, Service).
    """
    def has_object_permission(self, request, _view, obj):
        # Check if the object has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class IsReceiver(permissions.BasePermission):
    """
    Permission to check if user has receiver role.
    """
    def has_permission(self, request, _view):
        return (request.user.is_authenticated and
                request.user.role in [UserAccount.UserRole.RECEIVER,
                                    UserAccount.UserRole.RECEIVER_AND_DELIVERER])


class IsDeliverer(permissions.BasePermission):
    """
    Permission to check if user has deliverer role.
    """
    def has_permission(self, request, _view):
        return (request.user.is_authenticated and
                request.user.role in [UserAccount.UserRole.DELIVERER,
                                    UserAccount.UserRole.RECEIVER_AND_DELIVERER])


class IsOrderParticipant(permissions.BasePermission):
    """
    Permission to check if user is either receiver or deliverer of an order.
    """
    def has_object_permission(self, request, _view, obj):
        if not request.user.is_authenticated:
            return False

        # For Order model
        if hasattr(obj, 'receiver') and hasattr(obj, 'deliverer'):
            return request.user in [obj.receiver, obj.deliverer]

        # For Payment/Review models that have order relation
        if hasattr(obj, 'order'):
            return request.user in [obj.order.receiver, obj.order.deliverer]

        return False


class IsReceiverOfOrder(permissions.BasePermission):
    """
    Permission to check if user is the receiver of an order.
    """
    def has_object_permission(self, request, _view, obj):
        if not request.user.is_authenticated:
            return False

        # For Order model
        if hasattr(obj, 'receiver'):
            return obj.receiver == request.user

        # For Payment model that has order relation
        if hasattr(obj, 'order'):
            return obj.order.receiver == request.user

        return False


class IsDelivererOfOrder(permissions.BasePermission):
    """
    Permission to check if user is the deliverer of an order.
    """
    def has_object_permission(self, request, _view, obj):
        if not request.user.is_authenticated:
            return False

        # For Order model
        if hasattr(obj, 'deliverer'):
            return obj.deliverer == request.user

        # For models that have order relation
        if hasattr(obj, 'order'):
            return obj.order.deliverer == request.user

        return False
