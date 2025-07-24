from django.db import models
from django.contrib.auth.models import User


class BannerContent(models.Model):
    """Model for banner section content"""
    CONTENT_TYPES = [
        ('banner_image', 'Upload Banner'),
        ('title', 'Title'),
        ('text', 'Text'),
        ('button_link', 'Button Link'),
    ]
    
    type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200, blank=True)
    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='banners/', blank=True, null=True)
    button_text = models.CharField(max_length=100, blank=True)
    button_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        
    def __str__(self):
        return f"{self.get_type_display()} - {self.title or 'No Title'}"


class ServiceContent(models.Model):
    """Model for service section content"""
    CONTENT_TYPES = [
        ('title', 'Title'),
        ('content', 'Content'),
        ('table', 'Table'),
    ]
    
    type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        
    def __str__(self):
        return f"{self.get_type_display()} - {self.title or 'No Title'}"


class ServiceTable(models.Model):
    """Model for service table rows"""
    service_content = models.ForeignKey(ServiceContent, on_delete=models.CASCADE, related_name='table_rows')
    nama = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.nama} - {self.title}"


class AboutUsContent(models.Model):
    """Model for about us section content"""
    CONTENT_TYPES = [
        ('title', 'Title'),
        ('picture', 'Picture'),
        ('description', 'Description'),
    ]
    
    type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        
    def __str__(self):
        return f"{self.get_type_display()} - {self.title or 'No Title'}"


class AboutUsPicture(models.Model):
    """Model for about us picture rows"""
    aboutus_content = models.ForeignKey(AboutUsContent, on_delete=models.CASCADE, related_name='picture_rows')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='aboutus/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.title}"


class JourneyContent(models.Model):
    """Model for our journey section content"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField(blank=True, null=True)
    image = models.ImageField(upload_to='journey/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'date']
        
    def __str__(self):
        return self.title


class Page(models.Model):
    """Model for general pages like Contact, Media, etc."""
    PAGES = [
        ('contact', 'Contact'),
        ('media', 'Media'),
        ('service', 'Service'),
        ('about-us', 'About Us'),
        ('home', 'Home'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    name = models.CharField(max_length=50, choices=PAGES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    meta_description = models.CharField(max_length=160, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.get_name_display()
