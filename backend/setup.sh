#!/bin/bash

# Backend Setup Script for Flow Retail System

echo "========================================"
echo "  Flow Retail - Backend Setup"
echo "========================================"

# Check if Python is installed
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    echo ""
    echo "Download from: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "Python version: $PYTHON_VERSION"

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "❌ Failed to create virtual environment."
    echo "Make sure Python is properly installed and accessible."
    exit 1
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "❌ Failed to activate virtual environment."
    exit 1
fi

# Upgrade pip
echo ""
echo "⬆️  Upgrading pip..."
pip install --upgrade pip
if [ $? -ne 0 ]; then
    echo "❌ Failed to upgrade pip."
    exit 1
fi

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    echo "Check your internet connection and try again."
    exit 1
fi

# Check Django installation
echo ""
echo "🔍 Verifying Django installation..."
python -c "import django; print('Django version:', django.get_version())" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Django installation failed."
    echo "Trying to install Django manually..."
    pip install django==5.0.1
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Django."
        exit 1
    fi
fi

echo "✅ Django installed successfully"

# Check if manage.py exists
echo ""
echo "🔍 Checking Django project files..."
if [ ! -f "manage.py" ]; then
    echo "❌ manage.py not found. Make sure you're in the backend directory."
    exit 1
fi

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
echo "Creating migrations..."
python manage.py makemigrations
if [ $? -ne 0 ]; then
    echo "❌ Failed to create migrations."
    echo "This might be due to:"
    echo "- Django not properly installed"
    echo "- Virtual environment not activated"
    echo "- Missing dependencies"
    echo ""
    echo "Trying to fix..."
    pip install -r requirements.txt --force-reinstall
    python manage.py makemigrations
    if [ $? -ne 0 ]; then
        echo "❌ Still failed. Please check the error messages above."
        exit 1
    fi
fi

echo "Applying migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "❌ Failed to apply migrations."
    exit 1
fi

# Create superuser prompt
echo ""
echo "========================================"
echo "Would you like to create a superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

echo ""
echo "========================================"
echo "✅ Backend setup complete!"
echo "========================================"
echo ""
echo "To start the development server:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run server: python manage.py runserver"
echo ""
echo "Access points:"
echo "  - API: http://localhost:8000/api/"
echo "  - Admin: http://localhost:8000/admin/"
echo "  - API Docs: http://localhost:8000/api/docs/"
echo ""

