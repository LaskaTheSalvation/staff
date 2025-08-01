from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.paginator import Paginator
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import json

from .models import (
    User, Company, TeamMember, UserLog, Category, HomeContent, 
    AboutUs, Service, Contact, Project, ProjectGallery, Testimonial, 
    Client, News, Media, SocialMedia, Setting, ContentHistory
)
from .serializers import (
    CompanySerializer, UserSerializer, TeamMemberSerializer, UserLogSerializer,
    CategorySerializer, HomeContentSerializer, AboutUsSerializer, ServiceSerializer,
    ContactSerializer, ProjectSerializer, TestimonialSerializer, ClientSerializer,
    NewsSerializer, MediaSerializer, SocialMediaSerializer, SettingSerializer,
    ContentHistorySerializer, BannerContentSerializer, ServiceContentSerializer
)


def index(request):
    """Main index view"""
    return render(request, "index.html")


# ViewSets for REST API
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def staff(self, request):
        """Get all staff members"""
        staff_users = User.objects.filter(role='staff').select_related('company')
        serializer = self.get_serializer(staff_users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def admins(self, request):
        """Get all admin users"""
        admin_users = User.objects.filter(role='admin').select_related('company')
        serializer = self.get_serializer(admin_users, many=True)
        return Response(serializer.data)


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]


class UserLogViewSet(viewsets.ModelViewSet):
    queryset = UserLog.objects.all()
    serializer_class = UserLogSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = UserLog.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset.order_by('-created_at')


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class HomeContentViewSet(viewsets.ModelViewSet):
    queryset = HomeContent.objects.all()
    serializer_class = HomeContentSerializer
    permission_classes = [AllowAny]


class AboutUsViewSet(viewsets.ModelViewSet):
    queryset = AboutUs.objects.all()
    serializer_class = AboutUsSerializer
    permission_classes = [AllowAny]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects"""
        featured_projects = Project.objects.filter(featured=True)
        serializer = self.get_serializer(featured_projects, many=True)
        return Response(serializer.data)


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured testimonials"""
        featured_testimonials = Testimonial.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_testimonials, many=True)
        return Response(serializer.data)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured clients"""
        featured_clients = Client.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_clients, many=True)
        return Response(serializer.data)


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        """Get published news"""
        published_news = News.objects.filter(status='published').order_by('-published_at')
        serializer = self.get_serializer(published_news, many=True)
        return Response(serializer.data)


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [AllowAny]


class SocialMediaViewSet(viewsets.ModelViewSet):
    queryset = SocialMedia.objects.all()
    serializer_class = SocialMediaSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active social media links"""
        active_social = SocialMedia.objects.filter(is_active=True).order_by('display_order')
        serializer = self.get_serializer(active_social, many=True)
        return Response(serializer.data)


class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [AllowAny]


class ContentHistoryViewSet(viewsets.ModelViewSet):
    queryset = ContentHistory.objects.all()
    serializer_class = ContentHistorySerializer
    permission_classes = [AllowAny]


