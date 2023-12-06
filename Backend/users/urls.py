from django.urls import path
from . import views

urlpatterns=[#Json형식으로 정보를 보내거나 가져올 djangoframework url들
    path("", views.Users.as_view()),
    path("me",views.Me.as_view()),
    path("change-password",views.ChangePassword.as_view()),
    path("log-in", views.LogIn.as_view()),
    path("log-out", views.LogOut.as_view()),
    path("kakao", views.KakaoLogIn.as_view()),
    path("signup", views.Signup.as_view()),
    path("@<str:username>", views.PublicUser.as_view()),
]