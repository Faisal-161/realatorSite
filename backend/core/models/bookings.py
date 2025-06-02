# Bookings for models
from django.db import models
from .users import User
from .listings import PropertyListing

class Booking(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    property = models.ForeignKey(PropertyListing, on_delete=models.CASCADE, related_name='bookings')
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.buyer.username} → {self.property.title} on {self.scheduled_date}"
