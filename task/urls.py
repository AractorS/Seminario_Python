from rest_framework.routers import DefaultRouter
from .view import TaskViewSet, CategoryViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'comments', CommentViewSet, basename='comments')

urlpatterns = router.urls