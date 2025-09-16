from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime
import os
import uuid
from pathlib import Path

from database import Database
from face_recognition_service import FaceRecognition
from config import UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_EXTENSIONS

# Initialize FastAPI app
app = FastAPI(
    title="Attendance System API",
    description="Face Recognition based Attendance System API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database and face recognition
db = Database()
face_rec = FaceRecognition(db)

# Create upload directory
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic models for request/response
class UserCreate(BaseModel):
    student_id: str
    name: str
    department: str
    year: str

class AttendanceRecord(BaseModel):
    student_id: str
    subject: str
    department: Optional[str] = ""
    year: Optional[str] = ""
    semester: Optional[str] = ""
    class_div: Optional[str] = ""

class AttendanceQuery(BaseModel):
    student_id: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    date: Optional[str] = None
    subject: Optional[str] = None
    semester: Optional[str] = None
    class_div: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Attendance System API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}

@app.post("/api/add-user")
async def add_user(
    student_id: str = Form(...),
    name: str = Form(...),
    department: str = Form(...),
    year: str = Form(...),
    images: List[UploadFile] = File(...)
):
    """Add a new user with face images"""
    try:
        # Validate files
        if not images:
            raise HTTPException(status_code=400, detail="At least one image is required")
        
        images_data = []
        for image in images:
            # Check file size
            content = await image.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail=f"File {image.filename} is too large")
            
            # Check file extension
            if image.filename:
                ext = Path(image.filename).suffix.lower()
                if ext not in ALLOWED_EXTENSIONS:
                    raise HTTPException(status_code=400, detail=f"File {image.filename} has unsupported extension")
            
            images_data.append(content)
        
        # Extract face encodings from images
        face_encoding = face_rec.encode_faces_from_multiple_images(images_data)
        if face_encoding is None:
            raise HTTPException(status_code=400, detail="No face detected in the provided images")
        
        # Register student in database
        success, message = db.register_student(student_id, name, department, year, face_encoding)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        # Reload known faces to include the new user
        face_rec.load_known_faces()
        
        return JSONResponse(
            status_code=201,
            content={"message": message, "student_id": student_id}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/recognize")
async def recognize_face(image: UploadFile = File(...)):
    """Recognize face from an image"""
    try:
        # Validate file
        content = await image.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File is too large")
        
        if image.filename:
            ext = Path(image.filename).suffix.lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(status_code=400, detail="Unsupported file extension")
        
        # Perform face recognition
        result = face_rec.recognize_face_from_image(content)
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/mark-attendance")
async def mark_attendance(attendance: AttendanceRecord):
    """Mark attendance for a student"""
    try:
        # Prepare attendance details
        details = {
            "date": datetime.date.today().isoformat(),
            "subject": attendance.subject,
            "department": attendance.department,
            "year": attendance.year,
            "semester": attendance.semester,
            "class_div": attendance.class_div
        }
        
        # Mark attendance in database
        result = db.mark_attendance(attendance.student_id, details)
        
        return JSONResponse(content={"message": result})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/attendance")
async def get_attendance(
    student_id: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[str] = None,
    date: Optional[str] = None,
    subject: Optional[str] = None,
    semester: Optional[str] = None,
    class_div: Optional[str] = None
):
    """Get attendance records with optional filtering"""
    try:
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
        
        records = db.get_filtered_attendance(filters)
        
        return JSONResponse(content={"records": records, "count": len(records)})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/students")
async def get_students():
    """Get all students"""
    try:
        students = db.get_all_students()
        return JSONResponse(content={"students": students, "count": len(students)})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/students/{student_id}")
async def get_student(student_id: str):
    """Get student details by ID"""
    try:
        student = db.get_student_details(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return JSONResponse(content=student)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.delete("/api/students/{student_id}")
async def delete_student(student_id: str):
    """Delete a student"""
    try:
        success = db.delete_student(student_id)
        if not success:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Reload known faces after deletion
        face_rec.load_known_faces()
        
        return JSONResponse(content={"message": f"Student {student_id} deleted successfully"})
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.put("/api/students/{student_id}/face")
async def update_student_face(
    student_id: str,
    images: List[UploadFile] = File(...)
):
    """Update student's face encoding with new images"""
    try:
        # Check if student exists
        student = db.get_student_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Validate and process images
        if not images:
            raise HTTPException(status_code=400, detail="At least one image is required")
        
        images_data = []
        for image in images:
            content = await image.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail=f"File {image.filename} is too large")
            
            if image.filename:
                ext = Path(image.filename).suffix.lower()
                if ext not in ALLOWED_EXTENSIONS:
                    raise HTTPException(status_code=400, detail=f"File {image.filename} has unsupported extension")
            
            images_data.append(content)
        
        # Extract new face encoding
        face_encoding = face_rec.encode_faces_from_multiple_images(images_data)
        if face_encoding is None:
            raise HTTPException(status_code=400, detail="No face detected in the provided images")
        
        # Update face encoding in database
        success = db.update_face_encoding(student_id, face_encoding)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update face encoding")
        
        # Reload known faces
        face_rec.load_known_faces()
        
        return JSONResponse(content={"message": f"Face encoding updated for student {student_id}"})
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    from config import API_HOST, API_PORT, DEBUG
    
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=DEBUG
    )