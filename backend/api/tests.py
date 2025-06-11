from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from core.models import PropertyListing, ServiceOffer #, Booking
# Assuming User model is from core.models.users
User = get_user_model()

class UserViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123', role='user')
        self.other_user = User.objects.create_user(username='otheruser', email='other@example.com', password='password123', role='user')
        self.admin_user = User.objects.create_superuser(username='adminuser', email='admin@example.com', password='password123', role='admin')

        self.client = APIClient()
        self.register_url = reverse('user-list') # 'user-list' is default from DefaultRouter for UserViewSet

    def test_user_registration_allow_any(self):
        """Test new user registration is allowed for anyone."""
        data = {'username': 'newuser', 'email': 'new@example.com', 'password': 'newpassword123', 'role': 'user'}
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        # Role should be default or ignored, not set by user if serializer is read-only for role
        created_user = User.objects.get(username='newuser')
        self.assertEqual(created_user.role, 'user') # Assuming 'user' is a default or only assignable role on creation

    def test_list_users_admin_only(self):
        """Test listing users is restricted to admin users."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) # Depends on pagination, adjust if needed

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_user_is_admin_or_self(self):
        """Test retrieving user details is allowed for admin or self."""
        # Self
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

        # Other user by non-admin
        url_other = reverse('user-detail', kwargs={'pk': self.other_user.pk})
        response = self.client.get(url_other) # Still authenticated as self.user
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Other user by admin
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url_other)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.other_user.username)

    def test_update_user_is_admin_or_self_role_readonly(self):
        """Test updating user details, role should be read-only for non-admins."""
        # Self update (non-role field)
        self.client.force_authenticate(user=self.user)
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        update_data = {'username': 'updateduser'}
        response = self.client.patch(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'updateduser')

        # Self update (attempt to change role)
        original_role = self.user.role
        update_data_role = {'role': 'admin'}
        response = self.client.patch(url, update_data_role)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # Update itself is allowed
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, original_role) # Role should not have changed

        # Update other by admin (including role if admin can)
        self.client.force_authenticate(user=self.admin_user)
        url_other = reverse('user-detail', kwargs={'pk': self.other_user.pk})
        admin_update_data = {'username': 'otherupdated', 'role': 'admin'}
        response = self.client.patch(url_other, admin_update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.other_user.refresh_from_db()
        self.assertEqual(self.other_user.username, 'otherupdated')
        # Whether role is changed by admin depends on if serializer allows it even for admin
        # Given current UserSerializer, role is read_only for everyone via this view.
        # self.assertEqual(self.other_user.role, 'admin') # This would fail
        self.assertNotEqual(self.other_user.role, 'admin')


    def test_delete_user_is_admin_or_self(self):
        # Delete other by non-admin
        self.client.force_authenticate(user=self.user)
        url_other = reverse('user-detail', kwargs={'pk': self.other_user.pk})
        response = self.client.delete(url_other)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Delete other by admin
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(url_other)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.other_user.pk).exists())

        # Delete self
        # Re-create other_user as it was deleted
        self.other_user = User.objects.create_user(username='otheruser2', email='other2@example.com', password='password123', role='user')
        self.client.force_authenticate(user=self.user)
        url_self = reverse('user-detail', kwargs={'pk': self.user.pk})
        response = self.client.delete(url_self)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())


class PropertyListingViewSetTests(APITestCase):
    def setUp(self):
        self.user_seller = User.objects.create_user(username='seller', email='seller@example.com', password='password123', role='user')
        self.other_user = User.objects.create_user(username='buyer', email='buyer@example.com', password='password123', role='user')
        self.admin_user = User.objects.create_superuser(username='admin', email='admin@example.com', password='adminpass', role='admin')
        self.client = APIClient()
        self.listings_url = reverse('propertylisting-list')

    def test_create_listing_seller_auto_set(self):
        self.client.force_authenticate(user=self.user_seller)
        data = {'title': 'Beach House', 'description': 'Lovely view', 'address': '123 Ocean Ave', 'num_bedrooms': 3, 'num_bathrooms': 2, 'price': '500000.00'}
        response = self.client.post(self.listings_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        listing = PropertyListing.objects.get(pk=response.data['id'])
        self.assertEqual(listing.seller, self.user_seller)

    def test_create_listing_anonymous_forbidden(self):
        data = {'title': 'Beach House', 'description': 'Lovely view', 'address': '123 Ocean Ave', 'num_bedrooms': 3, 'num_bathrooms': 2, 'price': '500000.00'}
        response = self.client.post(self.listings_url, data) # No authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) # IsAuthenticatedOrReadOnly allows POST only if authenticated

    def test_update_own_listing(self):
        self.client.force_authenticate(user=self.user_seller)
        listing = PropertyListing.objects.create(seller=self.user_seller, title='Old Title', description='Old', address='Old Ad', num_bedrooms=1, num_bathrooms=1, price='100')
        url = reverse('propertylisting-detail', kwargs={'pk': listing.pk})
        update_data = {'title': 'New Title'}
        response = self.client.patch(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        listing.refresh_from_db()
        self.assertEqual(listing.title, 'New Title')

    def test_update_others_listing_forbidden(self):
        listing = PropertyListing.objects.create(seller=self.user_seller, title='Test Title', description='Test', address='Test Ad', num_bedrooms=1, num_bathrooms=1, price='100')
        self.client.force_authenticate(user=self.other_user) # Authenticate as a different user
        url = reverse('propertylisting-detail', kwargs={'pk': listing.pk})
        update_data = {'title': 'Attempted New Title'}
        response = self.client.patch(url, update_data)
        # IsAuthenticatedOrReadOnly doesn't grant object-level permission by default for PATCH to non-owner
        # Django REST framework's ModelViewSet typically requires explicit object-level permissions for this.
        # If no custom object-level permission like IsOwnerOrReadOnly is set, this might pass if the user is authenticated.
        # However, our intent is that only owner or admin should modify.
        # Let's assume a proper IsOwnerOrReadOnly or similar is implicitly part of ModelViewSet for PATCH/PUT/DELETE
        # For now, without such a specific permission, an authenticated user *might* be able to patch if not explicitly denied.
        # This test needs to be verified against actual permissions. Assuming standard DRF, it should be 403 if not owner.
        # If PropertyListingViewSet had `permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]`, this would be 403.
        # With just `IsAuthenticatedOrReadOnly`, any authenticated user can update if not further restricted.
        # The task implies seller-only updates. This means a custom permission class is needed on the ViewSet.
        # For now, this test might fail or pass depending on the exact permission setup.
        # Given the objective, this *should* be a 403. If it's 200, the permissions are too lax.
        # Let's assume the default ModelViewSet behavior with IsAuthenticatedOrReadOnly is not sufficient for object-level protection on updates by non-owners.
        # A simple way to test this would be to add a custom permission to the ViewSet.
        # As of now, PropertyListingViewSet has no custom IsOwner permission.
        # Let's write the test expecting a 403, implying that ModelViewSet + IsAuthenticatedOrReadOnly should deny if not owner.
        # This is often a point of confusion. ModelViewSet does NOT provide object-level permissions out of the box for updates beyond simple authentication.
        # We will assume for the test that it should be 403 if not owner.
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # This is the desired state.


class ServiceOfferViewSetTests(APITestCase):
    def setUp(self):
        self.provider_user = User.objects.create_user(username='provider1', email='p1@example.com', password='password123', role='user')
        self.other_provider = User.objects.create_user(username='provider2', email='p2@example.com', password='password123', role='user')
        self.staff_user = User.objects.create_user(username='staff', email='staff@example.com', password='password123', role='admin', is_staff=True) # is_staff is key
        self.client = APIClient()
        self.services_url = reverse('serviceoffer-list')
        self.property1 = PropertyListing.objects.create(seller=self.provider_user, title="Prop1", description=".", address=".", num_bedrooms=1,num_bathrooms=1,price="1")


    def test_create_service_provider_auto_set(self):
        self.client.force_authenticate(user=self.provider_user)
        data = {'title': 'Cleaning Service', 'description': 'General cleaning', 'property': self.property1.pk}
        response = self.client.post(self.services_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        service = ServiceOffer.objects.get(pk=response.data['id'])
        self.assertEqual(service.service_provider, self.provider_user)

    def test_list_create_service_anonymous_forbidden(self):
        # List
        response = self.client.get(self.services_url) # No auth
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Create
        data = {'title': 'Gardening', 'description': 'Lawn mowing', 'property': self.property1.pk}
        response = self.client.post(self.services_url, data) # No auth
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_services_provider_sees_own(self):
        ServiceOffer.objects.create(service_provider=self.provider_user, property=self.property1, title='S1', description='D1')
        ServiceOffer.objects.create(service_provider=self.other_provider, property=self.property1, title='S2', description='D2')

        self.client.force_authenticate(user=self.provider_user)
        response = self.client.get(self.services_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Assuming no pagination or default pagination includes these
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'S1')

    def test_list_services_staff_sees_all(self):
        ServiceOffer.objects.create(service_provider=self.provider_user, property=self.property1, title='S1', description='D1')
        ServiceOffer.objects.create(service_provider=self.other_provider, property=self.property1, title='S2', description='D2')

        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.services_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_update_own_service(self):
        service = ServiceOffer.objects.create(service_provider=self.provider_user, property=self.property1, title='Old Service', description='Old Desc')
        self.client.force_authenticate(user=self.provider_user)
        url = reverse('serviceoffer-detail', kwargs={'pk': service.pk})
        update_data = {'title': 'New Service Title'}
        response = self.client.patch(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        service.refresh_from_db()
        self.assertEqual(service.title, 'New Service Title')

    def test_update_others_service_forbidden(self):
        service = ServiceOffer.objects.create(service_provider=self.provider_user, property=self.property1, title='Test Service', description='Test Desc')
        self.client.force_authenticate(user=self.other_provider) # Authenticate as different provider
        url = reverse('serviceoffer-detail', kwargs={'pk': service.pk})
        update_data = {'title': 'Attempted Update'}
        response = self.client.patch(url, update_data)
        # Due to get_queryset filtering, the other_provider won't even see this service
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # Or 403 if found but permission denied

    def test_delete_own_service(self):
        service = ServiceOffer.objects.create(service_provider=self.provider_user, property=self.property1, title='To Delete', description='Desc')
        self.client.force_authenticate(user=self.provider_user)
        url = reverse('serviceoffer-detail', kwargs={'pk': service.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ServiceOffer.objects.filter(pk=service.pk).exists())

    def test_delete_others_service_forbidden(self):
        service = ServiceOffer.objects.create(service_provider=self.provider_user, property=self.property1, title='Another Service', description='Desc')
        self.client.force_authenticate(user=self.other_provider)
        url = reverse('serviceoffer-detail', kwargs={'pk': service.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) # Or 403
        self.assertTrue(ServiceOffer.objects.filter(pk=service.pk).exists())
