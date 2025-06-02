from rest_framework import serializers
from core.models.bookings import Booking # Updated import path
from .users_serializer import UserSerializer
from .listings_serializer import PropertyListingSerializer

class BookingSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    property = PropertyListingSerializer(read_only=True) # Changed from property_listing to property

    class Meta:
        model = Booking
        fields = '__all__'
