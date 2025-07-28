from django.db import models
from django.utils import timezone

class Condominium(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    region = models.CharField(max_length=255)
    entries = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"

class Department(models.Model):
    condominium = models.ForeignKey(Condominium, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=255)
    tower = models.CharField(max_length=255)
    floor = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.condominium.name}"
