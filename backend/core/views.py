from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.paginator import Paginator
import json
from .models import User, Company, TeamMember, UserLog


def index(request):
    """Main index view"""
    return render(request, "index.html")


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
