import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.models import User

username = "testuser"
password = "test123"

if not User.objects.filter(username=username).exists():
    User.objects.create_user(
        username=username,
        password=password
    )
    print("User created successfully")
else:
    print("User already exists")