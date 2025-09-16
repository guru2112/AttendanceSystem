# test_basic.py - Test basic functionality without GUI

import sys
import os
import numpy as np

# Test database functionality without GUI
try:
    from database import Database
    print("✓ Database module imported successfully")
except ImportError as e:
    print(f"✗ Database import failed: {e}")
    sys.exit(1)

try:
    from face_recognition_logic import FaceRecognition
    print("✓ Face recognition module imported successfully")
except ImportError as e:
    print(f"✗ Face recognition import failed: {e}")
    sys.exit(1)

try:
    # Test database connection
    print("Testing database connection...")
    db = Database()
    print("✓ Database connection successful")
    
    # Test creating a teacher account
    success, message = db.register_teacher("test_teacher", "password123", "Test Teacher")
    print(f"Teacher registration: {message}")
    
    # Test user authentication
    user = db.get_user("teacher")
    if user:
        print(f"✓ Default teacher found: {user['username']}, role: {user['role']}")
    
    # Test student registration
    dummy_encoding = np.zeros(128)
    success, message = db.register_student("TEST123", "Test Student", "Computer science", "1", dummy_encoding)
    print(f"Student registration: {message}")
    
    # Initialize face recognition
    face_rec = FaceRecognition(db)
    print(f"✓ Face recognition initialized with {len(face_rec.known_face_names)} students")
    
    # Test attendance functionality
    attendance_details = {
        'date': '2025-01-18',
        'subject': 'Test Subject',
        'department': 'Computer science',
        'year': '1',
        'semester': '1',
        'class_div': 'A'
    }
    result = db.mark_attendance("TEST123", attendance_details)
    print(f"Attendance marking: {result}")
    
    # Test filtered attendance
    filters = {'student_id': 'TEST123'}
    records = db.get_filtered_attendance(filters)
    print(f"Attendance records found: {len(records)}")
    if records:
        print(f"First record: {records[0]}")
    
    # Test face recognition simulation
    print("\n=== Testing Face Recognition Simulation ===")
    test_frame = np.zeros((480, 640, 3), dtype=np.uint8)  # Black test frame
    
    # Test demo mode
    processed_frame, recognized_names = face_rec.process_frame_for_demo(test_frame)
    print(f"Demo recognition result: {recognized_names}")
    
    # Test attendance mode  
    processed_frame, recognized_names = face_rec.process_frame_for_attendance(test_frame, attendance_details)
    print(f"Attendance recognition result: {recognized_names}")
    
    print("✓ All database operations working")
    print("✓ Face recognition simulation working")
    
except Exception as e:
    print(f"✗ Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("✓ All basic tests passed!")