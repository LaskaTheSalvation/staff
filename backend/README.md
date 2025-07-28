# Staff Management Backend

Backend Django application for managing staff members of PT. BUMI KARTANEGARA.

## Features

- Staff user management with role-based access
- Company information management
- Team member profiles for public display
- Activity logging system
- REST API endpoints for staff operations
- Django admin interface for staff management

## Models

### Company
- Company information (name, description, contact details)
- Logo and branding information

### User (Staff)
- Staff user accounts with authentication
- Role-based access (admin/staff)
- Company association
- Two-factor authentication support
- Profile information

### TeamMember
- Public team member profiles
- Position and bio information
- Management level designation
- Contact and social media links

### UserLog
- Activity tracking for staff members
- IP address and user agent logging
- Timestamped activity records

## API Endpoints

### Staff Management
- `GET /api/staff/` - List all staff members (paginated)
- `GET /api/staff/<id>/` - Get staff member details with activity logs
- `POST /api/staff/log-activity/` - Log staff activity

### Team Members
- `GET /api/team-members/` - List team members for public display
- Supports filtering by company and management status

## Setup

1. Install dependencies:
   ```bash
   pip install django
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create sample data:
   ```bash
   python manage.py create_staff_data
   ```

4. Create superuser for admin access:
   ```bash
   python manage.py createsuperuser
   ```

5. Run development server:
   ```bash
   python manage.py runserver
   ```

## Admin Interface

Access the Django admin at `/admin/` to manage:
- Staff users (filtered to show only staff role)
- Company information
- Team member profiles
- Activity logs

## Database Schema

The models are designed to match the SQL schema in `bumi_kartanegara.sql`, focusing specifically on staff-related functionality as requested.

## Usage Examples

### Get staff list:
```bash
curl http://localhost:8000/api/staff/
```

### Get staff details:
```bash
curl http://localhost:8000/api/staff/1/
```

### Log staff activity:
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"user_id": 1, "activity": "Completed training"}' \
     http://localhost:8000/api/staff/log-activity/
```

### Get team members:
```bash
curl http://localhost:8000/api/team-members/
```