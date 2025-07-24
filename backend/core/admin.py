from django.contrib import admin
from .models import (
    BannerContent, ServiceContent, ServiceTable, 
    AboutUsContent, AboutUsPicture, JourneyContent, Page
)


class ServiceTableInline(admin.TabularInline):
    model = ServiceTable
    extra = 1


class AboutUsPictureInline(admin.TabularInline):
    model = AboutUsPicture
    extra = 1


@admin.register(BannerContent)
class BannerContentAdmin(admin.ModelAdmin):
    list_display = ('type', 'title', 'order', 'created_at')
    list_filter = ('type', 'created_at')
    ordering = ('order', 'created_at')
    search_fields = ('title', 'text')


@admin.register(ServiceContent)
class ServiceContentAdmin(admin.ModelAdmin):
    list_display = ('type', 'title', 'order', 'created_at')
    list_filter = ('type', 'created_at')
    ordering = ('order', 'created_at')
    search_fields = ('title', 'content')
    inlines = [ServiceTableInline]


@admin.register(AboutUsContent)
class AboutUsContentAdmin(admin.ModelAdmin):
    list_display = ('type', 'title', 'order', 'created_at')
    list_filter = ('type', 'created_at')
    ordering = ('order', 'created_at')
    search_fields = ('title', 'description')
    inlines = [AboutUsPictureInline]


@admin.register(JourneyContent)
class JourneyContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'order', 'created_at')
    list_filter = ('date', 'created_at')
    ordering = ('order', 'date')
    search_fields = ('title', 'description')


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'status', 'updated_at')
    list_filter = ('name', 'status', 'created_at')
    search_fields = ('title', 'content')
    prepopulated_fields = {'meta_description': ('title',)}
