# simple_app.py - Simplified FastAPI Backend for testing

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import hashlib
import json

# Simple JWT mock (for development only)
def create_simple_token(username: str, role: str) -> str:
    data = {"username": username, "role": role, "exp": str(datetime.utcnow() + timedelta(hours=24))}
    return json.dumps(data)

def verify_simple_token(token: str) -> Dict[str, str]:
    try:
        data = json.loads(token)
        return {"username": data["username"], "role": data["role"]}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# Initialize FastAPI app
app = FastAPI(title="Attendance System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Mock data store
mock_users = {
    "teacher": {"password": "teacher123", "role": "teacher"},
    "student1": {"password": "student1", "role": "student"}
}

mock_students = {
    "student1": {
        "student_id": "student1",
        "name": "John Doe",
        "department": "Computer Science",
        "year": "2024",
        "attendance": [
            {"date": "2024-01-15", "subject": "Math", "status": "Present"},
            {"date": "2024-01-16", "subject": "Physics", "status": "Present"}
        ]
    }
}

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return verify_simple_token(credentials.credentials)

def require_role(required_role: str):
    def role_checker(token_data: dict = Depends(verify_token)):
        if token_data["role"] != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return token_data
    return role_checker

# Pydantic models
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterStudentRequest(BaseModel):
    student_id: str
    name: str
    department: str
    year: str
    face_image: str

class UpdateStudentRequest(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None

class AttendanceSessionRequest(BaseModel):
    subject: str
    department: str
    year: str
    semester: str
    class_div: str

# Authentication endpoints
@app.post("/auth/login")
async def login(login_request: LoginRequest):
    user = mock_users.get(login_request.username)
    if not user or user["password"] != login_request.password:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_simple_token(login_request.username, user["role"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "username": login_request.username
    }

@app.post("/auth/register")
async def register_student(register_request: RegisterStudentRequest):
    if register_request.student_id in mock_students:
        raise HTTPException(status_code=400, detail="Student ID already exists")
    
    # Add to mock users
    mock_users[register_request.student_id] = {
        "password": register_request.student_id,  # Use student_id as password
        "role": "student"
    }
    
    # Add to mock students
    mock_students[register_request.student_id] = {
        "student_id": register_request.student_id,
        "name": register_request.name,
        "department": register_request.department,
        "year": register_request.year,
        "attendance": []
    }
    
    return {"message": "Student registered successfully"}

# Student endpoints
@app.get("/api/students/me")
async def get_my_details(token_data: dict = Depends(require_role("student"))):
    student = mock_students.get(token_data["username"])
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/api/students/me")
async def update_my_details(
    update_request: UpdateStudentRequest,
    token_data: dict = Depends(require_role("student"))
):
    student = mock_students.get(token_data["username"])
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if update_request.name:
        student["name"] = update_request.name
    if update_request.department:
        student["department"] = update_request.department
    if update_request.year:
        student["year"] = update_request.year
    
    return {"message": "Student details updated successfully"}

@app.get("/api/attendance/me")
async def get_my_attendance(token_data: dict = Depends(require_role("student"))):
    student = mock_students.get(token_data["username"])
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"attendance": student.get("attendance", [])}

# Teacher endpoints
@app.get("/api/students/{student_id}")
async def get_student_by_id(
    student_id: str,
    token_data: dict = Depends(require_role("teacher"))
):
    student = mock_students.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/api/students/{student_id}")
async def update_student_by_id(
    student_id: str,
    update_request: UpdateStudentRequest,
    token_data: dict = Depends(require_role("teacher"))
):
    student = mock_students.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if update_request.name:
        student["name"] = update_request.name
    if update_request.department:
        student["department"] = update_request.department
    if update_request.year:
        student["year"] = update_request.year
    
    return {"message": "Student details updated successfully"}

@app.get("/api/attendance/all")
async def get_all_attendance(
    student_id: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[str] = None,
    date: Optional[str] = None,
    subject: Optional[str] = None,
    semester: Optional[str] = None,
    class_div: Optional[str] = None,
    token_data: dict = Depends(require_role("teacher"))
):
    all_attendance = []
    for sid, student in mock_students.items():
        for record in student.get("attendance", []):
            attendance_record = {
                "student_id": sid,
                "name": student["name"],
                "date": record["date"],
                "subject": record["subject"],
                "status": record["status"]
            }
            
            # Apply filters
            if student_id and sid != student_id:
                continue
            if department and student["department"] != department:
                continue
            if year and student["year"] != year:
                continue
            if date and record["date"] != date:
                continue
            if subject and record["subject"] != subject:
                continue
            
            all_attendance.append(attendance_record)
    
    return {"attendance": all_attendance}

# Face recognition endpoints (mock)
@app.post("/api/session/demo")
async def demo_face_recognition(
    image_data: str,
    token_data: dict = Depends(verify_token)
):
    # Mock response
    return {
        "processed_image": image_data,
        "recognized_names": ["John Doe", "Unknown"]
    }

@app.post("/api/session/start")
async def start_attendance_session(
    session_request: AttendanceSessionRequest,
    image_data: str,
    token_data: dict = Depends(require_role("teacher"))
):
    # Mock response - add attendance record
    mock_students["student1"]["attendance"].append({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "subject": session_request.subject,
        "status": "Present"
    })
    
    return {
        "processed_image": image_data,
        "recognized_names": ["John Doe"],
        "attendance_marked": 1
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)