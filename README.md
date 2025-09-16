# Face Recognition Attendance System

## Overview
This is a complete Face Recognition Attendance System built with Python, CustomTkinter for the GUI, and MongoDB for data storage. The system supports role-based access control for teachers and students, with comprehensive attendance management and face recognition capabilities.

## Features

### Core Functionality
- **Role-Based Authentication**: Separate login/registration for Teachers and Students
- **Face Recognition**: Real-time face detection and recognition for attendance marking
- **Attendance Management**: Complete CRUD operations for attendance records
- **Student Management**: Registration, profile updates, and face encoding management
- **Offline Mode**: Fallback functionality when database connection is unavailable
- **Simulation Mode**: Testing mode for environments without face recognition dependencies

### Teacher Features
- Register new students with face capture
- Search and update student details
- Start live attendance sessions
- View and filter all attendance records
- Update student face encodings

### Student Features
- Update personal profile information
- View personal attendance history
- Test face recognition (demo mode)
- Update face encoding

## Technical Architecture

### Database Schema
- **Users Collection**: Stores user credentials and roles
- **Students Collection**: Stores student details, face encodings, and attendance records

### Key Components
1. **main.py**: Application entry point and main window management
2. **database.py**: MongoDB operations with offline fallback
3. **face_recognition_logic.py**: Face detection and recognition with simulation mode
4. **pages/**: GUI components organized by functionality
   - `auth_pages.py`: Login and registration pages
   - `dashboard_pages.py`: Role-specific dashboards
   - `attendance_pages.py`: Attendance management
   - `registration_page.py`: Student registration with face capture
   - `update_pages.py`: Profile and face encoding updates
   - `gui_components.py`: Reusable UI components

## Configuration

### Environment Variables
- `MONGO_URI`: MongoDB connection string (recommended to use repository secrets)

### Dependencies
```
pymongo[srv]
passlib
bcrypt==3.2.0
customtkinter
opencv-python
face_recognition
Pillow
numpy
mtcnn
tensorflow
```

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Set up MongoDB Atlas**:
   - Create a MongoDB Atlas cluster
   - Add your IP to the whitelist
   - Set the `MONGO_URI` environment variable with your connection string
4. **Run the application**: `python main.py`

## Default Credentials
- **Teacher**: Username: `teacher`, Password: `teacher123`

## Offline Mode
The system automatically detects when MongoDB is unavailable and switches to offline mode:
- All data operations work in-memory
- Face recognition uses simulation mode
- Data is not persisted when in offline mode
- Perfect for testing and development

## Face Recognition Modes

### Production Mode
- Uses MTCNN for face detection
- Uses face_recognition library for encoding and matching
- Real face capture and recognition

### Simulation Mode
- Activated when face recognition dependencies are unavailable
- Generates fake face locations and encodings
- Useful for testing UI and logic without ML dependencies

## Security Features
- Password hashing using bcrypt
- Role-based access control
- Session management
- Input validation and error handling

## Error Handling
- Graceful degradation to offline mode
- Comprehensive error messages
- Fallback mechanisms for missing dependencies
- Proper resource cleanup (camera, database connections)

## Future Enhancements
- Email notifications for attendance
- Export attendance reports
- Advanced filtering options
- Multi-class session support
- Real-time attendance dashboard
- Mobile app integration

## Troubleshooting

### Common Issues
1. **MongoDB Connection Failed**: Check network connectivity and URI configuration
2. **Camera Not Working**: Ensure camera permissions and proper OpenCV installation
3. **Face Recognition Errors**: Install dlib and face_recognition dependencies
4. **GUI Not Displaying**: Ensure tkinter is properly installed

### Development Tips
- Use offline mode for development without MongoDB setup
- Test face recognition with simulation mode first
- Check logs for detailed error information
- Use the built-in test functionality to verify components