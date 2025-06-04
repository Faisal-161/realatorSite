from django.http import HttpResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter

def home(request):
    return HttpResponse("Welcome to the Real Estate Collaboration Platform API.")