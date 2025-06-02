from rest_framework import serializers
from core.models.services import ServiceOffer # Updated import path
from .users_serializer import UserSerializer
from .listings_serializer import PropertyListingSerializer

class ServiceOfferSerializer(serializers.ModelSerializer):
    service_provider = UserSerializer(read_only=True) # Changed from provider
    property = PropertyListingSerializer(read_only=True) # Changed from property_listing

    class Meta:
        model = ServiceOffer
        fields = '__all__'
