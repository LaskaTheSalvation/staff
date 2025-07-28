from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # Staff API endpoints
    path("api/staff/", views.staff_list, name="staff_list"),
    path("api/staff/<int:staff_id>/", views.staff_detail, name="staff_detail"),
    path("api/team-members/", views.team_members_list, name="team_members_list"),
    path("api/staff/log-activity/", views.log_staff_activity, name="log_staff_activity"),
]
