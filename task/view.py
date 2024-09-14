from rest_framework import viewsets
from .models import Task, Category, Comment
from .serializers import TaskSerializer, CategorySerializer, CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['completed', 'category']  # Filtrar por estado y categoría
    search_fields = ['title']  # Permitir buscar por título
    ordering_fields = ['created_at', 'completed']  # Ordenar por fecha de creación y estado

    def get_queryset(self):
        return self.queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer