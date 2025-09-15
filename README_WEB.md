# Attendance System - Web Application

This project has been refactored from a desktop application using CustomTkinter to a modern web application with a React frontend and Flask backend.

## Architecture

### Backend (Flask API)
- **Location**: `backend/`
- **Technology**: Flask, Python
- **Features**: REST API, Session management, Face recognition, Database operations

### Frontend (React App)
- **Location**: `frontend/`
- **Technology**: React, React Router, Axios
- **Features**: Responsive UI, Camera integration, Real-time updates

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB Atlas account (or local MongoDB)
- Webcam for face recognition

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure MongoDB:
   - Update `config.py` in the root directory with your MongoDB connection string
   - The default teacher account will be created automatically:
     - Username: `teacher`
     - Password: `teacher123`

4. Start the Flask server:
   ```bash
   python app.py
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

4. For production build:
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Students
- `POST /api/students/register` - Register new student
- `GET /api/students/<id>` - Get student info
- `PUT /api/students/<id>/update` - Update student details
- `PUT /api/students/<id>/face` - Update face encoding

### Attendance
- `POST /api/attendance/setup` - Setup attendance session
- `POST /api/attendance/process-frame` - Process camera frame
- `POST /api/attendance/view` - View attendance records
- `POST /api/attendance/reload-faces` - Reload face encodings

## Features

### Teacher Features
- Register new students with face capture
- Setup attendance sessions
- Conduct live face recognition attendance
- View and filter attendance reports
- Update student information
- Test face recognition system

### Student Features
- View personal attendance records
- Test face recognition
- View profile information

## Usage

1. **Login**: Use the default teacher credentials or student ID
2. **Register Students**: Teachers can register students with face photos
3. **Setup Attendance**: Configure class details for attendance sessions
4. **Live Attendance**: Use camera to mark attendance automatically
5. **View Reports**: Filter and view attendance records

## Development

### Adding New Features

1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Add components in `frontend/src/components/` or pages in `frontend/src/pages/`
3. **API Integration**: Update `frontend/src/services/apiService.js`

### File Structure

```
├── backend/
│   ├── app.py              # Main Flask application
│   ├── routes/             # API route handlers
│   │   ├── auth.py         # Authentication routes
│   │   ├── students.py     # Student management routes
│   │   └── attendance.py   # Attendance routes
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API service functions
│   └── package.json        # Node.js dependencies
├── config.py               # Configuration (MongoDB URI)
├── database.py             # Database operations
├── face_recognition_logic.py # Face recognition logic
└── main.py                 # Original desktop application
```

## Troubleshooting

1. **Camera Access**: Ensure your browser has camera permissions
2. **CORS Issues**: The backend includes CORS configuration for development
3. **Dependencies**: Some face recognition dependencies may require additional system libraries
4. **MongoDB Connection**: Verify your MongoDB Atlas connection string in `config.py`

## Migration from Desktop App

The original desktop application files are preserved:
- `main.py` - Original CustomTkinter application
- `pages/` - Original GUI pages
- Core logic in `database.py` and `face_recognition_logic.py` is reused

## Production Deployment

1. Build the React frontend: `npm run build`
2. The Flask backend serves the built React app from `/`
3. Configure environment variables for production
4. Use a production WSGI server like Gunicorn
5. Set up proper MongoDB security and networking