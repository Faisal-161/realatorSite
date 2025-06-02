
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.listings_view import PropertyListingViewSet
from .views.bookings_view import BookingViewSet
from .views.services_view import ServiceOfferViewSet
from .views.user_view import UserViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'listings', PropertyListingViewSet, basename='propertylisting')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'services', ServiceOfferViewSet, basename='serviceoffer')
router.register(r'users', UserViewSet, basename='user')

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')) # For browsable API
]