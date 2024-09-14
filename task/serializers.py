from rest_framework import serializers
from .models import Task, Category, Comment

class CommentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')  # Solo lectura del propietario del comentario

    class Meta:
        model = Comment
        fields = ['id', 'task', 'owner', 'content', 'created_at']  # Campos a incluir en el serializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']  # Campos a incluir en el serializer


class TaskSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)  # Relacionar comentarios con la tarea
    owner = serializers.ReadOnlyField(source='owner.username')  # Solo lectura del propietario de la tarea
    category = CategorySerializer(read_only=True)  # Solo lectura de la categoría

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'category', 'owner', 'comments']  # Campos a incluir en el serializer