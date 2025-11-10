#!/usr/bin/env python
import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from organization.models import Company

print('Companies in database:', Company.objects.all().count())
for company in Company.objects.all():
    print(f' - {company.name} ({company.code}) - Active: {company.is_active}')
