from rest_framework import serializers
from .models import User, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'duedate', 'priority', 'user']

class UserSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, required=False)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', "tasks"]

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', "username"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user