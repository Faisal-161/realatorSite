from rest_framework import serializers
from core.models.users import User # Updated import path and model name

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Updated model name
        fields = ['id', 'username', 'email', 'role']
        read_only_fields = ['role'] # Make role read-only
