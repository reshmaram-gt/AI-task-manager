# urls.py
from django.urls import path
from .views import UserListAPIView, TaskListAPIView, RegistrationAPIView

urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('tasks/', TaskListAPIView.as_view(), name='task-list'),
    path('register/', RegistrationAPIView.as_view(), name='registration'),
    path('tasks/<int:pk>/', TaskListAPIView.as_view(), name='task-edit'),
    path('tasks/<int:pk>/', TaskListAPIView.as_view(), name='task-delete')
]