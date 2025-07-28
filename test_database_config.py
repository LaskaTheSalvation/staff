"""
Test to verify MySQL database configuration is properly set up.
This test ensures that SQLite has been successfully replaced with MySQL.
"""
import os
import sys

# Add the backend directory to Python path for imports
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

def test_database_configuration():
    """Test that database configuration uses MySQL instead of SQLite."""
    print("Testing database configuration...")
    
    # Import settings without setting up Django fully
    from backend.settings import DATABASES
    
    # Test that MySQL backend is configured
    db_engine = DATABASES['default']['ENGINE']
    assert db_engine == 'django.db.backends.mysql', f"Expected MySQL backend, got {db_engine}"
    print("✓ MySQL backend configured correctly")
    
    # Test database name
    db_name = DATABASES['default']['NAME']
    assert db_name == 'bumi_kartanegara', f"Expected database name 'bumi_kartanegara', got {db_name}"
    print("✓ Database name matches SQL schema file")
    
    # Test that SQLite is not being used
    assert db_engine != 'django.db.backends.sqlite3', "SQLite should not be used"
    print("✓ SQLite is not being used")
    
    # Test MySQL-specific settings
    db_config = DATABASES['default']
    assert 'HOST' in db_config, "HOST setting should be present"
    assert 'PORT' in db_config, "PORT setting should be present"
    assert 'USER' in db_config, "USER setting should be present"
    assert 'OPTIONS' in db_config, "OPTIONS setting should be present"
    print("✓ MySQL-specific settings are configured")
    
    # Test default values
    assert db_config['HOST'] == 'localhost', f"Expected HOST 'localhost', got {db_config['HOST']}"
    assert db_config['PORT'] == '3306', f"Expected PORT '3306', got {db_config['PORT']}"
    assert db_config['USER'] == 'root', f"Expected USER 'root', got {db_config['USER']}"
    print("✓ Default MySQL connection settings are correct")
    
    print("\nAll database configuration tests passed!")
    return True

if __name__ == '__main__':
    try:
        test_database_configuration()
        print("\n✅ Database configuration successfully changed from SQLite to MySQL")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)