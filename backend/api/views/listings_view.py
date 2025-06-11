from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticatedOrReadOnly # Replaced by custom permission
from core.models.listings import PropertyListing
from ..serializers.listings_serializer import PropertyListingSerializer
from ..permissions import IsOwnerOrReadOnly # Import custom permission


class PropertyListingViewSet(viewsets.ModelViewSet):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer
    permission_classes = [IsOwnerOrReadOnly] # Use custom permission

    def perform_create(self, serializer):
        # Automatically set the seller to the current authenticated user
        serializer.save(seller=self.request.user)
