from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.models.services import ServiceOffer
from ..serializers.services_serializer import ServiceOfferSerializer

class ServiceOfferViewSet(viewsets.ModelViewSet):
    queryset = ServiceOffer.objects.all()
    serializer_class = ServiceOfferSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # TODO: Add logic to filter offers for a specific property or by provider if needed
    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_staff:
    #         return ServiceOffer.objects.all()
    #     # Example: return offers created by the user or related to their properties
    #     return ServiceOffer.objects.filter(service_provider=user) # Or other logic

    # TODO: Add logic for setting service_provider if not part of request data
    # def perform_create(self, serializer):
    #     # Example: serializer.save(service_provider=self.request.user)
    #     serializer.save()
