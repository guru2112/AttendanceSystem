import face_recognition
import cv2
import numpy as np
from mtcnn import MTCNN
from typing import List, Tuple, Optional, Dict, Any
import io
from PIL import Image

class FaceRecognition:
    def __init__(self, db_manager):
        self.db_manager = db_manager
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_face_ids = []
        self.detector = MTCNN()
        self.load_known_faces()

    def load_known_faces(self):
        """Load all known faces from database"""
        encodings, names, ids = self.db_manager.get_all_student_data()
        self.known_face_encodings = [np.array(encoding) for encoding in encodings]
        self.known_face_names = names
        self.known_face_ids = ids
        print(f"Known faces loaded: {len(self.known_face_encodings)} faces ready.")

    def _get_face_locations(self, frame):
        """Get face locations using MTCNN"""
        face_locations_mtcnn = self.detector.detect_faces(frame)
        face_locations_dlib = []
        for face in face_locations_mtcnn:
            x, y, width, height = face['box']
            top, right, bottom, left = y, x + width, y + height, x
            face_locations_dlib.append((top, right, bottom, left))
        return face_locations_dlib

    def encode_face_from_image(self, image_data: bytes) -> Optional[List[float]]:
        """Extract face encoding from image data"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            # Convert to numpy array
            image_array = np.array(image)
            
            # Get face locations
            face_locations = self._get_face_locations(image_array)
            
            if not face_locations:
                return None
                
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            
            if face_encodings:
                return face_encodings[0].tolist()
            return None
            
        except Exception as e:
            print(f"Error encoding face: {e}")
            return None

    def encode_faces_from_multiple_images(self, images_data: List[bytes]) -> Optional[List[float]]:
        """Extract and average face encodings from multiple images"""
        encodings = []
        
        for image_data in images_data:
            encoding = self.encode_face_from_image(image_data)
            if encoding:
                encodings.append(np.array(encoding))
        
        if not encodings:
            return None
            
        # Average the encodings for better accuracy
        averaged_encoding = np.mean(encodings, axis=0)
        return averaged_encoding.tolist()

    def recognize_face_from_image(self, image_data: bytes) -> Dict[str, Any]:
        """Recognize face from image data"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image_array = np.array(image)
            
            # Get face locations and encodings
            face_locations = self._get_face_locations(image_array)
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            
            results = []
            
            for i, face_encoding in enumerate(face_encodings):
                name = "Unknown"
                student_id = None
                confidence = 0.0
                
                if len(self.known_face_encodings) > 0:
                    # Compare faces
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    
                    if len(face_distances) > 0:
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = self.known_face_names[best_match_index]
                            student_id = self.known_face_ids[best_match_index]
                            confidence = 1 - face_distances[best_match_index]  # Convert distance to confidence
                
                # Get face location for this recognition
                face_location = face_locations[i] if i < len(face_locations) else None
                
                results.append({
                    "name": name,
                    "student_id": student_id,
                    "confidence": float(confidence),
                    "face_location": face_location
                })
            
            return {
                "faces_detected": len(face_locations),
                "recognitions": results
            }
            
        except Exception as e:
            print(f"Error recognizing face: {e}")
            return {
                "faces_detected": 0,
                "recognitions": [],
                "error": str(e)
            }

    def process_frame_for_demo(self, frame):
        """Process frame for demo purposes (read-only)"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = self._get_face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        recognized_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
            name = "Unknown"
            
            if len(self.known_face_encodings) > 0:
                face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                if len(face_distances) > 0:
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]
            recognized_names.append(name)

        # Draw rectangles and names on frame
        for (top, right, bottom, left), name in zip(face_locations, recognized_names):
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)
        
        return frame, recognized_names