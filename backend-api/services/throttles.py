from rest_framework.throttling import UserRateThrottle


class OrderCreateRateThrottle(UserRateThrottle):
    """
    Custom throttle for order creation.
    Limits users to 10 order creations per hour.
    """
    scope = 'order_create'

    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None  # Only throttle authenticated users

        return self.cache_format % {
            'scope': self.scope,
            'ident': request.user.pk
        }
