# pylint: disable=C0116,C0115,C0114,E0307,R0901
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser, PermissionsMixin)

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        user = self.create_user(email, password=password, **kwargs)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    class UserRole(models.IntegerChoices):
        RECEIVER = 1, _('Receptor')
        DELIVERER = 2, _('Repartidor')
        RECEIVER_AND_DELIVERER = 3, _('Receptor y Repartidor')

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_available_for_delivery = models.BooleanField(default=False)
    role = models.IntegerField(
        choices=UserRole.choices,
        default=UserRole.RECEIVER
    )
    department = models.ForeignKey('condominiums.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    # This allow to use User.objects with .get, .filter, .create_user,
    # use methods in UserAccountManager etc
    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    @property
    def is_available(self):
        """Check if user is available for delivery"""
        return (self.is_available_for_delivery and
                self.role in [self.UserRole.DELIVERER, self.UserRole.RECEIVER_AND_DELIVERER])
