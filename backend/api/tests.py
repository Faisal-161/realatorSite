from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from decimal import Decimal # Import Decimal

User = get_user_model()

class UserViewSetTests(APITestCase):
    def setUp(self):
        # User data for creating users
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'role': 'buyer' # Assuming 'role' is a field in your User model
        }
        # Create a user for tests that require an existing user (retrieve, update, delete)
        self.user = User.objects.create_user(
            username='existinguser',
            password='testpassword123',
            email='existing@example.com',
            role='seller'
        )
        # URL for listing/creating users
        self.users_url = reverse('user-list') # 'user-list' is the default basename for DRF router

    def test_list_users(self):
        """
        Ensure we can list users.
        """
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1) # At least the 'existinguser'

    def test_create_user(self):
        """
        Ensure we can create a new user.
        """
        self.client.force_authenticate(user=self.user) # Authenticate before creating
        response = self.client.post(self.users_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2) # existinguser + new testuser
        self.assertEqual(User.objects.last().username, self.user_data['username'])

    def test_retrieve_user(self):
        """
        Ensure we can retrieve a specific user.
        """
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_update_user(self):
        """
        Ensure we can update an existing user.
        This test might require authentication depending on UserViewSet permissions.
        If it fails due to auth, we'll need to authenticate the client.
        For now, assuming it might pass or we'll adjust.
        """
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        updated_data = {
            'username': 'updateduser',
            'email': 'updated@example.com',
            'role': 'buyer', # Role might be required
            'password': 'newpassword123' # Password might be required by serializer
        }
        # Attempt to authenticate if needed.
        # This simple authentication might not be enough if UserViewSet has strict permissions.
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, updated_data, format='json')

        # Check for successful update or permission denied
        if response.status_code == status.HTTP_403_FORBIDDEN:
            print("Update user test received 403, possibly due to permission settings on UserViewSet for updates.")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, updated_data['username'])

    def test_delete_user(self):
        """
        Ensure we can delete a user.
        This test might also require authentication/authorization.
        """
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        # Attempt to authenticate if needed.
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        if response.status_code == status.HTTP_403_FORBIDDEN:
            print("Delete user test received 403, possibly due to permission settings on UserViewSet for deletes.")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())


from core.models.services import ServiceOffer
from core.models.listings import PropertyListing

