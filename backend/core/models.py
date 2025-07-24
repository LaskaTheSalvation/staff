from django.db import models
from django.contrib.auth.models import User


class Department(models.Model):
    """Model for managing departments in the organization."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Employee(models.Model):
    """Model for managing employee information."""
    EMPLOYMENT_STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('TERMINATED', 'Terminated'),
        ('ON_LEAVE', 'On Leave'),
    ]

    # Basic Information
    employee_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    # Work Information
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    position = models.CharField(max_length=100)
    hire_date = models.DateField()
    employment_status = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_STATUS_CHOICES,
        default='ACTIVE'
    )
    
    # Optional user account link
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
