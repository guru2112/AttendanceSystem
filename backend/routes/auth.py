# backend/routes/auth.py

from flask import Blueprint, request, jsonify, session
import sys
import os

# Add the parent directory to the path to import existing modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    try:
        from database import Database
        
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        db = Database()
        user = db.get_user(username)
        
        if user and db.verify_password(password, user['password']):
            # Store user session info
            session['user_id'] = str(user.get('_id'))
            session['username'] = user['username']
            session['role'] = user['role']
            
            return jsonify({
                "success": True,
                "message": "Login successful",
                "user": {
                    "username": user['username'],
                    "role": user['role']
                }
            })
        else:
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Login error: {str(e)}"}), 500

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"success": True, "message": "Logout successful"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Logout error: {str(e)}"}), 500

@auth_bp.route('/api/auth/check', methods=['GET'])
def check_auth():
    try:
        if 'username' in session:
            return jsonify({
                "authenticated": True,
                "user": {
                    "username": session['username'],
                    "role": session['role']
                }
            })
        else:
            return jsonify({"authenticated": False}), 401
    except Exception as e:
        return jsonify({"authenticated": False, "message": f"Auth check error: {str(e)}"}), 500