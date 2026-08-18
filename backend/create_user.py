import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.models import User

username = "testuser"
password = "Testuser@123"

user, created = User.objects.get_or_create(username=username)

user.set_password(password)
user.is_active = True
user.save()

if created:
    print("User created successfully")
else:
    print("User password reset successfully")