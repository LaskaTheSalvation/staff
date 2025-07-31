# Staff Management System

A full-stack web application built with React (frontend) and Django (backend) for managing staff and company information for PT. BUMI KARTANEGARA.

## Features

- Staff management system
- Company profile management
- Project portfolio
- News and testimonials
- Contact management
- User authentication and logging

## Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- JavaScript/JSX

### Backend
- Django 5.2+
- Django REST Framework
- MySQL Database
- CORS support

## Database Setup

This application uses MySQL as the primary database. The database schema is provided in `bumi_kartanegara.sql`.

### MySQL Configuration

1. Install MySQL server on your system
2. Create a database named `bumi_kartanegara`
3. Import the schema:
   ```bash
   mysql -u root -p bumi_kartanegara < bumi_kartanegara.sql
   ```

4. Configure environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your MySQL credentials:
   ```
   DB_NAME=bumi_kartanegara
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

3. Run Django migrations:
   ```bash
   python manage.py migrate
   ```

4. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite-tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
