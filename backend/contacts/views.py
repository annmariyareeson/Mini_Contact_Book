from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer

    def get_permissions(self):
        # Anyone can view contacts
        if self.action == "list" or self.action == "retrieve":
            return [AllowAny()]

        # Login required for creating, editing and deleting
        return [IsAuthenticated()]

    def get_queryset(self):
        # Public contact list
        if self.action in ["list", "retrieve"]:
            return Contact.objects.all()

        # User's own contacts for protected operations
        return Contact.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)