from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        # Ensure the object has an 'owner' attribute.
        # This needs to be adapted if the owner field is named differently (e.g., 'user', 'author').
        if not hasattr(obj, 'owner'):
            # Fallback or raise error if 'owner' attribute doesn't exist.
            # For this generic class, we might deny permission if 'owner' is not present.
            # Or, if it's for a specific model, ensure 'owner' is the correct field.
            return False # Or handle appropriately

        return obj.owner == request.user


class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow the seller of a property listing to edit or delete it.
    Assumes the model instance has a `seller` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, OPTIONS).
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions (PUT, PATCH, DELETE) are only allowed if the request.user is the seller.
        # This check is for object-level permission.
        # Model instance `obj` is expected to be a PropertyListing instance.
        if not hasattr(obj, 'seller'):
            # This case should ideally not be reached if used with PropertyListingViewSet
            # which uses PropertyListing model that has a 'seller' field.
            return False

        return obj.seller == request.user
