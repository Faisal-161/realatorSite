# core/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add extra fields here if needed
    is_buyer = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    is_partner = models.BooleanField(default=False)
