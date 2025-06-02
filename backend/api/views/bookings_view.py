from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.models.bookings import Booking
from backend.api.serializers.bookings_serializer import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Restricts the returned bookings to the current authenticated user,
        or all bookings if the user is staff.
        """
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(buyer=user)

    def perform_create(self, serializer):
        # Automatically set the buyer to the current authenticated user
        serializer.save(buyer=self.request.user)