class ServiceOfferViewSetTests(APITestCase):
    def setUp(self):
        # Create a user to act as service provider and another for property owner
        self.property_owner = User.objects.create_user(
            username='propertyowner',
            password='testpassword123',
            email='owner@example.com',
            role='seller'
        )
        self.service_provider_user = User.objects.create_user(
            username='serviceprovider',
            password='testpassword123',
            email='provider@example.com',
            role='partner' # Assuming 'partner' role for service providers
        )

        # Create a PropertyListing needed for ServiceOffer
        self.property_listing = PropertyListing.objects.create(
            seller=self.property_owner, # Changed from agent
            title='Test Property for Service',
            description='A property needing services.',
            address='123 Test St',
            # city='Testville', # Removed
            price=100000,
            num_bedrooms=3, # Changed from bedrooms
            num_bathrooms=2, # Changed from bathrooms
            # is_published=True # Removed
        )

        self.service_data = {
            'title': 'Test Service Offer',
            'description': 'Detailed description of the test service.',
            # 'service_provider': self.service_provider_user.pk, # Will be set by view if authenticated user is provider
            'property': self.property_listing.pk,
            'approved': False
        }

        # This service will be created for retrieve, update, delete tests
        self.service_offer = ServiceOffer.objects.create(
            service_provider=self.service_provider_user,
            property=self.property_listing,
            title='Existing Service',
            description='An existing service offer for testing.',
            approved=True
        )

        self.services_url = reverse('serviceoffer-list') # Basename from api/urls.py

    def test_list_services(self):
        """
        Ensure we can list service offers. Assumes public readability or IsAuthenticatedOrReadOnly.
        """
        response = self.client.get(self.services_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data
        if isinstance(response.data, dict) and 'results' in response.data:
            results = response.data.get('results', [])
        elif not isinstance(response.data, list):
            results = []
        self.assertTrue(any(d['title'] == self.service_offer.title for d in results))


    def test_create_service_offer(self):
        """
        Ensure we can create a new service offer. Assumes authentication is required.
        """
        self.client.force_authenticate(user=self.service_provider_user)
        response = self.client.post(self.services_url, self.service_data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print(f"Create service offer failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_service = ServiceOffer.objects.filter(title=self.service_data['title']).first()
        self.assertIsNotNone(new_service)
        self.assertEqual(new_service.service_provider, self.service_provider_user)

    def test_retrieve_service_offer(self):
        """
        Ensure we can retrieve a specific service offer.
        """
        url = reverse('serviceoffer-detail', kwargs={'pk': self.service_offer.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.service_offer.title)

    def test_update_service_offer(self):
        """
        Ensure we can update an existing service offer. Requires auth, likely by service provider.
        """
        url = reverse('serviceoffer-detail', kwargs={'pk': self.service_offer.pk})
        updated_data = {
            'title': 'Updated Service Offer',
            'description': 'Updated description.',
            'property': self.property_listing.pk, # Property might be required
            'approved': True # Assuming we are testing updating the approved status
        }
        self.client.force_authenticate(user=self.service_provider_user) # Authenticate as the provider
        response = self.client.put(url, updated_data, format='json')
        if response.status_code != status.HTTP_200_OK:
            print(f"Update service offer failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.service_offer.refresh_from_db()
        self.assertEqual(self.service_offer.title, updated_data['title'])
        self.assertEqual(self.service_offer.approved, updated_data['approved'])

    def test_delete_service_offer(self):
        """
        Ensure we can delete a service offer. Requires auth, likely by service provider.
        """
        url = reverse('serviceoffer-detail', kwargs={'pk': self.service_offer.pk})
        self.client.force_authenticate(user=self.service_provider_user) # Authenticate as the provider
        response = self.client.delete(url)
        if response.status_code != status.HTTP_204_NO_CONTENT:
            print(f"Delete service offer failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ServiceOffer.objects.filter(pk=self.service_offer.pk).exists())


class PropertyListingViewSetTests(APITestCase):
    def setUp(self):
        self.seller_user = User.objects.create_user(
            username='testseller',
            password='testpassword123',
            email='seller@example.com',
            role='seller' # Assuming role distinction
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            password='testpassword123',
            email='other@example.com',
            role='buyer'
        )

        self.listing_data = {
            'title': 'Beautiful Beach House',
            'description': 'A lovely house by the sea.',
            'address': '123 Ocean Drive',
            'num_bedrooms': 4,
            'num_bathrooms': 3,
            'price': '500000.00'
            # 'seller' will be set by the view based on authenticated user
        }

        # Create an existing listing for retrieve, update, delete tests
        self.property_listing = PropertyListing.objects.create(
            seller=self.seller_user,
            title='Cozy Mountain Cabin',
            description='A quiet cabin in the mountains.',
            address='456 Pinecone Rd',
            num_bedrooms=2,
            num_bathrooms=1,
            price='250000.00'
        )

        self.listings_url = reverse('propertylisting-list') # Basename from api/urls.py

    def test_list_property_listings(self):
        """
        Ensure we can list property listings. Publicly accessible.
        """
        response = self.client.get(self.listings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # More robust check for presence of the item, considering pagination
        results = response.data
        if isinstance(response.data, dict) and 'results' in response.data:
            results = response.data.get('results', [])
        elif not isinstance(response.data, list):
            results = []
        self.assertTrue(any(d['title'] == self.property_listing.title for d in results))


    def test_create_property_listing(self):
        """
        Ensure we can create a new property listing. Requires authentication.
        The authenticated user should become the seller.
        """
        self.client.force_authenticate(user=self.seller_user)
        response = self.client.post(self.listings_url, self.listing_data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print(f"Create property listing failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_listing = PropertyListing.objects.filter(title=self.listing_data['title']).first()
        self.assertIsNotNone(new_listing)
        self.assertEqual(new_listing.seller, self.seller_user)

    def test_retrieve_property_listing(self):
        """
        Ensure we can retrieve a specific property listing. Publicly accessible.
        """
        url = reverse('propertylisting-detail', kwargs={'pk': self.property_listing.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.property_listing.title)

    def test_update_property_listing_by_seller(self):
        """
        Ensure the seller can update their own property listing.
        """
        url = reverse('propertylisting-detail', kwargs={'pk': self.property_listing.pk})
        updated_data = {
            'title': 'Updated Mountain Cabin',
            'description': 'An even cozier cabin.',
            'address': '456 Pinecone Rd, Updated',
            'num_bedrooms': 3, # Changed
            'num_bathrooms': 1,
            'price': '275000.00' # Changed
        }
        self.client.force_authenticate(user=self.seller_user)
        response = self.client.put(url, updated_data, format='json')
        if response.status_code != status.HTTP_200_OK:
            print(f"Update property listing failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.property_listing.refresh_from_db()
        self.assertEqual(self.property_listing.title, updated_data['title'])
        self.assertEqual(self.property_listing.num_bedrooms, updated_data['num_bedrooms'])
        self.assertEqual(self.property_listing.price, Decimal(updated_data['price']))

    def test_update_property_listing_by_other_user_forbidden(self):
        """
        Ensure a user cannot update another user's property listing.
        """
        url = reverse('propertylisting-detail', kwargs={'pk': self.property_listing.pk})
        updated_data = {'title': 'Attempted Update by Other', 'description': 'test', 'address':'test', 'num_bedrooms':1, 'num_bathrooms':1, 'price': '100'} # Provide all required fields
        self.client.force_authenticate(user=self.other_user) # Authenticate as a different user
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Or 404 if not found policy

    def test_delete_property_listing_by_seller(self):
        """
        Ensure the seller can delete their own property listing.
        """
        url = reverse('propertylisting-detail', kwargs={'pk': self.property_listing.pk})
        self.client.force_authenticate(user=self.seller_user)
        response = self.client.delete(url)
        if response.status_code != status.HTTP_204_NO_CONTENT:
            print(f"Delete property listing failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(PropertyListing.objects.filter(pk=self.property_listing.pk).exists())

    def test_delete_property_listing_by_other_user_forbidden(self):
        """
        Ensure a user cannot delete another user's property listing.
        """
        url = reverse('propertylisting-detail', kwargs={'pk': self.property_listing.pk})
        self.client.force_authenticate(user=self.other_user) # Authenticate as a different user
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Or 404


from core.models.bookings import Booking

class BookingViewSetTests(APITestCase):
    def setUp(self):
        self.buyer_user = User.objects.create_user(
            username='testbuyer', password='testpassword123', email='buyer@example.com', role='buyer'
        )
        self.another_buyer_user = User.objects.create_user(
            username='anotherbuyer', password='testpassword123', email='anotherbuyer@example.com', role='buyer'
        )
        self.staff_user = User.objects.create_user(
            username='staffmember', password='testpassword123', email='staff@example.com', role='admin', is_staff=True
        )

        # Seller for the property listing
        self.seller_user = User.objects.create_user(
            username='propseller', password='testpassword123', email='propseller@example.com', role='seller'
        )

        self.property_listing = PropertyListing.objects.create(
            seller=self.seller_user,
            title='Test Property for Booking',
            description='A property available for booking.',
            address='789 Booking Ave',
            num_bedrooms=3,
            num_bathrooms=2,
            price='300000.00'
        )
        self.another_property_listing = PropertyListing.objects.create(
            seller=self.seller_user, # Can be the same seller or different
            title='Another Test Property',
            description='Another property available for booking.',
            address='101 Booking Blvd',
            num_bedrooms=1,
            num_bathrooms=1,
            price='150000.00'
        )

        self.booking_data = {
            'property': self.property_listing.pk,
            'scheduled_date': '2024-08-15', # Use a valid future date string
            'scheduled_time': '14:30:00', # Use a valid time string
            'message': 'Looking forward to the viewing.'
        }

        # Booking for self.buyer_user
        self.booking1 = Booking.objects.create(
            buyer=self.buyer_user,
            property=self.property_listing,
            scheduled_date='2024-08-01',
            scheduled_time='10:00:00',
            message='My first booking'
        )
        # Booking for self.another_buyer_user
        self.booking2 = Booking.objects.create(
            buyer=self.another_buyer_user,
            property=self.another_property_listing,
            scheduled_date='2024-08-02',
            scheduled_time='11:00:00',
            message='Another user booking'
        )

        self.bookings_url = reverse('booking-list') # Basename from api/urls.py

    def test_list_bookings_unauthenticated(self):
        response = self.client.get(self.bookings_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # IsAuthenticated returns 403 if no specific auth backend challenges with 401

    def test_list_bookings_as_buyer(self):
        """ A buyer should only see their own bookings. """
        self.client.force_authenticate(user=self.buyer_user)
        response = self.client.get(self.bookings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that response.data is a list before len()
        response_data = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['id'], self.booking1.pk)

    def test_list_bookings_as_staff(self):
        """ A staff user should see all bookings. """
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.bookings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertGreaterEqual(len(response_data), 2) # At least the two created in setUp

    def test_create_booking(self):
        """ Authenticated user can create a booking. Buyer is set automatically. """
        self.client.force_authenticate(user=self.buyer_user)
        initial_booking_count = Booking.objects.count()
        response = self.client.post(self.bookings_url, self.booking_data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print(f"Create booking failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), initial_booking_count + 1)
        new_booking = Booking.objects.latest('created_at')
        self.assertEqual(new_booking.buyer, self.buyer_user)
        self.assertEqual(new_booking.property.pk, self.booking_data['property'])

    def test_retrieve_own_booking(self):
        self.client.force_authenticate(user=self.buyer_user)
        url = reverse('booking-detail', kwargs={'pk': self.booking1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.booking1.pk)

    def test_retrieve_others_booking_forbidden(self):
        self.client.force_authenticate(user=self.buyer_user) # Authenticated as buyer_user
        url = reverse('booking-detail', kwargs={'pk': self.booking2.pk}) # Trying to access booking of another_buyer_user
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # Due to get_queryset filtering

    def test_retrieve_others_booking_as_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse('booking-detail', kwargs={'pk': self.booking1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.booking1.pk)

    def test_update_own_booking(self):
        self.client.force_authenticate(user=self.buyer_user)
        url = reverse('booking-detail', kwargs={'pk': self.booking1.pk})
        updated_data = {
            'property': self.booking1.property.pk, # Property usually not changed, but serializer needs it
            'scheduled_date': '2024-09-10',
            'scheduled_time': '15:00:00',
            'message': 'Updated booking message.'
        }
        response = self.client.put(url, updated_data, format='json')
        if response.status_code != status.HTTP_200_OK:
            print(f"Update booking failed with {response.status_code}: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.booking1.refresh_from_db()
        self.assertEqual(self.booking1.scheduled_date.strftime('%Y-%m-%d'), updated_data['scheduled_date'])

    def test_update_others_booking_forbidden(self):
        self.client.force_authenticate(user=self.buyer_user)
        url = reverse('booking-detail', kwargs={'pk': self.booking2.pk})
        updated_data = {'message': 'Attempt to update others booking', 'property': self.booking2.property.pk, 'scheduled_date': '2024-09-11', 'scheduled_time': '15:00:00'}
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # Filtered by get_queryset

    def test_delete_own_booking(self):
        self.client.force_authenticate(user=self.buyer_user)
        url = reverse('booking-detail', kwargs={'pk': self.booking1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Booking.objects.filter(pk=self.booking1.pk).exists())

    def test_delete_others_booking_forbidden(self):
        self.client.force_authenticate(user=self.buyer_user)
        url = reverse('booking-detail', kwargs={'pk': self.booking2.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # Filtered by get_queryset
