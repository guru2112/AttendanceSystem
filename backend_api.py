# backend_api.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database
import datetime
from typing import Dict, Any
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize database
db = Database()

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user and return user info"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
            
        user = db.get_user(username)
        if user and db.verify_password(password, user['password']):
            return jsonify({
                'success': True,
                'user': {
                    'username': user['username'],
                    'role': user['role']
                }
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students data (without face encodings)"""
    try:
        # Get student data without face encodings for display
        students = list(db.students_collection.find({}, {
            "_id": 0, "student_id": 1, "name": 1, 
            "department": 1, "year": 1
        }))
        return jsonify({'students': students})
    except Exception as e:
        print(f"Get students error: {e}")
        return jsonify({'error': 'Failed to fetch students'}), 500

@app.route('/api/students/<student_id>', methods=['GET'])
def get_student_details(student_id):
    """Get detailed student information"""
    try:
        student = db.get_student_details(student_id)
        if student:
            return jsonify({'student': student})
        else:
            return jsonify({'error': 'Student not found'}), 404
    except Exception as e:
        print(f"Get student details error: {e}")
        return jsonify({'error': 'Failed to fetch student details'}), 500

@app.route('/api/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    """Update student details"""
    try:
        data = request.get_json()
        name = data.get('name')
        department = data.get('department')
        year = data.get('year')
        
        if not all([name, department, year]):
            return jsonify({'error': 'Name, department, and year are required'}), 400
            
        success = db.update_student_details(student_id, name, department, year)
        if success:
            return jsonify({'success': True, 'message': 'Student updated successfully'})
        else:
            return jsonify({'error': 'Failed to update student'}), 400
            
    except Exception as e:
        print(f"Update student error: {e}")
        return jsonify({'error': 'Failed to update student'}), 500

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    """Get filtered attendance records"""
    try:
        # Get query parameters for filtering
        filters = {}
        if request.args.get('student_id'):
            filters['student_id'] = request.args.get('student_id')
        if request.args.get('department'):
            filters['department'] = request.args.get('department')
        if request.args.get('year'):
            filters['year'] = request.args.get('year')
        if request.args.get('date'):
            filters['date'] = request.args.get('date')
        if request.args.get('subject'):
            filters['subject'] = request.args.get('subject')
        if request.args.get('semester'):
            filters['semester'] = request.args.get('semester')
        if request.args.get('class_div'):
            filters['class_div'] = request.args.get('class_div')
            
        records = db.get_filtered_attendance(filters)
        return jsonify({'attendance': records})
        
    except Exception as e:
        print(f"Get attendance error: {e}")
        return jsonify({'error': 'Failed to fetch attendance records'}), 500

@app.route('/api/attendance/mark', methods=['POST'])
def mark_attendance():
    """Mark attendance for a student"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        
        # Attendance details
        details = {
            'date': data.get('date', datetime.datetime.now().strftime('%Y-%m-%d')),
            'subject': data.get('subject'),
            'department': data.get('department'),
            'year': data.get('year'),
            'semester': data.get('semester'),
            'class_div': data.get('class_div', 'A')
        }
        
        if not all([student_id, details['subject'], details['department'], 
                   details['year'], details['semester']]):
            return jsonify({'error': 'Missing required fields'}), 400
            
        result = db.mark_attendance(student_id, details)
        
        if "already marked" in result:
            return jsonify({'error': result}), 400
        elif "marked for" in result:
            return jsonify({'success': True, 'message': result})
        else:
            return jsonify({'error': result}), 400
            
    except Exception as e:
        print(f"Mark attendance error: {e}")
        return jsonify({'error': 'Failed to mark attendance'}), 500

@app.route('/api/register/student', methods=['POST'])
def register_student():
    """Register a new student (without face recognition for now)"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        name = data.get('name')
        department = data.get('department')
        year = data.get('year')
        
        if not all([student_id, name, department, year]):
            return jsonify({'error': 'All fields are required'}), 400
            
        # For now, use a dummy face encoding
        import numpy as np
        dummy_face_encoding = np.zeros(128)  # Face recognition typically uses 128-dimensional encodings
        
        success, message = db.register_student(student_id, name, department, year, dummy_face_encoding)
        
        if success:
            return jsonify({'success': True, 'message': message})
        else:
            return jsonify({'error': message}), 400
            
    except Exception as e:
        print(f"Register student error: {e}")
        return jsonify({'error': 'Failed to register student'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.datetime.now().isoformat()})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Flask API server...")
    print("Available endpoints:")
    print("- POST /api/auth/login")
    print("- GET  /api/students")
    print("- GET  /api/students/<student_id>")
    print("- PUT  /api/students/<student_id>")
    print("- GET  /api/attendance")
    print("- POST /api/attendance/mark")
    print("- POST /api/register/student")
    print("- GET  /api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)