# Content Management API endpoints
@api_view(['GET', 'POST'])
def banner_content_api(request):
    """API for banner content management"""
    if request.method == 'GET':
        # Return banner content from HomeContent model
        try:
            home_content = HomeContent.objects.first()
            if home_content:
                data = {
                    'id': home_content.id,
                    'type': 'banner',
                    'title': home_content.title,
                    'description': home_content.description,
                    'image_path': home_content.image_path,
                }
                return Response(data)
            else:
                return Response({'message': 'No banner content found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    elif request.method == 'POST':
        # Create or update banner content
        try:
            data = request.data
            home_content, created = HomeContent.objects.get_or_create(
                company_id=data.get('company_id'),
                defaults={
                    'title': data.get('title'),
                    'description': data.get('description'),
                    'image_path': data.get('image_path'),
                }
            )
            if not created:
                home_content.title = data.get('title', home_content.title)
                home_content.description = data.get('description', home_content.description)
                home_content.image_path = data.get('image_path', home_content.image_path)
                home_content.save()
            
            serializer = HomeContentSerializer(home_content)
            return Response(serializer.data, status=201 if created else 200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


@api_view(['GET', 'POST'])
def service_content_api(request):
    """API for service content management"""
    if request.method == 'GET':
        # Return services
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Create new service
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'POST'])
def about_content_api(request):
    """API for about us content management"""
    if request.method == 'GET':
        # Return about us content
        try:
            about_us = AboutUs.objects.first()
            if about_us:
                serializer = AboutUsSerializer(about_us)
                return Response(serializer.data)
            else:
                return Response({'message': 'No about us content found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    elif request.method == 'POST':
        # Create or update about us content
        try:
            data = request.data
            about_us, created = AboutUs.objects.get_or_create(
                company_id=data.get('company_id'),
                defaults={
                    'description': data.get('description'),
                    'vision': data.get('vision'),
                    'mission': data.get('mission'),
                    'history': data.get('history'),
                }
            )
            if not created:
                about_us.description = data.get('description', about_us.description)
                about_us.vision = data.get('vision', about_us.vision)
                about_us.mission = data.get('mission', about_us.mission)
                about_us.history = data.get('history', about_us.history)
                about_us.save()
            
            serializer = AboutUsSerializer(about_us)
            return Response(serializer.data, status=201 if created else 200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


# Legacy API endpoints (maintained for backward compatibility)
def staff_list(request):
    """API endpoint to list all staff members"""
    staff_users = User.objects.filter(role='staff').select_related('company')
    
    # Pagination
    page_number = request.GET.get('page', 1)
    paginator = Paginator(staff_users, 10)
    page_obj = paginator.get_page(page_number)
    
    staff_data = []
    for user in page_obj:
        staff_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.get_full_name(),
            'company': user.company.name if user.company else None,
            'is_active': user.is_active,
            'profile_image': user.profile_image,
            'created_at': user.created_at.isoformat(),
            'last_login_at': user.last_login_at.isoformat() if user.last_login_at else None,
        })
    
    return JsonResponse({
        'staff': staff_data,
        'pagination': {
            'current_page': page_obj.number,
            'total_pages': paginator.num_pages,
            'total_count': paginator.count,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        }
    })


def staff_detail(request, staff_id):
    """API endpoint to get staff member details"""
    staff = get_object_or_404(User, id=staff_id, role='staff')
    
    # Get recent activity logs
    recent_logs = UserLog.objects.filter(user=staff).order_by('-created_at')[:10]
    
    staff_data = {
        'id': staff.id,
        'username': staff.username,
        'email': staff.email,
        'first_name': staff.first_name,
        'last_name': staff.last_name,
        'full_name': staff.get_full_name(),
        'company': {
            'id': staff.company.id,
            'name': staff.company.name,
        } if staff.company else None,
        'is_active': staff.is_active,
        'profile_image': staff.profile_image,
        'two_factor_enabled': staff.two_factor_enabled,
        'created_at': staff.created_at.isoformat(),
        'updated_at': staff.updated_at.isoformat(),
        'last_login_at': staff.last_login_at.isoformat() if staff.last_login_at else None,
        'recent_activity': [
            {
                'id': log.id,
                'activity': log.activity,
                'ip_address': log.ip_address,
                'created_at': log.created_at.isoformat(),
            } for log in recent_logs
        ]
    }
    
    return JsonResponse({'staff': staff_data})


def team_members_list(request):
    """API endpoint to list team members for public display"""
    team_members = TeamMember.objects.all().select_related('company')
    
    # Filter by company if specified
    company_id = request.GET.get('company_id')
    if company_id:
        team_members = team_members.filter(company_id=company_id)
    
    # Filter by management status if specified
    is_management = request.GET.get('is_management')
    if is_management is not None:
        team_members = team_members.filter(is_management=is_management.lower() == 'true')
    
    team_data = []
    for member in team_members:
        team_data.append({
            'id': member.id,
            'name': member.name,
            'position': member.position,
            'bio': member.bio,
            'image_path': member.image_path,
            'email': member.email,
            'linkedin_url': member.linkedin_url,
            'is_management': member.is_management,
            'company': member.company.name if member.company else None,
        })
    
    return JsonResponse({'team_members': team_data})


@csrf_exempt
@require_http_methods(["POST"])
def log_staff_activity(request):
    """API endpoint to log staff activity"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        activity = data.get('activity')
        
        if not user_id or not activity:
            return JsonResponse({'error': 'user_id and activity are required'}, status=400)
        
        staff = get_object_or_404(User, id=user_id, role='staff')
        
        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        
        # Create log entry
        log_entry = UserLog.objects.create(
            user=staff,
            activity=activity,
            ip_address=ip_address,
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return JsonResponse({
            'success': True,
            'log_id': log_entry.id,
            'message': 'Activity logged successfully'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
