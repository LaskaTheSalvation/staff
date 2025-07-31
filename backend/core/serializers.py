from rest_framework import serializers
from .models import (
    Company, User, TeamMember, UserLog, Category, HomeContent, 
    AboutUs, Service, Contact, Project, ProjectGallery, Testimonial, 
    Client, News, Media, SocialMedia, Setting, ContentHistory
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
    
    class Meta:
        model = Media
        fields = '__all__'


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