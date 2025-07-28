from django.contrib import admin
from .models import (
    Company, User, TeamMember, UserLog, Category, HomeContent,
    AboutUs, Service, Contact, Project, ProjectGallery, 
    Testimonial, Client, News, Media, SocialMedia, Setting, ContentHistory
)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'company', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'company', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at', 'last_login_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'email', 'first_name', 'last_name')
        }),
        ('Company & Role', {
            'fields': ('company', 'role', 'is_active')
        }),
        ('Profile', {
            'fields': ('profile_image',)
        }),
        ('Security', {
            'fields': ('password_hash', 'two_factor_enabled', 'two_factor_secret'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('last_login_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """Only show staff users in admin"""
        qs = super().get_queryset(request)
        return qs.filter(role='staff')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'position', 'company', 'is_management', 'display_order', 'created_at')
    list_filter = ('is_management', 'company', 'created_at')
    search_fields = ('name', 'position', 'email')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'position', 'company', 'bio')
        }),
        ('Contact & Social', {
            'fields': ('email', 'linkedin_url')
        }),
        ('Display Settings', {
            'fields': ('image_path', 'display_order', 'is_management')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserLog)
class UserLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'activity_short', 'ip_address', 'created_at')
    list_filter = ('created_at', 'user__role')
    search_fields = ('user__username', 'activity', 'ip_address')
    readonly_fields = ('created_at',)
    
    def activity_short(self, obj):
        return obj.activity[:100] + '...' if len(obj.activity) > 100 else obj.activity
    activity_short.short_description = 'Activity'

    def get_queryset(self, request):
        """Only show logs for staff users"""
        qs = super().get_queryset(request)
        return qs.filter(user__role='staff')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'slug')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(HomeContent)
class HomeContentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'created_at')
    list_filter = ('company', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    list_display = ('id', 'company', 'created_at')
    list_filter = ('company', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'category', 'created_at')
    list_filter = ('company', 'category', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'company', 'email', 'phone', 'created_at')
    list_filter = ('company', 'created_at')
    search_fields = ('email', 'phone', 'address')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'client', 'status', 'featured', 'created_at')
    list_filter = ('company', 'status', 'featured', 'created_at')
    search_fields = ('title', 'client', 'location')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(ProjectGallery)
class ProjectGalleryAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'caption', 'display_order', 'created_at')
    list_filter = ('project', 'created_at')
    search_fields = ('caption', 'project__title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_name', 'client_company', 'company', 'rating', 'is_featured', 'created_at')
    list_filter = ('company', 'rating', 'is_featured', 'created_at')
    search_fields = ('client_name', 'client_company', 'testimonial_text')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'company', 'is_featured', 'display_order', 'created_at')
    list_filter = ('company', 'is_featured', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'author', 'status', 'published_at', 'created_at')
    list_filter = ('company', 'author', 'status', 'published_at', 'created_at')
    search_fields = ('title', 'content', 'excerpt')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('id', 'file_name', 'file_type', 'company', 'uploaded_by', 'created_at')
    list_filter = ('company', 'file_type', 'uploaded_by', 'created_at')
    search_fields = ('file_name', 'file_path')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ('id', 'platform', 'company', 'is_active', 'display_order', 'created_at')
    list_filter = ('company', 'platform', 'is_active', 'created_at')
    search_fields = ('platform', 'url')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('id', 'company', 'setting_key', 'created_at')
    list_filter = ('company', 'created_at')
    search_fields = ('setting_key', 'setting_value')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ContentHistory)
class ContentHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'table_name', 'record_id', 'action', 'created_at')
    list_filter = ('user', 'table_name', 'action', 'created_at')
    search_fields = ('user__username', 'table_name')
    readonly_fields = ('created_at',)
