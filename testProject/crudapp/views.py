from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Task
from .serializers import UserSerializer, TaskSerializer, RegistrationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class RegistrationAPIView(APIView):
    @swagger_auto_schema(operation_description="Register a new user.")
    @permission_classes([AllowAny])
    def post(self, request):
        request.data['username'] = request.data['email']
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully", "user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve a list of all users.")
    @permission_classes([IsAuthenticated])
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Create a new user.")
    @permission_classes([IsAuthenticated])
    def post(self, request):
        if request.user.is_superuser:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "User created successfully", "user": serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "You are not authorized to perform this action."}, status=status.HTTP_403_FORBIDDEN)

class TaskListAPIView(APIView):
    @swagger_auto_schema(operation_description="Retrieve a list of all tasks.")
    @permission_classes([IsAuthenticated])
    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    @swagger_auto_schema(operation_description="Create a new task.")
    @permission_classes([IsAuthenticated])
    def post(self, request):
        data = {
            'name': request.data.get('name'),
            'duedate': request.data.get('duedate'),
            'priority': request.data.get('priority'),
            'user': request.user.id 
        }
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task created successfully", "task": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Update a task.")
    @permission_classes([IsAuthenticated])
    def put(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            if task.user == request.user or request.user.is_superuser:
                serializer = TaskSerializer(task, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({"message": "Task updated successfully", "task": serializer.data}, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "You are not authorized to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(operation_description="Delete a task.")
    @permission_classes([IsAuthenticated])
    def delete(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            if task.user == request.user or request.user.is_superuser:
                task.delete()
                return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "You are not authorized to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
