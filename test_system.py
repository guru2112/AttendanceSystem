#!/usr/bin/env python3
"""
Simple test script to verify the backend API functionality
without requiring full dependency installation.
"""

import json
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_basic_imports():
    """Test if basic FastAPI components can be imported"""
    print("Testing basic imports...")
    try:
        from fastapi import FastAPI
        from pydantic import BaseModel
        print("✅ FastAPI imports successful")
        return True
    except ImportError as e:
        print(f"❌ FastAPI import failed: {e}")
        return False

def test_config():
    """Test configuration loading"""
    print("Testing configuration...")
    try:
        from backend.config import MONGO_URI, API_HOST, API_PORT
        print(f"✅ Configuration loaded: API will run on {API_HOST}:{API_PORT}")
        print(f"✅ MongoDB URI configured: {MONGO_URI[:20]}...")
        return True
    except ImportError as e:
        print(f"❌ Configuration import failed: {e}")
        return False

def test_app_structure():
    """Test if the FastAPI app structure is correct"""
    print("Testing application structure...")
    try:
        from backend.main import app
        print(f"✅ FastAPI app created successfully")
        print(f"✅ App title: {app.title}")
        
        # Get all routes
        routes = []
        for route in app.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                for method in route.methods:
                    if method != 'HEAD':  # Skip HEAD methods
                        routes.append(f"{method} {route.path}")
        
        print(f"✅ Found {len(routes)} API endpoints:")
        for route in sorted(routes):
            print(f"   {route}")
        
        return True
    except ImportError as e:
        print(f"❌ App structure test failed: {e}")
        return False

def test_frontend_structure():
    """Test if frontend structure is correct"""
    print("Testing frontend structure...")
    
    frontend_path = os.path.join(os.path.dirname(__file__), 'frontend')
    if not os.path.exists(frontend_path):
        print("❌ Frontend directory not found")
        return False
    
    # Check key files
    key_files = [
        'package.json',
        'next.config.ts',
        'src/app/page.tsx',
        'src/lib/api.ts',
        'src/app/users/page.tsx',
        'src/app/attendance/page.tsx',
        'src/app/records/page.tsx'
    ]
    
    missing_files = []
    for file_path in key_files:
        full_path = os.path.join(frontend_path, file_path)
        if not os.path.exists(full_path):
            missing_files.append(file_path)
        else:
            print(f"   ✅ {file_path}")
    
    if missing_files:
        print(f"❌ Missing frontend files: {missing_files}")
        return False
    
    print("✅ Frontend structure is complete")
    return True

def main():
    """Run all tests"""
    print("🧪 Running Attendance System Tests")
    print("=" * 50)
    
    tests = [
        test_basic_imports,
        test_config,
        test_app_structure,
        test_frontend_structure
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        print()
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            failed += 1
    
    print()
    print("=" * 50)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed! The system structure is correct.")
        print()
        print("Next steps:")
        print("1. Install dependencies: cd backend && pip install -r requirements.txt")
        print("2. Install frontend deps: cd frontend && npm install")
        print("3. Start the system: ./start.sh (Linux/Mac) or start.bat (Windows)")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)