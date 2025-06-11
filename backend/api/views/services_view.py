from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # Changed from IsAuthenticatedOrReadOnly
from core.models.services import ServiceOffer
from ..serializers.services_serializer import ServiceOfferSerializer

class ServiceOfferViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceOfferSerializer
    permission_classes = [IsAuthenticated] # Changed from IsAuthenticatedOrReadOnly

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ServiceOffer.objects.all()
        # Filter services offered by the current user if not staff
        return ServiceOffer.objects.filter(service_provider=user)

    def perform_create(self, serializer):
        # Automatically set the service_provider to the current authenticated user
        serializer.save(service_provider=self.request.user)
