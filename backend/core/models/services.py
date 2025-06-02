# Services for models
from django.db import models
from .users import User
from .listings import PropertyListing

class ServiceOffer(models.Model):
    service_provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_offers')
    property = models.ForeignKey(PropertyListing, on_delete=models.CASCADE, related_name='service_offers')
    title = models.CharField(max_length=255)
    description = models.TextField()
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.property.title} by {self.service_provider.username}"
