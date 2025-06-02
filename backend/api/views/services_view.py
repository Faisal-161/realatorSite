from rest_framework.views import APIView
from rest_framework.response import Response

# For services_view.py
class ServicesView(APIView):
    def get(self, request):
        return Response({"message": "Services working"})

