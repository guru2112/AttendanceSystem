# simple_backend_api.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from typing import Dict, Any
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Simple in-memory storage for demo (replace with actual database in production)
USERS = {
    "teacher": {"username": "teacher", "password": "teacher123", "role": "teacher"},
    "CS2021001": {"username": "CS2021001", "password": "CS2021001", "role": "student"},
    "CS2021002": {"username": "CS2021002", "password": "CS2021002", "role": "student"},
    "CS2021003": {"username": "CS2021003", "password": "CS2021003", "role": "student"},
}

STUDENTS = {
    "CS2021001": {"student_id": "CS2021001", "name": "John Doe", "department": "Computer Science", "year": "2"},
    "CS2021002": {"student_id": "CS2021002", "name": "Jane Smith", "department": "Computer Science", "year": "2"},
    "CS2021003": {"student_id": "CS2021003", "name": "Bob Johnson", "department": "Electronics", "year": "3"},
}

ATTENDANCE_RECORDS = [
    {"student_id": "CS2021001", "name": "John Doe", "date": "2024-09-15", "subject": "Programming", "semester": "3", "status": "Present"},
    {"student_id": "CS2021002", "name": "Jane Smith", "date": "2024-09-15", "subject": "Programming", "semester": "3", "status": "Present"},
    {"student_id": "CS2021001", "name": "John Doe", "date": "2024-09-14", "subject": "Mathematics", "semester": "3", "status": "Absent"},
    {"student_id": "CS2021003", "name": "Bob Johnson", "date": "2024-09-15", "subject": "Electronics", "semester": "5", "status": "Present"},
]

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user and return user info"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
            
        user = USERS.get(username)
        if user and user['password'] == password:
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
    """Get all students data"""
    try:
        students_list = list(STUDENTS.values())
        return jsonify({'students': students_list})
    except Exception as e:
        print(f"Get students error: {e}")
        return jsonify({'error': 'Failed to fetch students'}), 500

@app.route('/api/students/<student_id>', methods=['GET'])
def get_student_details(student_id):
    """Get detailed student information"""
    try:
        student = STUDENTS.get(student_id)
        if student:
            # Add attendance records for this student
            student_attendance = [r for r in ATTENDANCE_RECORDS if r['student_id'] == student_id]
            student_with_attendance = {**student, 'attendance': student_attendance}
            return jsonify({'student': student_with_attendance})
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
            
        if student_id in STUDENTS:
            STUDENTS[student_id].update({
                'name': name,
                'department': department,
                'year': year
            })
            return jsonify({'success': True, 'message': 'Student updated successfully'})
        else:
            return jsonify({'error': 'Student not found'}), 404
            
    except Exception as e:
        print(f"Update student error: {e}")
        return jsonify({'error': 'Failed to update student'}), 500

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    """Get filtered attendance records"""
    try:
        # Get query parameters for filtering
        student_id = request.args.get('student_id')
        department = request.args.get('department')
        year = request.args.get('year')
        date = request.args.get('date')
        subject = request.args.get('subject')
        semester = request.args.get('semester')
        
        filtered_records = ATTENDANCE_RECORDS.copy()
        
        if student_id:
            filtered_records = [r for r in filtered_records if r['student_id'] == student_id]
        if subject:
            filtered_records = [r for r in filtered_records if r['subject'] == subject]
        if date:
            filtered_records = [r for r in filtered_records if r['date'] == date]
        if semester:
            filtered_records = [r for r in filtered_records if r['semester'] == semester]
        
        return jsonify({'attendance': filtered_records})
        
    except Exception as e:
        print(f"Get attendance error: {e}")
        return jsonify({'error': 'Failed to fetch attendance records'}), 500

@app.route('/api/attendance/mark', methods=['POST'])
def mark_attendance():
    """Mark attendance for a student"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        date = data.get('date', datetime.datetime.now().strftime('%Y-%m-%d'))
        subject = data.get('subject')
        semester = data.get('semester')
        
        if not all([student_id, subject, semester]):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Check if student exists
        student = STUDENTS.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
            
        # Check if attendance already marked
        existing = next((r for r in ATTENDANCE_RECORDS 
                        if r['student_id'] == student_id and r['date'] == date and r['subject'] == subject), None)
        
        if existing:
            return jsonify({'error': f'Attendance already marked for {student_id} in {subject} today'}), 400
            
        # Add new attendance record
        new_record = {
            "student_id": student_id,
            "name": student['name'],
            "date": date,
            "subject": subject,
            "semester": semester,
            "status": "Present"
        }
        ATTENDANCE_RECORDS.append(new_record)
        
        return jsonify({'success': True, 'message': f'Attendance marked for {student_id} in {subject}'})
            
    except Exception as e:
        print(f"Mark attendance error: {e}")
        return jsonify({'error': 'Failed to mark attendance'}), 500

@app.route('/api/register/student', methods=['POST'])
def register_student():
    """Register a new student"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        name = data.get('name')
        department = data.get('department')
        year = data.get('year')
        
        if not all([student_id, name, department, year]):
            return jsonify({'error': 'All fields are required'}), 400
            
        if student_id in STUDENTS:
            return jsonify({'error': 'Student ID already exists'}), 400
            
        # Add student
        STUDENTS[student_id] = {
            'student_id': student_id,
            'name': name,
            'department': department,
            'year': year
        }
        
        # Add user account
        USERS[student_id] = {
            'username': student_id,
            'password': student_id,  # Default password is student ID
            'role': 'student'
        }
        
        return jsonify({'success': True, 'message': 'Student registered successfully'})
            
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
    print("Starting Simple Flask API server...")
    print("Available endpoints:")
    print("- POST /api/auth/login")
    print("- GET  /api/students")
    print("- GET  /api/students/<student_id>")
    print("- PUT  /api/students/<student_id>")
    print("- GET  /api/attendance")
    print("- POST /api/attendance/mark")
    print("- POST /api/register/student")
    print("- GET  /api/health")
    print("\nDemo credentials:")
    print("- Teacher: username='teacher', password='teacher123'")
    print("- Student: username='CS2021001', password='CS2021001'")
    app.run(debug=True, host='0.0.0.0', port=5000)