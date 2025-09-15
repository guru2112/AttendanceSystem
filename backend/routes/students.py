# backend/routes/students.py

from flask import Blueprint, request, jsonify, session
import sys
import os
import base64
import numpy as np
import cv2
import face_recognition

# Add the parent directory to the path to import existing modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

students_bp = Blueprint('students', __name__)

def require_auth():
    """Decorator to require authentication"""
    if 'username' not in session:
        return jsonify({"success": False, "message": "Authentication required"}), 401
    return None

@students_bp.route('/api/students/register', methods=['POST'])
def register_student():
    auth_check = require_auth()
    if auth_check:
        return auth_check
        
    if session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Only teachers can register students"}), 403
    
    try:
        from database import Database
        
        data = request.get_json()
        student_id = data.get('student_id')
        name = data.get('name')
        department = data.get('department')
        year = data.get('year')
        image_data = data.get('image_data')  # Base64 encoded image
        
        if not all([student_id, name, department, year, image_data]):
            return jsonify({"success": False, "message": "All fields are required"}), 400
        
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image_array = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if image is None:
                return jsonify({"success": False, "message": "Invalid image data"}), 400
            
            # Convert to RGB for face_recognition
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Get face encoding
            face_locations = face_recognition.face_locations(rgb_image)
            if not face_locations:
                return jsonify({"success": False, "message": "No face detected in the image"}), 400
            
            face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
            if not face_encodings:
                return jsonify({"success": False, "message": "Could not generate face encoding"}), 400
            
            face_encoding = face_encodings[0]
            
        except Exception as e:
            return jsonify({"success": False, "message": f"Image processing error: {str(e)}"}), 400
        
        db = Database()
        success, message = db.register_student(student_id, name, department, year, face_encoding)
        
        if success:
            return jsonify({"success": True, "message": message})
        else:
            return jsonify({"success": False, "message": message}), 400
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Registration error: {str(e)}"}), 500

@students_bp.route('/api/students/<student_id>', methods=['GET'])
def get_student(student_id):
    auth_check = require_auth()
    if auth_check:
        return auth_check
    
    try:
        from database import Database
        
        db = Database()
        student = db.get_student_by_id(student_id)
        
        if student:
            return jsonify({"success": True, "student": student})
        else:
            return jsonify({"success": False, "message": "Student not found"}), 404
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Error fetching student: {str(e)}"}), 500

@students_bp.route('/api/students/<student_id>/details', methods=['GET'])
def get_student_details(student_id):
    auth_check = require_auth()
    if auth_check:
        return auth_check
    
    try:
        from database import Database
        
        db = Database()
        details = db.get_student_details(student_id)
        
        if details:
            return jsonify({"success": True, "details": details})
        else:
            return jsonify({"success": False, "message": "Student not found"}), 404
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Error fetching student details: {str(e)}"}), 500

@students_bp.route('/api/students/<student_id>/update', methods=['PUT'])
def update_student(student_id):
    auth_check = require_auth()
    if auth_check:
        return auth_check
        
    if session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Only teachers can update students"}), 403
    
    try:
        from database import Database
        
        data = request.get_json()
        name = data.get('name')
        department = data.get('department')
        year = data.get('year')
        
        if not all([name, department, year]):
            return jsonify({"success": False, "message": "All fields are required"}), 400
        
        db = Database()
        success = db.update_student_details(student_id, name, department, year)
        
        if success:
            return jsonify({"success": True, "message": "Student updated successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to update student"}), 400
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Update error: {str(e)}"}), 500

@students_bp.route('/api/students/<student_id>/face', methods=['PUT'])
def update_student_face(student_id):
    auth_check = require_auth()
    if auth_check:
        return auth_check
        
    if session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Only teachers can update student faces"}), 403
    
    try:
        from database import Database
        
        data = request.get_json()
        image_data = data.get('image_data')
        
        if not image_data:
            return jsonify({"success": False, "message": "Image data is required"}), 400
        
        # Process image similar to registration
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image_array = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if image is None:
                return jsonify({"success": False, "message": "Invalid image data"}), 400
            
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_image)
            if not face_locations:
                return jsonify({"success": False, "message": "No face detected in the image"}), 400
            
            face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
            if not face_encodings:
                return jsonify({"success": False, "message": "Could not generate face encoding"}), 400
            
            face_encoding = face_encodings[0]
            
        except Exception as e:
            return jsonify({"success": False, "message": f"Image processing error: {str(e)}"}), 400
        
        db = Database()
        success = db.update_face_encoding(student_id, face_encoding)
        
        if success:
            return jsonify({"success": True, "message": "Face updated successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to update face"}), 400
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Face update error: {str(e)}"}), 500