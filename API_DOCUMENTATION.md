# Staff Management System API Documentation

## Overview
This Django REST API provides backend functionality for the Staff Management System frontend. It includes CRUD operations for banner content, services, about us sections, journey content, and general pages.

## Base URL
- Development: `http://127.0.0.1:8000/api/`

## Authentication
- Most endpoints require authentication
- Public endpoints are available for frontend display
- Uses Django's session authentication

## API Endpoints

### Banner Content
- `GET /api/banner/public/` - Public endpoint to get all banner content
- `GET /api/banner/` - Get all banner content (authenticated)
- `POST /api/banner/` - Create new banner content (authenticated)
- `PUT /api/banner/{id}/` - Update banner content (authenticated)
- `DELETE /api/banner/{id}/` - Delete banner content (authenticated)

**Banner Content Types:**
- `banner_image` - Upload Banner
- `title` - Title text
- `text` - Description text
- `button_link` - Button with link

### Service Content
- `GET /api/service/public/` - Public endpoint to get all service content
- `GET /api/service/` - Get all service content (authenticated)
- `POST /api/service/` - Create new service content (authenticated)
- `PUT /api/service/{id}/` - Update service content (authenticated)
- `DELETE /api/service/{id}/` - Delete service content (authenticated)

**Service Content Types:**
- `title` - Section title
- `content` - Service description
- `table` - Service features table

### Service Tables
- `GET /api/service-table/` - Get all service table rows (authenticated)
- `POST /api/service-table/` - Create service table row (authenticated)
- `PUT /api/service-table/{id}/` - Update service table row (authenticated)
- `DELETE /api/service-table/{id}/` - Delete service table row (authenticated)

### About Us Content
- `GET /api/aboutus/public/` - Public endpoint to get all about us content
- `GET /api/aboutus/` - Get all about us content (authenticated)
- `POST /api/aboutus/` - Create new about us content (authenticated)
- `PUT /api/aboutus/{id}/` - Update about us content (authenticated)
- `DELETE /api/aboutus/{id}/` - Delete about us content (authenticated)

**About Us Content Types:**
- `title` - Section title
- `picture` - Picture gallery
- `description` - Description text

### About Us Pictures
- `GET /api/aboutus-picture/` - Get all about us picture rows (authenticated)
- `POST /api/aboutus-picture/` - Create about us picture row (authenticated)
- `PUT /api/aboutus-picture/{id}/` - Update about us picture row (authenticated)
- `DELETE /api/aboutus-picture/{id}/` - Delete about us picture row (authenticated)

### Journey Content
- `GET /api/journey/public/` - Public endpoint to get all journey content
- `GET /api/journey/` - Get all journey content (authenticated)
- `POST /api/journey/` - Create new journey content (authenticated)
- `PUT /api/journey/{id}/` - Update journey content (authenticated)
- `DELETE /api/journey/{id}/` - Delete journey content (authenticated)

### Pages
- `GET /api/pages/public/` - Public endpoint to get all published pages
- `GET /api/pages/by_name/?name={page_name}` - Get page by name (public)
- `GET /api/pages/` - Get all pages (authenticated)
- `POST /api/pages/` - Create new page (authenticated)
- `PUT /api/pages/{id}/` - Update page (authenticated)
- `DELETE /api/pages/{id}/` - Delete page (authenticated)

**Available Page Names:**
- `contact` - Contact page
- `media` - Media center page
- `service` - Services page
- `about-us` - About us page
- `home` - Home page

## Data Models

### BannerContent
```json
{
  "id": 1,
  "type": "title",
  "title": "Welcome Message",
  "text": "Description text",
  "image": null,
  "button_text": "Click Here",
  "button_url": "/link",
  "order": 1,
  "created_at": "2025-07-24T05:57:27.027486Z",
  "updated_at": "2025-07-24T05:57:27.027521Z"
}
```

### ServiceContent
```json
{
  "id": 1,
  "type": "table",
  "title": "Service Features",
  "content": "",
  "order": 1,
  "table_rows": [
    {
      "id": 1,
      "nama": "attendance",
      "title": "Attendance Management",
      "text": "Track employee attendance efficiently",
      "order": 1
    }
  ],
  "created_at": "2025-07-24T05:57:27.034192Z",
  "updated_at": "2025-07-24T05:57:27.034205Z"
}
```

### Page
```json
{
  "id": 1,
  "name": "contact",
  "title": "Contact Us",
  "content": "Get in touch with our team for any inquiries.",
  "meta_description": "Contact us for staff management solutions",
  "status": "published",
  "created_at": "2025-07-24T05:57:27.052352Z",
  "updated_at": "2025-07-24T05:57:27.052365Z"
}
```

## Setup Instructions

### Backend Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Create sample data: `python manage.py create_sample_data`
4. Create superuser: `python manage.py createsuperuser`
5. Run server: `python manage.py runserver`

### CORS Configuration
The backend is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000` (React dev server alternative)
- `http://127.0.0.1:3000`

## Media Files
- Media files are served from `/media/` URL
- Images are organized in subdirectories:
  - `banners/` - Banner images
  - `aboutus/` - About us pictures
  - `journey/` - Journey images

## Admin Interface
Access the Django admin at `http://127.0.0.1:8000/admin/` to manage content through a web interface.