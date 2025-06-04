from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.models.listings import PropertyListing
from ..serializers.listings_serializer import PropertyListingSerializer


class PropertyListingViewSet(viewsets.ModelViewSet):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
