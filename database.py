# database.py

import pymongo
from pymongo.server_api import ServerApi
import datetime
from passlib.context import CryptContext
from config import MONGO_URI

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Database:
    def __init__(self):
        try:
            self.client = pymongo.MongoClient(MONGO_URI, server_api=ServerApi('1'))
            self.client.admin.command('ping')
            print("Successfully connected to MongoDB Atlas!")
            self.connected = True
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            print("WARNING: Running in offline mode - data will not be persisted!")
            self.connected = False
            # Initialize in-memory storage for offline mode
            self._offline_users = []
            self._offline_students = []
            
        if self.connected:
            self.db = self.client.face_recognition_system
            self.users_collection = self.db.users
            self.students_collection = self.db.students
            
        self._create_initial_teacher()

    def _create_initial_teacher(self):
        if self.connected:
            if not self.users_collection.find_one({"role": "teacher"}):
                print("Creating initial teacher account...")
                hashed_password = pwd_context.hash("teacher123")
                self.users_collection.insert_one({
                    "username": "teacher", "password": hashed_password, "role": "teacher"
                })
                print("Default Teacher created. Username: 'teacher', Password: 'teacher123'")
        else:
            # Offline mode - create default teacher in memory
            hashed_password = pwd_context.hash("teacher123")
            self._offline_users.append({
                "username": "teacher", "password": hashed_password, "role": "teacher"
            })
            print("Default Teacher created (offline mode). Username: 'teacher', Password: 'teacher123'")

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_user(self, username):
        if self.connected:
            return self.users_collection.find_one({"username": username})
        else:
            # Offline mode
            for user in self._offline_users:
                if user["username"] == username:
                    return user
            return None

    def register_student(self, student_id, name, department, year, face_encoding):
        if self.connected:
            if self.students_collection.find_one({"student_id": student_id}):
                return False, "Student ID already exists."
            self.students_collection.insert_one({
                "student_id": student_id, "name": name, "department": department,
                "year": year, "face_encoding": face_encoding.tolist(), "attendance": []
            })
            hashed_password = pwd_context.hash(student_id)
            self.users_collection.insert_one({
                "username": student_id, "password": hashed_password, "role": "student"
            })
            return True, "Student registered successfully."
        else:
            # Offline mode
            for student in self._offline_students:
                if student["student_id"] == student_id:
                    return False, "Student ID already exists."
            
            self._offline_students.append({
                "student_id": student_id, "name": name, "department": department,
                "year": year, "face_encoding": face_encoding.tolist(), "attendance": []
            })
            hashed_password = pwd_context.hash(student_id)
            self._offline_users.append({
                "username": student_id, "password": hashed_password, "role": "student"
            })
            return True, "Student registered successfully (offline mode)."

    def get_all_student_data(self):
        if self.connected:
            students = list(self.students_collection.find({}, {"_id": 0, "student_id": 1, "name": 1, "face_encoding": 1}))
            known_face_encodings = [s["face_encoding"] for s in students]
            known_face_names = [s["name"] for s in students]
            known_face_ids = [s["student_id"] for s in students]
            return known_face_encodings, known_face_names, known_face_ids
        else:
            # Offline mode
            known_face_encodings = [s["face_encoding"] for s in self._offline_students]
            known_face_names = [s["name"] for s in self._offline_students]
            known_face_ids = [s["student_id"] for s in self._offline_students]
            return known_face_encodings, known_face_names, known_face_ids

    def mark_attendance(self, student_id, details):
        today, subject = details['date'], details['subject']
        
        if self.connected:
            if self.students_collection.find_one({"student_id": student_id, "attendance.date": today, "attendance.subject": subject}):
                return f"Attendance already marked for {student_id} in {subject} today."
            new_record = {
                "date": today, "timestamp": datetime.datetime.now(), "status": "Present",
                "subject": subject, "department": details['department'], "year": details['year'],
                "semester": details['semester'], "class_div": details['class_div']
            }
            res = self.students_collection.update_one({"student_id": student_id}, {"$push": {"attendance": new_record}})
            return f"Attendance marked for {student_id} in {subject}." if res.modified_count > 0 else f"Failed to mark attendance for {student_id}."
        else:
            # Offline mode
            for student in self._offline_students:
                if student["student_id"] == student_id:
                    # Check if already marked
                    for record in student["attendance"]:
                        if record["date"] == today and record["subject"] == subject:
                            return f"Attendance already marked for {student_id} in {subject} today."
                    
                    # Add new record
                    new_record = {
                        "date": today, "timestamp": datetime.datetime.now().isoformat(), "status": "Present",
                        "subject": subject, "department": details['department'], "year": details['year'],
                        "semester": details['semester'], "class_div": details['class_div']
                    }
                    student["attendance"].append(new_record)
                    return f"Attendance marked for {student_id} in {subject} (offline mode)."
            return f"Student {student_id} not found."

    def get_filtered_attendance(self, filters):
        if self.connected:
            pipeline = []
            student_match = {}; attendance_match = {}
            if filters.get('student_id'): student_match['student_id'] = filters['student_id']
            if filters.get('department'): student_match['department'] = filters['department']
            if filters.get('year'): student_match['year'] = filters['year']
            if filters.get('date'): attendance_match['date'] = filters['date']
            if filters.get('subject'): attendance_match['subject'] = filters['subject']
            if filters.get('semester'): attendance_match['semester'] = filters['semester']
            if filters.get('class_div'): attendance_match['class_div'] = filters['class_div']
            if student_match: pipeline.append({"$match": student_match})
            pipeline.append({"$unwind": "$attendance"})
            if attendance_match: pipeline.append({"$match": {f"attendance.{k}": v for k, v in attendance_match.items()}})
            
            pipeline.append({
                "$project": {
                    "_id": 0, "student_id": "$student_id", "name": "$name",
                    "date": "$attendance.date", "subject": "$attendance.subject",
                    "semester": "$attendance.semester", "status": "$attendance.status"
                }
            })
            return list(self.students_collection.aggregate(pipeline))
        else:
            # Offline mode
            results = []
            for student in self._offline_students:
                # Check student filters
                if filters.get('student_id') and student['student_id'] != filters['student_id']:
                    continue
                if filters.get('department') and student['department'] != filters['department']:
                    continue
                if filters.get('year') and str(student['year']) != str(filters['year']):
                    continue
                
                # Check attendance records
                for record in student['attendance']:
                    if filters.get('date') and record['date'] != filters['date']:
                        continue
                    if filters.get('subject') and record['subject'] != filters['subject']:
                        continue
                    if filters.get('semester') and record['semester'] != filters['semester']:
                        continue
                    if filters.get('class_div') and record['class_div'] != filters['class_div']:
                        continue
                    
                    results.append({
                        'student_id': student['student_id'],
                        'name': student['name'],
                        'date': record['date'],
                        'subject': record['subject'],
                        'semester': record['semester'],
                        'status': record['status']
                    })
            return results

    def get_student_by_id(self, student_id):
        if self.connected:
            return self.students_collection.find_one({"student_id": student_id}, {"_id": 0, "face_encoding": 0, "attendance": 0})
        else:
            # Offline mode
            for student in self._offline_students:
                if student['student_id'] == student_id:
                    # Return copy without face_encoding and attendance
                    result = student.copy()
                    result.pop('face_encoding', None)
                    result.pop('attendance', None)
                    return result
            return None

    def update_student_details(self, student_id, name, dept, year):
        if self.connected:
            res = self.students_collection.update_one({"student_id": student_id}, {"$set": {"name": name, "department": dept, "year": year}})
            return res.modified_count > 0
        else:
            # Offline mode
            for student in self._offline_students:
                if student['student_id'] == student_id:
                    student['name'] = name
                    student['department'] = dept
                    student['year'] = year
                    return True
            return False
        
    def update_face_encoding(self, student_id, new_face_encoding):
        if self.connected:
            result = self.students_collection.update_one(
                {"student_id": student_id},
                {"$set": {"face_encoding": new_face_encoding.tolist()}}
            )
            return result.modified_count > 0
        else:
            # Offline mode
            for student in self._offline_students:
                if student['student_id'] == student_id:
                    student['face_encoding'] = new_face_encoding.tolist()
                    return True
            return False

    def get_student_details(self, student_id):
        if self.connected:
            return self.students_collection.find_one({"student_id": student_id}, {"_id": 0, "name": 1, "department": 1, "year": 1, "attendance": 1})
        else:
            # Offline mode
            for student in self._offline_students:
                if student['student_id'] == student_id:
                    return {
                        'name': student['name'],
                        'department': student['department'],
                        'year': student['year'],
                        'attendance': student['attendance']
                    }
            return None

    def register_teacher(self, username, password, name=None):
        """Register a new teacher account"""
        if self.connected:
            if self.users_collection.find_one({"username": username}):
                return False, "Username already exists."
            
            hashed_password = pwd_context.hash(password)
            user_data = {
                "username": username, 
                "password": hashed_password, 
                "role": "teacher"
            }
            if name:
                user_data["name"] = name
                
            self.users_collection.insert_one(user_data)
            return True, "Teacher registered successfully."
        else:
            # Offline mode
            for user in self._offline_users:
                if user["username"] == username:
                    return False, "Username already exists."
            
            hashed_password = pwd_context.hash(password)
            user_data = {
                "username": username, 
                "password": hashed_password, 
                "role": "teacher"
            }
            if name:
                user_data["name"] = name
                
            self._offline_users.append(user_data)
            return True, "Teacher registered successfully (offline mode)."

    def update_user_profile(self, username, updates):
        """Update user profile information"""
        if self.connected:
            result = self.users_collection.update_one(
                {"username": username},
                {"$set": updates}
            )
            return result.modified_count > 0
        else:
            # Offline mode
            for user in self._offline_users:
                if user["username"] == username:
                    user.update(updates)
                    return True
            return False