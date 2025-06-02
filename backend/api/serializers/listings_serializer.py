from rest_framework import serializers
from core.models.listings import PropertyListing # Updated import path
from .users_serializer import UserSerializer

class PropertyListingSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)

    class Meta:
        model = PropertyListing
        fields = '__all__'
