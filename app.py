# app.py - FastAPI Backend Application

from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import base64
import numpy as np
import cv2
from database import Database
from face_recognition_logic import FaceRecognition

# JWT Configuration
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize FastAPI app
app = FastAPI(title="Attendance System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize database and face recognition
db = Database()
face_rec = FaceRecognition(db)

# JWT helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"username": username, "role": role}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_role(required_role: str):
    def role_checker(token_data: dict = Depends(verify_token)):
        if token_data["role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return token_data
    return role_checker

# Pydantic models
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterStudentRequest(BaseModel):
    student_id: str
    name: str
    department: str
    year: str
    face_image: str  # base64 encoded image

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
    user = db.get_user(login_request.username)
    if not user or not db.verify_password(login_request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "username": user["username"]
    }

@app.post("/auth/register")
async def register_student(register_request: RegisterStudentRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(register_request.face_image.split(',')[1])
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Extract face encoding
        import face_recognition
        face_locations = face_recognition.face_locations(image)
        if not face_locations:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No face detected in the image"
            )
        
        face_encodings = face_recognition.face_encodings(image, face_locations)
        if not face_encodings:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract face encoding"
            )
        
        # Register student
        success, message = db.register_student(
            register_request.student_id,
            register_request.name,
            register_request.department,
            register_request.year,
            face_encodings[0]
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        # Reload face recognition data
        face_rec.load_known_faces()
        
        return {"message": message}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

# Student endpoints
@app.get("/api/students/me")
async def get_my_details(token_data: dict = Depends(require_role("student"))):
    student = db.get_student_details(token_data["username"])
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    return student

@app.put("/api/students/me")
async def update_my_details(
    update_request: UpdateStudentRequest,
    token_data: dict = Depends(require_role("student"))
):
    student = db.get_student_by_id(token_data["username"])
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Update with new values or keep existing ones
    name = update_request.name or student["name"]
    department = update_request.department or student["department"]
    year = update_request.year or student["year"]
    
    success = db.update_student_details(token_data["username"], name, department, year)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update student details"
        )
    
    return {"message": "Student details updated successfully"}

@app.get("/api/attendance/me")
async def get_my_attendance(token_data: dict = Depends(require_role("student"))):
    student = db.get_student_details(token_data["username"])
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return {"attendance": student.get("attendance", [])}

# Teacher endpoints
@app.get("/api/students/{student_id}")
async def get_student_by_id(
    student_id: str,
    token_data: dict = Depends(require_role("teacher"))
):
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    return student

@app.put("/api/students/{student_id}")
async def update_student_by_id(
    student_id: str,
    update_request: UpdateStudentRequest,
    token_data: dict = Depends(require_role("teacher"))
):
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Update with new values or keep existing ones
    name = update_request.name or student["name"]
    department = update_request.department or student["department"]
    year = update_request.year or student["year"]
    
    success = db.update_student_details(student_id, name, department, year)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update student details"
        )
    
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
    filters = {}
    if student_id:
        filters["student_id"] = student_id
    if department:
        filters["department"] = department
    if year:
        filters["year"] = year
    if date:
        filters["date"] = date
    if subject:
        filters["subject"] = subject
    if semester:
        filters["semester"] = semester
    if class_div:
        filters["class_div"] = class_div
    
    attendance_records = db.get_filtered_attendance(filters)
    return {"attendance": attendance_records}

# Face recognition endpoints
@app.post("/api/session/demo")
async def demo_face_recognition(
    image_data: str,  # base64 encoded image
    token_data: dict = Depends(verify_token)
):
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Process frame for demo (no attendance marking)
        processed_frame, recognized_names = face_rec.process_frame_for_demo(frame)
        
        # Encode processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        processed_image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "processed_image": f"data:image/jpeg;base64,{processed_image_b64}",
            "recognized_names": recognized_names
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Face recognition failed: {str(e)}"
        )

@app.post("/api/session/start")
async def start_attendance_session(
    session_request: AttendanceSessionRequest,
    image_data: str,  # base64 encoded image
    token_data: dict = Depends(require_role("teacher"))
):
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Prepare attendance details
        attendance_details = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "subject": session_request.subject,
            "department": session_request.department,
            "year": session_request.year,
            "semester": session_request.semester,
            "class_div": session_request.class_div
        }
        
        # Process frame for attendance
        processed_frame, recognized_names = face_rec.process_frame_for_attendance(frame, attendance_details)
        
        # Encode processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        processed_image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "processed_image": f"data:image/jpeg;base64,{processed_image_b64}",
            "recognized_names": recognized_names,
            "attendance_marked": len([name for name in recognized_names if name != "Unknown"])
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Attendance session failed: {str(e)}"
        )

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)