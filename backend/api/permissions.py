from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    Assumes the model instance has a `seller` attribute.
    Read-only access is allowed for any request.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the seller of the listing or admin users.
        # Ensure the object has a 'seller' attribute.
        if not hasattr(obj, 'seller'):
            # Fallback or raise error if 'seller' attribute is expected but not found.
            # For now, deny permission if attribute is missing, to be safe.
            return False

        return obj.seller == request.user or (request.user and request.user.is_staff)
