from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'team-members', views.TeamMemberViewSet)
router.register(r'user-logs', views.UserLogViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'home-content', views.HomeContentViewSet)
router.register(r'about-us', views.AboutUsViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'testimonials', views.TestimonialViewSet)
router.register(r'clients', views.ClientViewSet)
router.register(r'news', views.NewsViewSet)
router.register(r'media', views.MediaViewSet)
router.register(r'social-media', views.SocialMediaViewSet)
router.register(r'settings', views.SettingViewSet)
router.register(r'content-history', views.ContentHistoryViewSet)
router.register(r'galleries', views.GalleryViewSet)

urlpatterns = [
    path("", views.index, name="index"),
    
    # REST API endpoints
    path("api/", include(router.urls)),
    
    # Content management API endpoints
    path("api/content/banner/", views.banner_content_api, name="banner_content_api"),
    path("api/content/services/", views.service_content_api, name="service_content_api"),
    path("api/content/about/", views.about_content_api, name="about_content_api"),
    
    # Legacy API endpoints (for backward compatibility)
    path("api/staff/", views.staff_list, name="staff_list"),
    path("api/staff/<int:staff_id>/", views.staff_detail, name="staff_detail"),
    path("api/team-members-legacy/", views.team_members_list, name="team_members_list"),
    path("api/staff/log-activity/", views.log_staff_activity, name="log_staff_activity"),
]
