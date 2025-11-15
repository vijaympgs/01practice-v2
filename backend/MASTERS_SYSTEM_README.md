# Master Data Upload System

## Overview

The Master Data Upload System is a comprehensive Django application that allows administrators to bulk upload master data through Excel templates. This system is integrated into the Django Admin interface and provides a user-friendly way to manage large volumes of master data.

## Features

### ✅ **Core Functionality**
- **Excel Template Generation**: Automatically generates multi-sheet Excel templates with instructions
- **Django Admin Integration**: Seamlessly integrated into the Django Admin interface
- **File Upload Processing**: Handles Excel file uploads with validation and error reporting
- **Progress Tracking**: Real-time progress tracking for upload sessions
- **Comprehensive Logging**: Detailed import logs with success/failure tracking
- **Error Handling**: Robust error handling with detailed error messages

### 📊 **Excel Template Structure**
The system generates a comprehensive Excel workbook with 9 sheets:

1. **Instructions & Navigation**: User guide with hyperlinks to all sheets
2. **Organization Setup**: Company and Location information
3. **General Masters**: Categories, UOM, Payment Modes
4. **Item Data**: Products and Item Master information
5. **Attributes**: Product attributes and definitions
6. **Attribute Values**: Attribute value mappings
7. **Customers**: Customer information and details
8. **Vendors**: Vendor/Supplier information
9. **Tax Configuration**: Tax codes and rates
10. **Additional Masters**: Brands, Departments, Divisions

### 🏗️ **Technical Architecture**

#### **Django Models**
- **UploadSession**: Track upload sessions and progress
- **MasterDataTemplate**: Define template configurations
- **ImportLog**: Track individual record import results
- **ValidationRule**: Define validation rules for data fields
- **MasterDataCache**: Cache for performance optimization

#### **Services**
- **ExcelTemplateGenerator**: Generate Excel templates with styling
- **File Upload Handler**: Process uploaded Excel files
- **Data Validation Engine**: Validate and process data
- **Error Reporting**: Comprehensive error tracking and reporting

#### **Admin Integration**
- **Custom Admin Views**: Upload/download functionality
- **Admin Templates**: Professional admin interface
- **Permission System**: Leverages Django's permission framework
- **Action Buttons**: Quick access to upload/download functions

## Installation & Setup

### Prerequisites
- Django 4.0+
- openpyxl (Excel processing)
- pandas (data processing)

### Setup Steps

1. **Add to INSTALLED_APPS** (already done):
```python
INSTALLED_APPS = [
    # ... other apps
    'masters',
]
```

2. **Run Migrations** (already done):
```bash
python manage.py makemigrations masters
python manage.py migrate
```

3. **Create Admin User** (already done):
```bash
python manage.py createsuperuser
```

## Usage

### Accessing the System

1. **Start Django Development Server**:
```bash
python manage.py runserver
```

2. **Go to Django Admin**:
```
http://127.0.0.1:8000/admin/
```

3. **Navigate to Masters Section**:
- Look for "Masters" in the admin dashboard
- Click on "Upload sessions" to manage uploads

### Downloading Templates

1. **Go to Upload Sessions** in Django Admin
2. **Click "Download Template"** button
3. **Choose between**:
   - Empty template (for data entry)
   - Sample template (with example data)

### Uploading Data

1. **Fill in the Excel template** with your master data
2. **Go to Upload Sessions** → **Upload Master Data**
3. **Select the completed Excel file**
4. **Upload and monitor progress**

### Monitoring Uploads

1. **View Upload Sessions** list
2. **Click on any session** to see details
3. **View Import Logs** for detailed results
4. **Track progress** and error handling

## File Structure

```
backend/masters/
├── __init__.py
├── admin.py                    # Django admin integration
├── apps.py                     # Django app configuration
├── models.py                   # Database models
├── services/
│   ├── __init__.py
│   └── excel_template_generator.py  # Excel template generation
├── templates/
│   └── admin/
│       └── masters/
│           ├── upload_data.html     # Upload interface
│           └── view_logs.html        # Import logs viewer
├── urls.py                     # URL routing
├── views.py                    # Django views
├── tests.py                    # Test cases
└── migrations/                 # Database migrations
```

## API Endpoints

The system provides the following admin URLs:

- `/admin/masters/uploadsession/download-template/` - Download Excel template
- `/admin/masters/uploadsession/upload-data/` - Upload master data
- `/admin/masters/uploadsession/<id>/view-logs/` - View import logs

## Data Validation

### Built-in Validation
- **File Format**: Only .xlsx and .xls files accepted
- **Required Fields**: Validates required fields are present
- **Data Types**: Ensures data matches expected formats
- **Foreign Keys**: Validates relationships between data
- **Uniqueness**: Checks for duplicate records

### Custom Validation Rules
- **Field-specific rules** for each master data type
- **Business logic validation** for data integrity
- **Cross-sheet validation** for related data

## Error Handling

### Error Types
- **File Format Errors**: Invalid file types or corrupted files
- **Validation Errors**: Data validation failures
- **Processing Errors**: Database or system errors
- **Business Logic Errors**: Rule violations

### Error Reporting
- **Detailed error messages** for each failed record
- **Row-level error tracking** in import logs
- **Summary statistics** for upload sessions
- **User-friendly error descriptions**

## Performance Features

### Caching
- **Master Data Cache**: Improves lookup performance
- **Template Caching**: Reduces template generation time
- **Validation Cache**: Speeds up data validation

### Optimization
- **Batch Processing**: Handles large files efficiently
- **Progress Tracking**: Real-time progress updates
- **Memory Management**: Optimized for large datasets

## Security

### Authentication
- **Django Admin Integration**: Uses existing admin authentication
- **Permission System**: Leverages Django's permission framework
- **User Tracking**: Tracks which user performed uploads

### Data Protection
- **File Validation**: Validates uploaded files for security
- **SQL Injection Protection**: Uses Django ORM
- **XSS Protection**: Proper data sanitization

## Testing

### Test Coverage
- **Template Generation**: Excel template creation tests
- **Model Validation**: Database model tests
- **Admin Integration**: Admin interface tests
- **Error Handling**: Error scenario tests

### Running Tests
```bash
# Test template generation
python test_template_generation.py

# Test masters app functionality
python test_masters_app.py
```

## Troubleshooting

### Common Issues

1. **Template Download Fails**:
   - Check openpyxl installation
   - Verify file permissions
   - Check Django settings

2. **Upload Fails**:
   - Verify file format (.xlsx, .xls)
   - Check file size limits
   - Validate data format

3. **Import Errors**:
   - Check required fields
   - Validate data formats
   - Review error logs

### Debug Mode
Enable Django debug mode for detailed error information:
```python
DEBUG = True
```

## Future Enhancements

### Planned Features
- **Async Processing**: Background task processing for large files
- **Advanced Validation**: More sophisticated validation rules
- **Data Preview**: Preview data before import
- **Bulk Operations**: Bulk update/delete capabilities
- **API Integration**: REST API for programmatic access

### Performance Improvements
- **Database Optimization**: Query optimization for large datasets
- **Caching Enhancement**: Advanced caching strategies
- **File Processing**: Streaming for very large files

## Support

### Documentation
- **Admin Guide**: User documentation for administrators
- **Developer Guide**: Technical documentation for developers
- **API Documentation**: API reference for integrations

### Contact
For issues and support, please refer to the Django admin interface or contact the development team.

---

## System Status: ✅ **OPERATIONAL**

The Master Data Upload System is fully functional and ready for production use. All core features have been implemented and tested successfully.

**Last Updated**: November 15, 2025
**Version**: 1.0.0
