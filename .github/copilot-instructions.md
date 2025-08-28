# Staff Management System

A full-stack web application built with Django (backend) and React (frontend) for managing staff and company information for PT. BUMI KARTANEGARA.

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test the Repository

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   Takes ~1 second (if already installed) to 2 minutes (fresh install). NEVER CANCEL. Set timeout to 180+ seconds.

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   Takes ~3-10 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

3. **Setup Django database:**
   ```bash
   cd backend && python manage.py migrate
   ```
   Takes ~1 second. NEVER CANCEL. Set timeout to 60+ seconds.

4. **Create sample data:**
   ```bash
   cd backend && python manage.py create_staff_data
   ```
   Takes ~0.5 seconds. Creates staff users and team members for testing.

5. **Build frontend:**
   ```bash
   npm run build
   ```
   Takes ~3-4 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

### Run the Application

1. **Backend server:**
   ```bash
   cd backend && python manage.py runserver
   ```
   Starts immediately at http://127.0.0.1:8000/

2. **Frontend development server:**
   ```bash
   npm run dev
   ```
   Starts immediately at http://localhost:5173/

3. **Frontend preview (built version):**
   ```bash
   npm run preview
   ```

## Validation

### ALWAYS Run These Validation Steps

1. **Test all API endpoints:**
   ```bash
   python test_api_endpoints.py
   ```
   Takes ~0.2 seconds. Tests 17 endpoints. All should return ✅ status.
   **Note:** Backend server must be running at http://127.0.0.1:8000/ for this test to work.

2. **Manual backend validation:**
   ```bash
   curl http://127.0.0.1:8000/api/staff/
   ```
   Should return JSON with staff members.

3. **Manual frontend validation:**
   ```bash
   curl http://localhost:5173/
   ```
   Should return HTML with `<title>staff</title>`.

### Complete User Scenarios

**CRITICAL**: After making changes, ALWAYS test these complete workflows:

1. **Staff Management Workflow:**
   - Start both backend and frontend servers
   - Access frontend at http://localhost:5173/
   - Navigate to staff management section
   - Verify staff data loads from API
   - Test staff details view by clicking on a staff member

2. **API Integration Workflow:**
   - Test staff endpoint: `curl http://127.0.0.1:8000/api/staff/`
   - Test team members: `curl http://127.0.0.1:8000/api/team-members/`
   - Test company info: `curl http://127.0.0.1:8000/api/companies/`
   - Verify data matches frontend display

### Linting and Code Quality

**ALWAYS run before committing:**
```bash
npm run lint
```
Takes ~2-3 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

**Note:** ESLint currently shows errors in built files (`backend/static/`) and some source files. These are non-blocking but should be addressed:
- Built files should be ignored in ESLint config
- Source file errors are mostly unused variables

## Database Configuration

### Development (Default)
- Uses SQLite (`backend/db.sqlite3`)
- No additional setup required
- Sample data created via `python manage.py create_staff_data`

### Production (MySQL)
1. Install MySQL server
2. Create database: `bumi_kartanegara`
3. Import schema: `mysql -u root -p bumi_kartanegara < bumi_kartanegara.sql`
4. Copy `.env.example` to `.env` and configure MySQL credentials
5. Update `backend/backend/settings.py` to use MySQL configuration (commented out by default)

## Key Projects in This Codebase

### Backend (`backend/`)
- **Django REST API** with 17 endpoints
- **Staff Management**: User accounts, authentication, roles
- **Company Management**: Company profiles and information
- **Team Management**: Public team member profiles
- **Media Management**: File uploads with thumbnail generation
- **Activity Logging**: Staff activity tracking

### Frontend (`frontend/src/`)
- **React + Vite** application
- **Components**: Reusable UI components in `components/`
- **Pages**: Main application pages in `Pages/`
- **Services**: API integration utilities in `services/`
- **Routing**: Application routes in `routes/`

## Common Commands Reference

### Backend Commands
```bash
cd backend
python manage.py runserver          # Start dev server
python manage.py migrate            # Run database migrations
python manage.py createsuperuser    # Create admin user
python manage.py create_staff_data  # Create sample data
python manage.py collectstatic      # Collect static files
```

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview built application
npm run lint     # Run ESLint
```

## Timing Expectations

**CRITICAL - NEVER CANCEL these operations:**

| Operation | Expected Time | Timeout Setting |
|-----------|---------------|-----------------|
| `pip install -r requirements.txt` | 1 second - 2 minutes | 180+ seconds |
| `npm install` | 3-10 seconds | 60+ seconds |
| `npm run build` | 3-4 seconds | 60+ seconds |
| `npm run lint` | 2-3 seconds | 60+ seconds |
| `python manage.py migrate` | 1 second | 60+ seconds |
| `python test_api_endpoints.py` | 0.2 seconds | 30+ seconds |
| Server startup | Immediate | N/A |

## Important File Locations

### Configuration Files
- `package.json` - Frontend dependencies and scripts
- `requirements.txt` - Python dependencies
- `backend/backend/settings.py` - Django configuration
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - ESLint configuration
- `tailwind.config.js` - TailwindCSS configuration

### Key Directories
- `backend/core/` - Main Django application
- `frontend/src/components/` - React components
- `frontend/src/Pages/` - Application pages
- `backend/static/` - Built frontend files (served by Django)
- `backend/media/` - Uploaded media files

### Database Files
- `backend/db.sqlite3` - SQLite database (development)
- `bumi_kartanegara.sql` - MySQL schema (production)
- `.env.example` - Environment configuration template

## Troubleshooting

### Common Issues

1. **"Model 'core.user' was already registered" warning:**
   - This is expected in development
   - Does not affect functionality
   - Caused by Django model reloading

2. **ESLint errors in built files:**
   - Built files in `backend/static/` should be ignored
   - Only fix errors in source files (`frontend/src/`)

3. **MySQL connection errors:**
   - Switch to SQLite for development (default configuration)
   - Ensure MySQL service is running for production

4. **Frontend not loading:**
   - Ensure both backend and frontend servers are running
   - Check CORS configuration in Django settings
   - Verify frontend build completed successfully

### Quick Fixes

```bash
# Reset database
cd backend && rm db.sqlite3 && python manage.py migrate && python manage.py create_staff_data

# Clean and rebuild frontend
rm -rf node_modules package-lock.json && npm install && npm run build

# Reset Python environment
pip uninstall -r requirements.txt -y && pip install -r requirements.txt
```

## Validation Checklist

Before completing any task, ALWAYS verify:

- [ ] Both servers start without errors
- [ ] All 17 API endpoints return 200 status (run `python test_api_endpoints.py`)
- [ ] Frontend loads at http://localhost:5173/
- [ ] Sample data is accessible via API
- [ ] Staff management workflow functions correctly
- [ ] Build completes successfully (`npm run build`)
- [ ] Linting passes or only shows acceptable errors (`npm run lint`)