from rest_framework import serializers
from .models import (
    Company, User, TeamMember, UserLog, Category, HomeContent, 
    AboutUs, Service, Contact, Project, ProjectGallery, Testimonial, 
    Client, News, Media, SocialMedia, Setting, ContentHistory, Gallery, GalleryItem
)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'profile_image', 'role', 'is_active', 'two_factor_enabled',
            'last_login_at', 'created_at', 'updated_at', 'company', 'company_name'
        ]
        extra_kwargs = {
            'password_hash': {'write_only': True}
        }


class TeamMemberSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = '__all__'


class UserLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserLog
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class HomeContentSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = HomeContent
        fields = '__all__'


class AboutUsSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = AboutUs
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Service
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Contact
        fields = '__all__'


class ProjectGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectGallery
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    gallery_images = ProjectGallerySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = News
        fields = '__all__'


class MediaSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    thumbnail_urls = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Media
        fields = [
            'id', 'company', 'company_name', 'file', 'file_name', 'file_path',
            'file_type', 'file_size', 'mime_type', 'title', 'alt_text', 'description',
            'width', 'height', 'thumbnail_small', 'thumbnail_medium', 'thumbnail_large',
            'uploaded_by', 'uploaded_by_name', 'created_at', 'updated_at',
            'file_url', 'thumbnail_urls', 'display_name'
        ]
        read_only_fields = ['file_size', 'mime_type', 'width', 'height', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        """Get the URL for the main file"""
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return obj.file_path  # Fallback for legacy entries
    
    def get_thumbnail_urls(self, obj):
        """Get URLs for all thumbnail sizes"""
        request = self.context.get('request')
        thumbnails = {}
        
        if obj.is_image():
            for size in ['small', 'medium', 'large']:
                thumbnail_field = getattr(obj, f'thumbnail_{size}')
                if thumbnail_field and hasattr(thumbnail_field, 'url'):
                    url = thumbnail_field.url
                    if request:
                        url = request.build_absolute_uri(url)
                    thumbnails[size] = url
                else:
                    # Fallback to main file
                    thumbnails[size] = self.get_file_url(obj)
        
        return thumbnails
    
    def get_display_name(self, obj):
        """Get display name for the media"""
        return obj.get_display_name()


class MediaUploadSerializer(serializers.ModelSerializer):
    """Serializer specifically for file uploads"""
    file = serializers.FileField(required=True)
    
    class Meta:
        model = Media
        fields = ['file', 'title', 'alt_text', 'description', 'company']
    
    def validate_file(self, value):
        """Validate uploaded file"""
        from .utils import validate_file_upload
        
        errors = validate_file_upload(value)
        if errors:
            raise serializers.ValidationError(errors)
        return value
    
    def create(self, validated_data):
        """Create media instance with file processing"""
        from .utils import process_media_file
        
        uploaded_file = validated_data['file']
        
        # Create media instance
        media = Media(**validated_data)
        
        # Process the file and create thumbnails
        media = process_media_file(media, uploaded_file)
        
        # Save the instance
        media.save()
        
        return media


class SocialMediaSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = SocialMedia
        fields = '__all__'


class SettingSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Setting
        fields = '__all__'


class ContentHistorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ContentHistory
        fields = '__all__'


class GalleryItemSerializer(serializers.ModelSerializer):
    media_info = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryItem
        fields = '__all__'
    
    def get_media_info(self, obj):
        """Include basic media information"""
        if obj.media:
            return {
                'id': obj.media.id,
                'file_name': obj.media.file_name,
                'file_url': obj.media.get_file_url(),
                'thumbnail_url': obj.media.get_thumbnail_url(),
                'title': obj.media.title,
                'alt_text': obj.media.alt_text
            }
        return None


class GallerySerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    items = GalleryItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Gallery
        fields = '__all__'
    
    def get_items_count(self, obj):
        """Get count of items in this gallery"""
        return obj.items.count()


# Special serializers for content management
class BannerContentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    type = serializers.CharField(max_length=100)
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)
    text = serializers.CharField(required=False, allow_blank=True)
    image_path = serializers.CharField(max_length=255, required=False, allow_blank=True)
    button_text = serializers.CharField(max_length=100, required=False, allow_blank=True)
    button_link = serializers.URLField(required=False, allow_blank=True)
    display_order = serializers.IntegerField(default=0)


class ServiceContentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    rows = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )