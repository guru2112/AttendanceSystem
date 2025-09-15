# backend/app.py

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import sys

# Add the parent directory to the path to import existing modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure session
app.secret_key = 'attendance_system_secret_key_2024'  # Change this in production
app.config['SESSION_TYPE'] = 'filesystem'

# Import and register blueprints
from routes.auth import auth_bp
from routes.students import students_bp
from routes.attendance import attendance_bp

app.register_blueprint(auth_bp)
app.register_blueprint(students_bp)
app.register_blueprint(attendance_bp)

# Serve React App (for production)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    frontend_build_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build')
    if path != "" and os.path.exists(os.path.join(frontend_build_path, path)):
        return send_from_directory(frontend_build_path, path)
    elif os.path.exists(os.path.join(frontend_build_path, 'index.html')):
        return send_from_directory(frontend_build_path, 'index.html')
    else:
        return jsonify({"message": "React app not built. Please build the frontend first."}), 404

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)