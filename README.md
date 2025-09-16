# Attendance System - Full-Stack Web Application

A complete face recognition attendance system built with FastAPI backend and Next.js frontend.

## Features

### Authentication & Role-Based Access Control
- JWT-based authentication system
- Two user roles: Student and Teacher
- Secure role-based access to different features

### Student Features
- Self-registration with face image upload
- Update personal information (name, department, year)
- View personal attendance records and statistics
- Secure access to own data only

### Teacher Features
- Search for students by ID
- Update any student's information
- View all attendance records with filtering options:
  - Filter by student ID, department, year, date, subject
- Conduct face recognition sessions for attendance
- Demo face recognition without saving data

### Face Recognition
- Real-time face detection and recognition
- Attendance marking with timestamp and session details
- Support for multiple faces in single image
- Demo mode for testing without affecting data

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **MongoDB** - Database for storing user and attendance data
- **OpenCV & face_recognition** - Face detection and recognition
- **JWT** - Token-based authentication
- **Pydantic** - Data validation and serialization

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **React 18** - Modern React with hooks and context
- **CSS3** - Responsive styling
- **Axios** - HTTP client for API communication

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Update MongoDB connection in `config.py`:
```python
MONGO_URI = "your-mongodb-connection-string"
```

3. Run the backend server:
```bash
# Simplified version (recommended for development)
python simple_app.py

# OR Full version with complete face recognition
python app.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Demo Accounts
- **Teacher:** username=`teacher`, password=`teacher123`
- **Student:** username=`student1`, password=`student1`

### Student Workflow
1. Register using the registration page with face image
2. Login with student ID and password
3. View and update personal information
4. Check attendance records and statistics

### Teacher Workflow
1. Login with teacher credentials
2. **View Attendance Tab:**
   - See all student attendance records
   - Apply filters by various criteria
3. **Manage Students Tab:**
   - Search for students by ID
   - Update student information
4. **Face Recognition Tab:**
   - Upload images for face recognition testing
   - Start attendance sessions with class details

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - Student registration

### Student Endpoints
- `GET /api/students/me` - Get own details
- `PUT /api/students/me` - Update own details
- `GET /api/attendance/me` - Get own attendance

### Teacher Endpoints
- `GET /api/students/{student_id}` - Get student by ID
- `PUT /api/students/{student_id}` - Update student details
- `GET /api/attendance/all` - Get all attendance (with filters)

### Face Recognition
- `POST /api/session/demo` - Demo face recognition
- `POST /api/session/start` - Start attendance session

### Health Check
- `GET /health` - API health status

## Screenshots

**Login Page:**
![Login Page](https://github.com/user-attachments/assets/11988896-04a7-4354-93e3-707119a2cdfe)

**Teacher Dashboard:**
![Teacher Dashboard](https://github.com/user-attachments/assets/74ffe98f-2184-48c4-966a-7d5eef47e4ca)

**Student Registration:**
![Registration Page](https://github.com/user-attachments/assets/990878cd-4d45-46d9-9255-4f08a6fafec7)

## Security Features

- JWT token-based authentication
- Role-based access control (RBAC)  
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- Secure file upload handling

## License

This project is for educational purposes. Please ensure compliance with privacy laws when using face recognition technology.