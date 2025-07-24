# Staff Management System

A full-stack staff management application with React frontend and Django REST API backend.

## Project Structure

```
staff/
├── frontend/          # React + Vite frontend
├── backend/           # Django REST API backend
├── API_DOCUMENTATION.md
└── README.md
```

## Features

### Frontend (React + Vite)
- Modern React application with React Router
- Tailwind CSS for styling
- Component-based architecture
- Responsive design with sidebar navigation
- Dynamic content management interface
- Dark mode support

**Main Components:**
- **Banner Section**: Upload banner images, add titles, text, and button links
- **Service Section**: Manage service content with titles, descriptions, and feature tables
- **About Us Section**: Company information with picture galleries and descriptions
- **Our Journey Section**: Timeline of company milestones
- **Page Management**: Contact, Media, Services, and other static pages

### Backend (Django REST API)
- Django 5.2.4 with Django REST Framework
- PostgreSQL/SQLite database support
- Image upload handling with Pillow
- CORS enabled for frontend communication
- Admin interface for content management
- Authentication and authorization

**API Features:**
- RESTful API endpoints for all content types
- Public endpoints for frontend display
- Authenticated endpoints for content management
- File upload support for images
- Nested serializers for complex data structures

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create sample data (optional):**
   ```bash
   python manage.py create_sample_data
   ```

5. **Create superuser for admin access:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://127.0.0.1:8000/`
   Admin interface: `http://127.0.0.1:8000/admin/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173/`

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API endpoint documentation.

### Key API Endpoints

- `GET /api/banner/public/` - Get banner content
- `GET /api/service/public/` - Get service content  
- `GET /api/aboutus/public/` - Get about us content
- `GET /api/journey/public/` - Get journey content
- `GET /api/pages/by_name/?name=contact` - Get page by name

## Development

### Frontend Development
- Built with React 19+ and Vite
- Uses Tailwind CSS for styling
- Components are organized in `src/components/`
- Pages are in `src/Pages/`
- Routing handled by React Router

### Backend Development
- Django project with `core` app containing all models and APIs
- Models defined in `core/models.py`
- API views in `core/views.py`
- Serializers in `core/serializers.py`
- Admin configuration in `core/admin.py`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
python manage.py collectstatic
```

## Technology Stack

### Frontend
- React 19.1.0
- Vite 7.0.3
- React Router DOM 7.6.3
- Tailwind CSS 4.1.11
- Heroicons React 2.2.0

### Backend
- Django 5.2.4
- Django REST Framework 3.16.0
- Django CORS Headers 4.7.0
- Pillow 11.3.0 (for image processing)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
