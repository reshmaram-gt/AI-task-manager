from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils.html import escape
from .models import User, Task
from .serializers import UserSerializer, TaskSerializer, RegistrationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import openai
import json

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

class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def is_json(self, my_str):
        try:
            json.loads(my_str)
            return True
        except ValueError:
            return False

    def post(self, request):
        user_input = request.data.get('user_input')

        # Set up and invoke the ChatGPT model
        openai.api_key = 'OPEN_AI_KEY'
        response = None

        prompt_template = """You are a chatbot that is interacting with Django and REST API framework built to let users create, view and manage their tasks. Your response should only be a JSON object formatted as follows: 
        {
            "action": "create" | "view" | "update" | "delete",
            "task_details": {
            "name": "Task Name",
            "duedate": "YYYY-MM-DD HH:MM:SS",
            "priority": 1-10
            },
            "taskid": "Task ID (only for update or delete actions)"
        }
        If the user's desired action is to view their tasks, then return a JSON object like
        {
            "action": "view"
        }
        If the user wants to update or delete a particular task, the user has to specify the associated task id. If no task id, ask for it!
        For delete a task action, return a JSON object like,
        {
            "action": "delete",
            "taskid": "id"
        } 
        If user wants to create a new task, only return JSON object if the user has provided task name, duedate and priority. Here make sure you always return the right format for duedate YYYY-MM-DD HH:MM:SS.
        If the user input does not contain anything regarding the action, do not make up information. Reply 'What would you like to do today?'
        DO NOT CREATE YOUR OWN TASK DETAILS. Reply with 'Please provide task name, duedate in YYYY-MM-DD HH:MM:SS format and priority as a value between 1-10'
        If the user input has the action but does not contain anything regarding the task details, DO NOT CREATE YOUR OWN TASK DETAILS. 
        Do not make up information at any step regarding the task details, only generate the JSON object if the user has specified all details explicitly."""

        # Generate response based on the selected prompt template
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # GPT-3.5 engine
            messages=[{'role': 'user', 'content': user_input}, {'role': 'assistant', 'content': prompt_template}],
            max_tokens=150
        )

        # Extract chatbot reply from the response
        chatbot_reply = response.choices[0].message.content if response else "Sorry, I couldn't understand your request."
        if self.is_json(chatbot_reply):
            action = (json.loads(chatbot_reply)["action"])
            if action == "view":
                tasks = Task.objects.filter(user=request.user)
                serializer = TaskSerializer(tasks, many=True)
                tasks = serializer.data
                chatbot_reply = f"Here are your tasks: {tasks}"
            if action == "delete":
                task_id = json.loads(chatbot_reply)["taskid"]
                try:
                    task = Task.objects.get(pk=task_id, user=request.user)
                    task.delete()
                    chatbot_reply = f"Task {task_id} deleted successfuly!"
                except Task.DoesNotExist:
                    chatbot_reply = f"Task {task_id} does not exist or you are not authorized to delete it!"
            if action == "create":
                data = {
                    'name': json.loads(chatbot_reply)["task_details"]["name"],
                    'duedate': json.loads(chatbot_reply)["task_details"]["duedate"],
                    'priority': json.loads(chatbot_reply)["task_details"]["priority"],
                    'user': request.user.id 
                }
                serializer = TaskSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    chatbot_reply = ("Task created successfully!")
            if action == "update":
                data = {
                    'name': json.loads(chatbot_reply)["task_details"]["name"],
                    'duedate': json.loads(chatbot_reply)["task_details"]["duedate"],
                    'priority': json.loads(chatbot_reply)["task_details"]["priority"],
                    'user': request.user.id 
                }
                task_id = json.loads(chatbot_reply)["taskid"]
                try:
                    task = Task.objects.get(pk=task_id)
                    if task.user == request.user or request.user.is_superuser:
                        serializer = TaskSerializer(task, data=data, partial=True)
                        if serializer.is_valid():
                            serializer.save()
                            chatbot_reply = ("Task updated successfully!")
                except Task.DoesNotExist:
                    chatbot_reply = f"Task {task_id} does not exist or you are not authorized to edit it!"
        else:
            chatbot_reply = "Please provide more details!"

        return Response({'chatbot_reply': chatbot_reply}, status=status.HTTP_200_OK)
