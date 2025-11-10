# NewBorn Retail™ - Backend

Django REST Framework backend for the NewBorn Retail™ AI-Powered Enterprise ERP System.

## Quick Start

### Automated Setup

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

### Manual Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Create superuser:**
```bash
python manage.py createsuperuser
```

5. **Run development server:**
```bash
python manage.py runserver
```

## Access Points

- **API Root:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **API Documentation:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/auth/register/` - Register new user
- `GET /api/auth/me/` - Get current user info
- `PUT /api/auth/profile/` - Update profile
- `POST /api/auth/change-password/` - Change password

## Environment Variables

Copy `.env.example` to `.env` and update values:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Project Structure

```
backend/
├── config/          # Django project configuration
├── users/           # User management app
├── products/        # Product management (Phase 2)
├── categories/      # Category management (Phase 2)
├── customers/       # Customer management (Phase 2)
├── suppliers/       # Supplier management (Phase 2)
├── inventory/       # Inventory management (Phase 3)
├── sales/           # Sales transactions (Phase 4)
├── payments/        # Payment processing (Phase 4)
├── reports/         # Reporting (Phase 5)
├── manage.py        # Django management script
└── requirements.txt # Python dependencies
```

## Development Status

- ✅ Phase 1: Foundation - User authentication complete
- ✅ Phase 2: Master data modules complete
- ✅ Phase 3: Inventory management complete
- ✅ Phase 4: POS system in progress
- ⏳ Phase 5: Reports & analytics

## Common Commands

```bash
# Create new app
python manage.py startapp app_name

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver

# Django shell
python manage.py shell

# Run tests
python manage.py test

# Collect static files
python manage.py collectstatic
```

## Testing

Run tests with:
```bash
python manage.py test
```

## Deployment

See main project README and IMPLEMENTATION_PLAN.md for deployment instructions.

## Brand

**NewBorn Retail™ AI-Powered**  
*The Future of Retail Management*
