from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, related_name='categories', on_delete=models.CASCADE)

    def _str_(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    # owner = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE, null=True, blank=True)  # Permite null
    category = models.ForeignKey(Category, related_name='tasks', on_delete=models.SET_NULL, null=True, blank=True)

    def clean(self):
        if not self.title:
            raise ValidationError("El título no puede estar vacío.")
        if len(self.title) < 3:
            raise ValidationError("El título debe tener al menos 3 caracteres.")

    def __str__(self):
        return self.title

class Comment(models.Model):
        task = models.ForeignKey(Task, related_name='comments', on_delete=models.CASCADE)
        owner = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
        content = models.TextField()
        created_at = models.DateTimeField(auto_now_add=True)

        def _str_(self):
             return f"Comentario de {self.owner.username} en {self.task.title}"