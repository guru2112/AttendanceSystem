import pymongo
from pymongo.server_api import ServerApi
import datetime
from passlib.context import CryptContext
from config import MONGO_URI
from typing import List, Dict, Any, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Database:
    def __init__(self):
        try:
            self.client = pymongo.MongoClient(MONGO_URI, server_api=ServerApi('1'))
            self.client.admin.command('ping')
            print("Successfully connected to MongoDB Atlas!")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
            
        self.db = self.client.face_recognition_system
        self.users_collection = self.db.users
        self.students_collection = self.db.students
        self._create_initial_teacher()

    def _create_initial_teacher(self):
        if not self.users_collection.find_one({"role": "teacher"}):
            print("Creating initial teacher account...")
            hashed_password = pwd_context.hash("teacher123")
            self.users_collection.insert_one({
                "username": "teacher", "password": hashed_password, "role": "teacher"
            })
            print("Default Teacher created. Username: 'teacher', Password: 'teacher123'")

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_user(self, username):
        return self.users_collection.find_one({"username": username})

    def register_student(self, student_id: str, name: str, department: str, year: str, face_encoding: List[float]) -> tuple[bool, str]:
        if self.students_collection.find_one({"student_id": student_id}):
            return False, "Student ID already exists."
        
        self.students_collection.insert_one({
            "student_id": student_id, 
            "name": name, 
            "department": department,
            "year": year, 
            "face_encoding": face_encoding, 
            "attendance": []
        })
        
        hashed_password = pwd_context.hash(student_id)
        self.users_collection.insert_one({
            "username": student_id, "password": hashed_password, "role": "student"
        })
        return True, "Student registered successfully."

    def get_all_student_data(self):
        students = list(self.students_collection.find({}, {"_id": 0, "student_id": 1, "name": 1, "face_encoding": 1}))
        known_face_encodings = [s["face_encoding"] for s in students]
        known_face_names = [s["name"] for s in students]
        known_face_ids = [s["student_id"] for s in students]
        return known_face_encodings, known_face_names, known_face_ids

    def mark_attendance(self, student_id: str, details: Dict[str, Any]) -> str:
        today, subject = details['date'], details['subject']
        if self.students_collection.find_one({"student_id": student_id, "attendance.date": today, "attendance.subject": subject}):
            return f"Attendance already marked for {student_id} in {subject} today."
        
        new_record = {
            "date": today, 
            "timestamp": datetime.datetime.now(), 
            "status": "Present",
            "subject": subject, 
            "department": details.get('department', ''), 
            "year": details.get('year', ''),
            "semester": details.get('semester', ''), 
            "class_div": details.get('class_div', '')
        }
        
        res = self.students_collection.update_one(
            {"student_id": student_id}, 
            {"$push": {"attendance": new_record}}
        )
        return f"Attendance marked for {student_id} in {subject}." if res.modified_count > 0 else f"Failed to mark attendance for {student_id}."

    def get_filtered_attendance(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        pipeline = []
        student_match = {}
        attendance_match = {}
        
        if filters.get('student_id'): 
            student_match['student_id'] = filters['student_id']
        if filters.get('department'): 
            student_match['department'] = filters['department']
        if filters.get('year'): 
            student_match['year'] = filters['year']
        if filters.get('date'): 
            attendance_match['date'] = filters['date']
        if filters.get('subject'): 
            attendance_match['subject'] = filters['subject']
        if filters.get('semester'): 
            attendance_match['semester'] = filters['semester']
        if filters.get('class_div'): 
            attendance_match['class_div'] = filters['class_div']
            
        if student_match: 
            pipeline.append({"$match": student_match})
        pipeline.append({"$unwind": "$attendance"})
        if attendance_match: 
            pipeline.append({"$match": {f"attendance.{k}": v for k, v in attendance_match.items()}})
        
        pipeline.append({
            "$project": {
                "_id": 0, 
                "student_id": "$student_id", 
                "name": "$name",
                "date": "$attendance.date", 
                "subject": "$attendance.subject",
                "semester": "$attendance.semester", 
                "status": "$attendance.status",
                "timestamp": "$attendance.timestamp"
            }
        })
        return list(self.students_collection.aggregate(pipeline))

    def get_student_by_id(self, student_id: str) -> Optional[Dict[str, Any]]:
        return self.students_collection.find_one({"student_id": student_id}, {"_id": 0, "face_encoding": 0, "attendance": 0})

    def update_student_details(self, student_id: str, name: str, dept: str, year: str) -> bool:
        res = self.students_collection.update_one(
            {"student_id": student_id}, 
            {"$set": {"name": name, "department": dept, "year": year}}
        )
        return res.modified_count > 0
        
    def update_face_encoding(self, student_id: str, new_face_encoding: List[float]) -> bool:
        result = self.students_collection.update_one(
            {"student_id": student_id},
            {"$set": {"face_encoding": new_face_encoding}}
        )
        return result.modified_count > 0

    def get_student_details(self, student_id: str) -> Optional[Dict[str, Any]]:
        return self.students_collection.find_one({"student_id": student_id}, {"_id": 0, "name": 1, "department": 1, "year": 1, "attendance": 1})

    def get_all_students(self) -> List[Dict[str, Any]]:
        """Get all students without face encodings for listing purposes"""
        return list(self.students_collection.find({}, {"_id": 0, "student_id": 1, "name": 1, "department": 1, "year": 1}))

    def delete_student(self, student_id: str) -> bool:
        """Delete a student and their user account"""
        student_result = self.students_collection.delete_one({"student_id": student_id})
        user_result = self.users_collection.delete_one({"username": student_id})
        return student_result.deleted_count > 0