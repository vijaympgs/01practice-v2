import os
import django
import sys
from decimal import Decimal

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sales.models import Sale, SaleItem, POSSession
from sales.serializers import SaleCreateSerializer
from products.models import ItemMaster
from organization.models import Location
from django.contrib.auth import get_user_model

User = get_user_model()

def test_sale_creation():
    print("Setting up test data...")
    
    # Get or create a user
    user = User.objects.first()
    if not user:
        print("No user found. Creating one.")
        user = User.objects.create_user(username='testuser', password='password')
    
    # Get or create a location
    location = Location.objects.first()
    if not location:
        print("No location found. Creating one.")
        location = Location.objects.create(name='Test Location', code='LOC001')
        
    # Get or create an ItemMaster
    item = ItemMaster.objects.first()
    if not item:
        print("No ItemMaster found. Creating one.")
        item = ItemMaster.objects.create(
            item_code='TEST001',
            item_name='Test Item',
            sell_price=100.00,
            cost_price=50.00,
            created_by=user
        )
    else:
        print(f"Using existing ItemMaster: {item.item_name} ({item.id})")
        
    # Create a POS Session
    session = POSSession.objects.create(
        cashier=user,
        location=location,
        opening_cash=1000.00,
        status='open'
    )
    print(f"Created POS Session: {session.id}")
    
    # Prepare sale data
    sale_data = {
        'sale_type': 'cash',
        'cashier': user.id,
        'pos_session': session.id,
        'location': location.id,
        'status': 'completed',
        'items': [
            {
                'product': item.id,  # This is now an ItemMaster ID
                'quantity': 1,
                'unit_price': 100.00,
                'discount_amount': 0,
                'tax_rate': 0
            }
        ],
        'payments': [
            {
                'payment_method': 'cash',
                'amount': 100.00,
                'status': 'completed'
            }
        ]
    }
    
    print("Attempting to create sale via serializer...")
    serializer = SaleCreateSerializer(data=sale_data)
    
    if serializer.is_valid():
        try:
            sale = serializer.save()
            print(f"SUCCESS: Sale created with ID: {sale.id}")
            print(f"Sale Total: {sale.total_amount}")
            print(f"Sale Items: {sale.items.count()}")
            for sale_item in sale.items.all():
                print(f" - Item: {sale_item.product.item_name}, Qty: {sale_item.quantity}, Price: {sale_item.unit_price}")
                if sale_item.product.id != item.id:
                    print(f"ERROR: SaleItem product ID mismatch! Expected {item.id}, got {sale_item.product.id}")
                else:
                    print("VERIFIED: SaleItem correctly links to ItemMaster.")
        except Exception as e:
            print(f"ERROR: Failed to save sale: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("ERROR: Serializer validation failed:")
        print(serializer.errors)

if __name__ == "__main__":
    test_sale_creation()
