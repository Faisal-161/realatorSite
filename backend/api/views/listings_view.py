from rest_framework.views import APIView
from rest_framework.response import Response

class ListingsView(APIView):
    def get(self, request):
        return Response({"message": "Listings API is working."})
