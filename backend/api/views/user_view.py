
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from core.models.users import User # Correct path to the User model
from backend.api.serializers.users_serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # Apply IsAuthenticatedOrReadOnly by default, but specific actions can override
    permission_classes = [IsAuthenticatedOrReadOnly] 

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
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