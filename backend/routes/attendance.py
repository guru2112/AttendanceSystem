# backend/routes/attendance.py

from flask import Blueprint, request, jsonify, session
import sys
import os
import base64
import numpy as np
import cv2
from datetime import datetime

# Add the parent directory to the path to import existing modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

attendance_bp = Blueprint('attendance', __name__)

def require_auth():
    """Decorator to require authentication"""
    if 'username' not in session:
        return jsonify({"success": False, "message": "Authentication required"}), 401
    return None

@attendance_bp.route('/api/attendance/setup', methods=['POST'])
def setup_attendance():
    auth_check = require_auth()
    if auth_check:
        return auth_check
        
    if session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Only teachers can setup attendance"}), 403
    
    try:
        data = request.get_json()
        subject = data.get('subject')
        department = data.get('department')
        year = data.get('year')
        semester = data.get('semester')
        class_div = data.get('class_div')
        
        if not all([subject, department, year, semester, class_div]):
            return jsonify({"success": False, "message": "All fields are required"}), 400
        
        # Store attendance setup in session for live attendance
        session['attendance_setup'] = {
            'subject': subject,
            'department': department,
            'year': year,
            'semester': semester,
            'class_div': class_div,
            'date': datetime.now().strftime('%Y-%m-%d')
        }
        
        return jsonify({"success": True, "message": "Attendance setup successful"})
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Setup error: {str(e)}"}), 500

@attendance_bp.route('/api/attendance/process-frame', methods=['POST'])
def process_frame():
    auth_check = require_auth()
    if auth_check:
        return auth_check
        
    if session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Only teachers can process attendance"}), 403
    
    if 'attendance_setup' not in session:
        return jsonify({"success": False, "message": "Attendance not setup. Please setup attendance first"}), 400
    
    try:
        from face_recognition_logic import FaceRecognition
        from database import Database
        
        data = request.get_json()
        image_data = data.get('image_data')
        
        if not image_data:
            return jsonify({"success": False, "message": "Image data is required"}), 400
        
        # Process image
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image_array = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if frame is None:
                return jsonify({"success": False, "message": "Invalid image data"}), 400
            
        except Exception as e:
            return jsonify({"success": False, "message": f"Image processing error: {str(e)}"}), 400
        
        # Process frame for attendance
        db = Database()
        face_rec = FaceRecognition(db)
        
        attendance_details = session['attendance_setup']
        processed_frame, recognized_names = face_rec.process_frame_for_attendance(frame, attendance_details)
        
        # Convert processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        processed_image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            "success": True,
            "processed_image": f"data:image/jpeg;base64,{processed_image_b64}",
            "recognized_names": recognized_names
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Frame processing error: {str(e)}"}), 500

@attendance_bp.route('/api/attendance/demo-frame', methods=['POST'])
def demo_process_frame():
    auth_check = require_auth()
    if auth_check:
        return auth_check
    
    try:
        from face_recognition_logic import FaceRecognition
        from database import Database
        
        data = request.get_json()
        image_data = data.get('image_data')
        
        if not image_data:
            return jsonify({"success": False, "message": "Image data is required"}), 400
        
        # Process image
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image_array = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if frame is None:
                return jsonify({"success": False, "message": "Invalid image data"}), 400
            
        except Exception as e:
            return jsonify({"success": False, "message": f"Image processing error: {str(e)}"}), 400
        
        # Process frame for demo (read-only)
        db = Database()
        face_rec = FaceRecognition(db)
        
        processed_frame, recognized_names = face_rec.process_frame_for_demo(frame)
        
        # Convert processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        processed_image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            "success": True,
            "processed_image": f"data:image/jpeg;base64,{processed_image_b64}",
            "recognized_names": recognized_names
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Demo processing error: {str(e)}"}), 500

@attendance_bp.route('/api/attendance/view', methods=['POST'])
def view_attendance():
    auth_check = require_auth()
    if auth_check:
        return auth_check
    
    try:
        from database import Database
        
        data = request.get_json()
        filters = {}
        
        # Extract filters
        if data.get('student_id'):
            filters['student_id'] = data['student_id']
        if data.get('department'):
            filters['department'] = data['department']
        if data.get('year'):
            filters['year'] = data['year']
        if data.get('date'):
            filters['date'] = data['date']
        if data.get('subject'):
            filters['subject'] = data['subject']
        if data.get('semester'):
            filters['semester'] = data['semester']
        if data.get('class_div'):
            filters['class_div'] = data['class_div']
        
        db = Database()
        attendance_records = db.get_filtered_attendance(filters)
        
        return jsonify({"success": True, "attendance": attendance_records})
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Error fetching attendance: {str(e)}"}), 500

@attendance_bp.route('/api/attendance/reload-faces', methods=['POST'])
def reload_faces():
    auth_check = require_auth()
    if auth_check:
        return auth_check
        
    if session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Only teachers can reload faces"}), 403
    
    try:
        from face_recognition_logic import FaceRecognition
        from database import Database
        
        db = Database()
        face_rec = FaceRecognition(db)
        face_rec.load_known_faces()
        
        return jsonify({"success": True, "message": "Faces reloaded successfully"})
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Error reloading faces: {str(e)}"}), 500