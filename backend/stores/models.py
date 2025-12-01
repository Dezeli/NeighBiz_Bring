from django.db import models
from accounts.models import OwnerUser
from common.enums import StoreCategory

class Store(models.Model):
    owner = models.OneToOneField(
        OwnerUser,
        on_delete=models.CASCADE,
        related_name='store'
    )

    name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)

    category = models.CharField(
        max_length=20,
        choices=StoreCategory.choices(),
        default=StoreCategory.OTHER.value,
    )

    description = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)

    
    business_hours = models.JSONField(default=dict)
    ''' example
    {
        "mon": { "open": "10:00", "close": "20:00", "break": ["14:00", "16:00"] },
        "tue": { "open": "10:00", "close": "20:00" },
        "wed": { "closed": true },
        "thu": { "open": "11:00", "close": "21:00" },
        "fri": { "open": "11:00", "close": "23:00" },
        "sat": { "open": "12:00", "close": "23:00" },
        "sun": { "closed": true }
    }
    '''

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"
