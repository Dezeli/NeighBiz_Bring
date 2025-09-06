from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class OwnerUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("아이디는 필수입니다.")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')
        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')

        return self.create_user(username, password, **extra_fields)


class OwnerUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=20)
    business_license_image = models.CharField(max_length=512, blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = OwnerUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['phone_number', 'name']

    def __str__(self):
        return f"[{self.username}] {self.name}"


class ConsumerUser(models.Model):
    kakao_id = models.CharField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=20)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Consumer {self.phone_number or self.kakao_id}"
    




class OwnerRefreshToken(models.Model):
    user = models.ForeignKey("accounts.OwnerUser", on_delete=models.CASCADE)
    token = models.TextField()
    device_info = models.CharField(max_length=255)
    
    revoked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"[OWNER] Token for {self.user.username} ({'revoked' if self.revoked else 'active'})"


class ConsumerRefreshToken(models.Model):
    user = models.ForeignKey("accounts.ConsumerUser", on_delete=models.CASCADE)
    token = models.TextField()
    device_info = models.CharField(max_length=255)

    revoked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"[CONSUMER] Token for {self.user.phone_number} ({'revoked' if self.revoked else 'active'})"



class PhoneVerification(models.Model):
    phone_number = models.CharField(max_length=20)
    code = models.CharField(max_length=6)

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.phone_number} ({'verified' if self.is_verified else 'pending'})"
