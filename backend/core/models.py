from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class User(models.Model):
    """Custom user model matching the migration structure"""
    ROLE_ADMIN = "admin"
    ROLE_STAFF = "staff"
    ROLE_CHOICES = [
        (ROLE_ADMIN, _("Admin")),
        (ROLE_STAFF, _("Staff")),
    ]

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_STAFF)
    is_active = models.BooleanField(default=True)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=255, blank=True, null=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    company = models.ForeignKey(
        "Company", on_delete=models.CASCADE,
        null=True, blank=True, related_name="users"
    )

    class Meta:
        ordering = ["username"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
        
    def get_role_display(self):
        return dict(self.ROLE_CHOICES).get(self.role, self.role)

class Company(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    logo_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name


class User(models.Model):
    """User model matching the users table from the SQL schema, focused on staff"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='staff')
    is_active = models.BooleanField(default=True)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=255, blank=True, null=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['username']

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    def get_full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username


class TeamMember(models.Model):
    """Team member model matching the team_members table, for staff display"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_management = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} - {self.position}"


class UserLog(models.Model):
    """User log model matching the user_logs table for staff activity tracking"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.activity[:50]}..."


class Category(models.Model):
    """Category model matching the categories table from the SQL schema"""
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class HomeContent(models.Model):
    """Home content model matching the home_contents table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Home Contents"

    def __str__(self):
        return self.title or f"Home Content {self.id}"


class AboutUs(models.Model):
    """About us model matching the about_us table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    vision = models.TextField(blank=True, null=True)
    mission = models.TextField(blank=True, null=True)
    history = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "About Us"

    def __str__(self):
        return f"About Us - {self.company.name if self.company else 'No Company'}"


class Service(models.Model):
    """Service model matching the services table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title or f"Service {self.id}"


class Contact(models.Model):
    """Contact model matching the contacts table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    map_url = models.URLField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    contact_form_email = models.EmailField(blank=True, null=True)
    contact_form_recipients = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Contact - {self.company.name if self.company else 'No Company'}"


class Project(models.Model):
    """Project model matching the projects table from the SQL schema"""
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('planned', 'Planned'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    short_description = models.CharField(max_length=500, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    client = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ongoing')
    featured = models.BooleanField(default=False)
    thumbnail_path = models.CharField(max_length=255, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ProjectGallery(models.Model):
    """Project gallery model matching the project_gallery table from the SQL schema"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='gallery_images')
    image_path = models.CharField(max_length=255)
    caption = models.CharField(max_length=255, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Project Galleries"
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.project.title} - Image {self.display_order}"


class Testimonial(models.Model):
    """Testimonial model matching the testimonials table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    client_name = models.CharField(max_length=255)
    client_position = models.CharField(max_length=255, blank=True, null=True)
    client_company = models.CharField(max_length=255, blank=True, null=True)
    testimonial_text = models.TextField()
    image_path = models.CharField(max_length=255, blank=True, null=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client_name} - {self.client_company or 'Testimonial'}"


class Client(models.Model):
    """Client model matching the clients table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    logo_path = models.CharField(max_length=255, blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class News(models.Model):
    """News model matching the news table from the SQL schema"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    excerpt = models.CharField(max_length=500, blank=True, null=True)
    featured_image = models.CharField(max_length=255, blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "News"
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title


class Media(models.Model):
    """Enhanced media model for file uploads with thumbnail and metadata support"""
    
    # File type choices
    TYPE_IMAGE = 'image'
    TYPE_DOCUMENT = 'document'
    TYPE_VIDEO = 'video'
    TYPE_AUDIO = 'audio'
    TYPE_CHOICES = [
        (TYPE_IMAGE, 'Image'),
        (TYPE_DOCUMENT, 'Document'),
        (TYPE_VIDEO, 'Video'),
        (TYPE_AUDIO, 'Audio'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    
    # Original file information
    file = models.FileField(upload_to='uploads/%Y/%m/', blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    file_path = models.CharField(max_length=255, blank=True, null=True)  # For backward compatibility
    file_type = models.CharField(max_length=50, choices=TYPE_CHOICES, blank=True, null=True)
    file_size = models.BigIntegerField(null=True, blank=True)  # Size in bytes
    mime_type = models.CharField(max_length=100, blank=True, null=True)
    
    # Metadata
    title = models.CharField(max_length=255, blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True, help_text="Alternative text for accessibility")
    description = models.TextField(blank=True, null=True)
    
    # Image-specific fields
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    
    # Thumbnails (for images)
    thumbnail_small = models.FileField(upload_to='thumbnails/small/%Y/%m/', blank=True, null=True)
    thumbnail_medium = models.FileField(upload_to='thumbnails/medium/%Y/%m/', blank=True, null=True)
    thumbnail_large = models.FileField(upload_to='thumbnails/large/%Y/%m/', blank=True, null=True)
    
    # Metadata
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Media"
        ordering = ['-created_at']

    def __str__(self):
        return self.title or self.file_name or f"Media {self.id}"
    
    def get_file_url(self):
        """Get the URL for the main file"""
        if self.file:
            return self.file.url
        return self.file_path  # Fallback for legacy entries
    
    def get_thumbnail_url(self, size='medium'):
        """Get thumbnail URL for specified size"""
        thumbnail_field = getattr(self, f'thumbnail_{size}', None)
        if thumbnail_field and thumbnail_field.name:
            return thumbnail_field.url
        return self.get_file_url()  # Fallback to original file
    
    def is_image(self):
        """Check if the media file is an image"""
        return self.file_type == self.TYPE_IMAGE
    
    def get_display_name(self):
        """Get display name for the media"""
        return self.title or self.file_name or f"Untitled Media {self.id}"


class SocialMedia(models.Model):
    """Social media model matching the social_media table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    platform = models.CharField(max_length=50)
    url = models.URLField()
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Social Media"
        ordering = ['display_order', 'platform']

    def __str__(self):
        return f"{self.platform} - {self.company.name if self.company else 'No Company'}"


class Setting(models.Model):
    """Setting model matching the settings table from the SQL schema"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    setting_key = models.CharField(max_length=255)
    setting_value = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['company', 'setting_key']
        ordering = ['company', 'setting_key']

    def __str__(self):
        return f"{self.setting_key} - {self.company.name if self.company else 'Global'}"


class Gallery(models.Model):
    """Gallery model for curated gallery content"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Galleries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.company.name if self.company else 'No Company'}"


class GalleryItem(models.Model):
    """Gallery item model for individual items in a gallery"""
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='items')
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    ordering = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ordering', 'created_at']

    def __str__(self):
        return f"{self.gallery.name} - {self.title or self.name or f'Item {self.id}'}"


class ContentHistory(models.Model):
    """Content history model matching the content_histories table from the SQL schema"""
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    table_name = models.CharField(max_length=100)
    record_id = models.PositiveIntegerField()
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    changed_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Content Histories"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.action} {self.table_name}#{self.record_id}"
