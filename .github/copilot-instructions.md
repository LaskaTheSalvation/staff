# Staff Management System
A full-stack staff management application built with React (frontend) and Django (backend) for PT. BUMI KARTANEGARA. The system provides staff management, team member profiles, activity logging, and a comprehensive REST API.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
1. **Install Python dependencies** (takes ~30 seconds):
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup Django backend** (takes ~15 seconds):
   ```bash
   cd backend
   python manage.py migrate
   python manage.py create_staff_data
   ```

3. **Install Node.js dependencies** (takes ~10 seconds for existing install, 30 seconds for fresh):
   ```bash
   npm install
   ```

### Build and Development
4. **Build frontend** (takes ~4 seconds. NEVER CANCEL - Set timeout to 60+ seconds):
   ```bash
   npm run build
   ```

5. **Start development servers**:
   - **Backend server** (Django API):
     ```bash
     cd backend
     python manage.py runserver 0.0.0.0:8000
     ```
   - **Frontend server** (React + Vite):
     ```bash
     npm run dev
     ```

### URLs and Access
- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

## Database Configuration

### SQLite (Default - Development)
- The application runs with SQLite by default for development
- Database file: `backend/db.sqlite3`
- No additional setup required

### MySQL (Production)
1. **Install MySQL server**
2. **Create database**:
   ```bash
   mysql -u root -p -e "CREATE DATABASE bumi_kartanegara;"
   mysql -u root -p bumi_kartanegara < bumi_kartanegara.sql
   ```
3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```
4. **Update `backend/backend/settings.py`** - uncomment MySQL configuration and comment SQLite

## Testing and Validation

### Backend API Testing
- **Test all endpoints** (takes ~5 seconds):
  ```bash
  python test_api_endpoints.py
  ```
- **Create superuser for admin access**:
  ```bash
  cd backend
  python manage.py createsuperuser
  ```

### Manual Validation Scenarios
After making changes, ALWAYS test these scenarios:

1. **Backend API validation**:
   - Run `python test_api_endpoints.py` and verify all 17 endpoints return 200 status
   - Test staff data: `curl http://localhost:8000/api/users/`
   - Test team members: `curl http://localhost:8000/api/team-members/`

2. **Frontend validation**:
   - Access http://localhost:5173/ and verify the "Halaman Landing Page Publik" loads
   - Verify no console errors in browser developer tools

3. **Full application flow**:
   - Start both servers (backend on :8000, frontend on :5173)
   - Create a superuser account
   - Access admin interface at http://localhost:8000/admin/
   - Verify you can log in and manage staff/team members

### Linting and Code Quality
- **ESLint** (has known issues with generated files):
  ```bash
  npm run lint
  ```
  Note: ESLint will show errors in `backend/static/` files and some unused variables. These are non-critical for development.

## Architecture Overview

### Frontend Structure
- **Location**: Root directory and `/frontend` (dual structure)
- **Technology**: React 19.1.0 + Vite 7.0.3 + TailwindCSS 4.1.11 + Material-UI 7.2.0
- **Key directories**:
  - `src/Pages/staff/` - Staff interface pages
  - `src/Pages/admin/` - Admin interface pages
  - `src/Pages/login/` - Authentication pages
  - `src/components/` - Reusable components

### Backend Structure
- **Location**: `/backend` directory
- **Technology**: Django 5.2.5 + Django REST Framework 3.16.1
- **Key directories**:
  - `core/` - Main application with models, views, serializers
  - `core/management/commands/` - Custom Django commands
  - `backend/` - Django project settings

### API Endpoints
All endpoints are available under `/api/`:
- `/api/companies/` - Company management
- `/api/users/` - Staff user management (17 available endpoints total)
- `/api/team-members/` - Public team member profiles
- `/api/media/` - Media file management
- See `test_api_endpoints.py` for complete list

## Common Issues and Solutions

### Build Issues
- **"Module not found" errors**: Run `npm install` in both root and `/frontend` directories
- **Django import errors**: Ensure `pip install -r requirements.txt` completed successfully
- **Database errors**: Run `python manage.py migrate` in `/backend` directory

### Development Server Issues
- **Port conflicts**: Backend uses :8000, frontend uses :5173
- **CORS errors**: Django CORS headers are configured in settings
- **API not responding**: Ensure backend server is running on port 8000

### Performance Notes
- **Frontend build**: ~4 seconds (fast builds)
- **Dependency installation**: ~30 seconds for fresh install
- **Database migrations**: ~15 seconds
- **Build artifact size**: ~615KB JS bundle (considered large, optimization recommended)

## Project Features

### Staff Management
- User authentication and role-based access (admin/staff)
- Activity logging with IP tracking
- Company association and profile management
- Two-factor authentication support (planned)

### Team Member Profiles
- Public-facing team member directory
- Position and bio information
- Management level designation
- Contact and social media integration

### Media Management
- File upload with validation
- Automatic thumbnail generation
- Support for images, documents, and other media types
- RESTful API for media operations

## Development Environment
- **Python**: 3.12.3
- **Node.js**: 20.19.4  
- **npm**: 10.8.2
- **Database**: SQLite (development) / MySQL (production)
- **OS**: Ubuntu/Linux environment expected

## Key Files Reference
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies (root level)
- `frontend/package.json` - Frontend-specific dependencies  
- `.env.example` - Environment configuration template
- `bumi_kartanegara.sql` - MySQL database schema
- `backend/backend/settings.py` - Django configuration
- `test_api_endpoints.py` - API testing script