from django.contrib import admin
from core.models.users import User
from core.models.bookings import Booking
from core.models.listings import PropertyListing
from core.models.services import ServiceOffer
  # Assuming Booking is the model class

admin.site.register(Booking)
admin.site.register(PropertyListing)
admin.site.register(ServiceOffer)
admin.site.register(User)

