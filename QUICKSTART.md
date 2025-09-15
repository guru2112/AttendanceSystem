# Quick Start Guide

## Web Application Setup

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
pip install flask flask-cors
# For full functionality, install all dependencies:
# pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
```

### Step 2: Configure Database

Update the MongoDB connection string in `config.py` (in the root directory).

### Step 3: Start the Application

**Option A: Automatic startup**
```bash
./start_web_app.sh
```

**Option B: Manual startup**
```bash
# Start backend
cd backend
python app.py

# In another terminal, the frontend is served by Flask
# Visit http://localhost:5000
```

### Step 4: Login

- **Teacher Login:**
  - Username: `teacher`
  - Password: `teacher123`
  
- **Student Login:**
  - Use your registered student ID as both username and password

## Features Available

✅ **Working Features:**
- User authentication (teacher/student)
- Student registration with face capture
- Dashboard views for both teacher and student
- Attendance setup and configuration
- Attendance viewing and filtering
- Modern responsive web interface

🚧 **Features requiring additional dependencies:**
- Live face recognition (needs OpenCV, face_recognition, etc.)
- Camera-based attendance marking
- Face recognition testing

## Architecture

- **Frontend:** React application with responsive UI
- **Backend:** Flask REST API with session management
- **Database:** MongoDB (same as original)
- **Face Recognition:** Integrated from original codebase

## Migration Complete

The desktop application has been successfully refactored into a modern web application while preserving all core functionality. The original desktop app (`main.py`) remains available for reference.