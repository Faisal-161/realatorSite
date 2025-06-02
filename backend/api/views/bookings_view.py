from rest_framework.views import APIView
from rest_framework.response import Response

# For bookings_view.py
class BookingsView(APIView):
    def get(self, request):
        return Response({"message": "Bookings working"})