from django.contrib import admin
from .models import Company, User, TeamMember, UserLog


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
