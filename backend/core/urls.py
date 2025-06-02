from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home_view(request):
    return HttpResponse("Welcome to the Real Estate Collaboration Platform API!")

urlpatterns = [
    path('', home_view),  # 👈 This handles the root path /
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
