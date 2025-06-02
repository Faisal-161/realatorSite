
from django.urls import path, include
urlpatterns = [
    path('', include('rest_framework.urls')),
]

from .views.listings_view import ListingsView
from .views.bookings_view import BookingsView
from .views.services_view import ServicesView
from .views.user_view import UsersView
urlpatterns += [
    path('listings/', ListingsView.as_view(), name='listings'),
    path('bookings/', BookingsView.as_view(), name='bookings'),
    path('services/', ServicesView.as_view(), name='services'),
    path('users/', UsersView.as_view(), name='users'),
]