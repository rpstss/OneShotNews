from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    avatar = models.TextField(null=True, blank=True)
    name = models.CharField(max_length=150, default="")
    is_host = models.BooleanField(default=False,)

