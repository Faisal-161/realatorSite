from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add custom fields if needed
    is_buyer = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    is_service_provider = models.BooleanField(default=False)
