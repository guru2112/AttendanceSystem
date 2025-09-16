# face_recognition_logic.py

import numpy as np
import cv2

try:
    import face_recognition
    from mtcnn import MTCNN
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    print("WARNING: Face recognition dependencies not available. Running in simulation mode.")
    FACE_RECOGNITION_AVAILABLE = False

class FaceRecognition:
    def __init__(self, db_manager):
        self.db_manager = db_manager
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_face_ids = []
        self.marked_today = set()
        
        if FACE_RECOGNITION_AVAILABLE:
            self.detector = MTCNN()
        else:
            self.detector = None
            
        self.load_known_faces()

    def load_known_faces(self):
        encodings, names, ids = self.db_manager.get_all_student_data()
        self.known_face_encodings = [np.array(encoding) for encoding in encodings]
        self.known_face_names = names
        self.known_face_ids = ids
        print(f"Known faces loaded and ready: {len(names)} students registered.")

    def _get_face_locations(self, frame):
        if not FACE_RECOGNITION_AVAILABLE:
            # Simulation mode - return fake face location for testing
            height, width = frame.shape[:2]
            return [(int(height*0.2), int(width*0.7), int(height*0.8), int(width*0.3))]
            
        face_locations_mtcnn = self.detector.detect_faces(frame)
        face_locations_dlib = []
        for face in face_locations_mtcnn:
            x, y, width, height = face['box']
            top, right, bottom, left = y, x + width, y + height, x
            face_locations_dlib.append((top, right, bottom, left))
        return face_locations_dlib

    def process_frame_for_attendance(self, frame, attendance_details):
        if not FACE_RECOGNITION_AVAILABLE:
            return self._process_frame_simulation(frame, attendance_details, mark_attendance=True)
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = self._get_face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        recognized_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
            name, student_id = "Unknown", None

            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.known_face_names[best_match_index]
                    student_id = self.known_face_ids[best_match_index]
                    
                    session_key = (student_id, attendance_details['subject'])
                    if session_key not in self.marked_today:
                        result = self.db_manager.mark_attendance(student_id, attendance_details)
                        print(result)
                        self.marked_today.add(session_key)
            recognized_names.append(name)

        for (top, right, bottom, left), name in zip(face_locations, recognized_names):
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)
        return frame, recognized_names

    def process_frame_for_demo(self, frame):
        """A safe, read-only version of recognition for testing."""
        if not FACE_RECOGNITION_AVAILABLE:
            return self._process_frame_simulation(frame, None, mark_attendance=False)
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = self._get_face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        recognized_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
            name = "Unknown"
            
            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.known_face_names[best_match_index]
            recognized_names.append(name)

        for (top, right, bottom, left), name in zip(face_locations, recognized_names):
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)
        return frame, recognized_names
    
    def _process_frame_simulation(self, frame, attendance_details=None, mark_attendance=False):
        """Simulation mode for when face recognition dependencies are not available"""
        face_locations = self._get_face_locations(frame)
        recognized_names = []
        
        # Simulate recognition of the first student if any are registered
        if self.known_face_names and face_locations:
            name = self.known_face_names[0]  # Simulate recognizing first student
            student_id = self.known_face_ids[0]
            
            if mark_attendance and attendance_details:
                session_key = (student_id, attendance_details['subject'])
                if session_key not in self.marked_today:
                    result = self.db_manager.mark_attendance(student_id, attendance_details)
                    print(f"[SIMULATION] {result}")
                    self.marked_today.add(session_key)
            
            recognized_names.append(name)
        else:
            recognized_names.append("Unknown")

        # Draw rectangles on detected faces
        for (top, right, bottom, left), name in zip(face_locations, recognized_names):
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
            cv2.putText(frame, f"{name} [SIM]", (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)
        
        return frame, recognized_names