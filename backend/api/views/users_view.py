
from rest_framework import viewsets, status, permissions # Added permissions
from rest_framework.decorators import action
from rest_framework.response import Response
# Removed IsAuthenticated, IsAuthenticatedOrReadOnly as they will be handled by get_permissions
from core.models.users import User # Correct path to the User model
from ..serializers.users_serializer import UserSerializer  # Correct path to the UserSerializer

# Custom Permission: IsAdminOrIsSelf
class IsAdminOrIsSelf(permissions.BasePermission):
    """
    Allows access only to admin users or to the user themselves.
    """
    def has_object_permission(self, request, view, obj):
        # Admin users have access to all objects
        if request.user and request.user.is_staff:
            return True
        # Non-admin users can only access their own information
        return obj == request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes are now set dynamically by get_permissions

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [permissions.AllowAny]
        elif self.action == 'list':
            self.permission_classes = [permissions.IsAdminUser]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminOrIsSelf]
        else:
            # Default to deny access if action not specified, or use a default like IsAuthenticated
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated]) # Ensure 'me' uses IsAuthenticated
    def me(self, request):
        """
        Return the authenticated user's data.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Potentially adjust default permissions based on action for production
    # For example, list might be IsAdminUser, create might be AllowAny (for registration)
    # For now, IsAuthenticatedOrReadOnly is a general setting.
    # Individual methods like create, update, destroy can also have their permissions checked
    # or overridden if needed. The `me` action explicitly uses IsAuthenticated.
    
    # Example: To make create action (registration) open to anyone if not using djoser or similar
    # def get_permissions(self):
    #     if self.action == 'create':
    #         return [permissions.AllowAny()]
    #     return super().get_permissions()

    # Common practice for UserViewSet:
    # - List: Admin only (e.g., IsAdminUser)
    # - Retrieve: Admin or self (custom permission class)
    # - Create: AllowAny (for registration) or Admin
    # - Update/Delete: Admin or self (custom permission class)
    # The current IsAuthenticatedOrReadOnly allows listing by anyone, which might be too permissive.
    # This will be addressed if specific permission requirements are given later.