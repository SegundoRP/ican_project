# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a neighbor-to-neighbor delivery management system for condominiums with a Django REST API backend and Next.js React frontend. The system enables residents within the same condominium to act as delivery persons (repartidevs) for their neighbors, creating a community-based delivery network where residents can help each other by delivering items within the building.

## Development Commands

### Backend (Django)
```bash
cd backend-api

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Or using pyenv: pyenv activate ican_project

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Run specific app tests
python manage.py test users
python manage.py test services
python manage.py test condominiums
```

### Frontend (Next.js)
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Environment Configuration

### Backend (.env file in backend-api/)
Required environment variables:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DJANGO_ALLOWED_HOSTS`: Comma-separated allowed hosts
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: PostgreSQL configuration
- `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`: Gmail SMTP credentials
- `DOMAIN`: Domain for activation emails
- `AUTH_COOKIE_SECURE`: HTTPS cookie setting (True/False)
- `GOOGLE_AUTH_KEY`, `GOOGLE_AUTH_SECRET_KEY`: Google OAuth2 credentials
- `CORS_ALLOWED_ORIGINS`: Comma-separated frontend URLs
- `REDIRECT_URLS`: Comma-separated OAuth redirect URLs

### Frontend (.env.local file in frontend/)
- `NEXT_PUBLIC_HOST`: Backend API URL (e.g., http://localhost:8000)

## Architecture Overview

### Authentication Flow
1. JWT tokens stored in HTTP-only cookies (backend-api/users/authentication.py:4-21)
2. Frontend uses RTK Query with automatic token refresh (frontend/src/redux/services/apiSlice.js:13-48)
3. Supports both email/password and Google OAuth2 authentication

### API Structure
- **Users App**: Authentication, user management, and roles (Receiver, Deliverer, Both)
- **Condominiums App**: Buildings and departments management
- **Services App**: Orders, payments, reviews, and service types

### Frontend State Management
- Redux Toolkit with RTK Query for API calls
- Authentication state managed in authSlice
- API endpoints extended from base apiSlice

### Key Design Patterns
1. **API-First Design**: All frontend features consume REST APIs
2. **Cookie-Based Auth**: Secure HTTP-only cookies for JWT storage
3. **Internationalization**: Built-in i18n support (EN/ES) in Next.js
4. **Role-Based Access**: Residents can be receivers, deliverers (repartidevs), or both
5. **Community-Based Model**: Deliverers are neighbors within the same condominium, not external delivery services

## Database Schema

### Core Models
- **UserAccount**: Custom user model with role field
- **Condominium**: Buildings with related departments
- **Department**: Tower/floor organization within condominiums
- **ServiceType**: Types of services (currently delivery)
- **Order**: Full order lifecycle with status tracking
- **Payment**: Cash and card payment support
- **Review**: Service and order rating system

## API Endpoints Pattern
- Authentication: `/api/auth/` (Djoser endpoints)
- JWT: `/api/jwt/create/`, `/api/jwt/refresh/`, `/api/jwt/verify/`
- Condominiums: `/api/condominiums/`
- Services: `/api/services/`
- Orders: `/api/orders/`
- Payments: `/api/payments/`

## Testing Approach
- Django unit tests in each app's tests.py
- Frontend testing setup pending (no test files found)
- Run Django tests with `python manage.py test` from backend-api/

## Common Development Tasks

### Adding New API Endpoints
1. Create serializer in app's serializers.py
2. Create viewset in app's views.py
3. Register in app's urls.py
4. Update backend/urls.py if new app

### Adding Frontend Features
1. Create API endpoint in Redux slice
2. Add component in src/components/
3. Create page in src/app/[locale]/
4. Update translations in public/locales/

### Database Changes
1. Modify models in app's models.py
2. Run `python manage.py makemigrations`
3. Run `python manage.py migrate`