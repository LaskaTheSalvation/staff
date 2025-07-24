from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# API Router
router = DefaultRouter()
router.register(r'banner', views.BannerContentViewSet)
router.register(r'service', views.ServiceContentViewSet)
router.register(r'service-table', views.ServiceTableViewSet)
router.register(r'aboutus', views.AboutUsContentViewSet)
router.register(r'aboutus-picture', views.AboutUsPictureViewSet)
router.register(r'journey', views.JourneyContentViewSet)
router.register(r'pages', views.PageViewSet)

urlpatterns = [
    path("", views.index, name="index"),
    path("api/", include(router.urls)),
]
