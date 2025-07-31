#!/usr/bin/env python3
"""
Test script to verify all API endpoints are working correctly
"""
import requests
import json
import sys

BASE_URL = 'http://127.0.0.1:8000/api'

def test_endpoint(endpoint, method='GET', data=None):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        
        print(f"✅ {method} {endpoint} - Status: {response.status_code}")
        if response.status_code < 400:
            return True, response.json()
        else:
            print(f"❌ Error: {response.text}")
            return False, None
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return False, None

def main():
    print("🚀 Testing Backend API Endpoints...")
    print("=" * 50)
    
    # Test main API endpoints
    endpoints_to_test = [
        '/companies/',
        '/users/',
        '/team-members/',
        '/services/',
        '/home-content/',
        '/about-us/',
        '/contacts/',
        '/projects/',
        '/testimonials/',
        '/clients/',
        '/news/',
        '/media/',
        '/social-media/',
        '/settings/',
        '/categories/',
        '/user-logs/',
        '/content-history/',
    ]
    
    successful_tests = 0
    total_tests = len(endpoints_to_test)
    
    for endpoint in endpoints_to_test:
        success, data = test_endpoint(endpoint)
        if success:
            successful_tests += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {successful_tests}/{total_tests} endpoints working")
    
    # Test some specific data we created
    print("\n🔍 Testing specific data...")
    
    # Test services data
    success, services = test_endpoint('/services/')
    if success and services.get('results'):
        print(f"✅ Found {len(services['results'])} services in database")
        for service in services['results']:
            print(f"   - {service.get('title', 'Untitled')}: {service.get('description', 'No description')}")
    
    # Test about us data
    success, about_us = test_endpoint('/about-us/')
    if success and about_us.get('results'):
        print(f"✅ Found {len(about_us['results'])} about us entries")
        for entry in about_us['results']:
            print(f"   - Description: {entry.get('description', 'N/A')[:50]}...")
    
    if successful_tests == total_tests:
        print("\n🎉 All API endpoints are working correctly!")
        return 0
    else:
        print(f"\n⚠️  {total_tests - successful_tests} endpoints failed")
        return 1

if __name__ == '__main__':
    sys.exit(main())
