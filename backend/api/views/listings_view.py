from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticatedOrReadOnly # Replaced by custom
from core.models.listings import PropertyListing
from ..serializers.listings_serializer import PropertyListingSerializer
from core.permissions import IsSellerOrReadOnly # Import custom permission


class PropertyListingViewSet(viewsets.ModelViewSet):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer
    permission_classes = [IsSellerOrReadOnly] # Use custom permission

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
