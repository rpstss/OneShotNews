from django.urls import path
from . import views
urlpatterns = [
    path("kr", views.KorNewsview.as_view()),
    path("image", views.Imageview.as_view()),
    path("en", views.EngNewsview.as_view()),
    path("make-error", views.makeError),
]