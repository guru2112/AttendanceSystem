# Face Recognition Attendance System

A modern full-stack web application for attendance tracking using facial recognition technology. Built with FastAPI (Python) backend and Next.js (React/TypeScript) frontend.

## Features

- **Face Recognition**: Advanced facial recognition using OpenCV and face_recognition library
- **Real-time Attendance**: Live webcam integration for marking attendance
- **User Management**: Add, update, and manage student profiles with photo uploads
- **Attendance Records**: View, filter, and export attendance data
- **Modern UI**: Responsive web interface built with Next.js and Tailwind CSS
- **REST API**: Comprehensive API for all attendance operations
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for building APIs
- **OpenCV**: Computer vision library for image processing
- **face_recognition**: Facial recognition library built on dlib
- **MTCNN**: Multi-task CNN for face detection
- **MongoDB**: NoSQL database for data persistence
- **Python 3.8+**: Core programming language

### Frontend
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Webcam**: Camera integration for real-time capture
- **Axios**: HTTP client for API communication

## Project Structure

```
AttendanceSystem/
├── backend/                     # Python FastAPI backend
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # MongoDB database operations
│   ├── face_recognition_service.py  # Face recognition logic
│   ├── config.py               # Configuration settings
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── page.tsx        # Home dashboard
│   │   │   ├── users/          # User management
│   │   │   ├── attendance/     # Attendance marking
│   │   │   └── records/        # Attendance records
│   │   ├── lib/
│   │   │   └── api.ts          # API service layer
│   │   └── components/         # Reusable components
│   ├── package.json            # Node.js dependencies
│   └── .env.local              # Environment variables
├── main.py                     # Original GUI application (legacy)
├── requirements.txt            # Original dependencies (legacy)
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/database-name
   ```

5. **Run the backend server:**
   ```bash
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Health & Status
- `GET /api/health` - Check API health status

### User Management
- `POST /api/add-user` - Add new student with face images
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student details
- `DELETE /api/students/{id}` - Delete student
- `PUT /api/students/{id}/face` - Update student face encoding

### Face Recognition
- `POST /api/recognize` - Recognize face from image

### Attendance
- `POST /api/mark-attendance` - Mark attendance for student
- `GET /api/attendance` - Get attendance records with filtering

## Usage Guide

### 1. Adding Students

1. Navigate to "Manage Users" from the dashboard
2. Click "Add Student" button
3. Fill in student details (ID, name, department, year)
4. Upload multiple photos of the student for better recognition accuracy
5. Click "Add Student" to save

### 2. Marking Attendance

1. Navigate to "Mark Attendance" from the dashboard
2. Configure attendance settings (subject, department, etc.)
3. Allow camera access when prompted
4. Use "Capture & Recognize" for single captures or "Start Auto-Capture" for continuous recognition
5. When a face is recognized, click "Mark Present" to record attendance

### 3. Viewing Records

1. Navigate to "Attendance Records" from the dashboard
2. Use filters to narrow down records by student, date, subject, etc.
3. Click "Apply Filters" to update the view
4. Use "Export CSV" to download attendance data

### 4. System Monitoring

The dashboard provides real-time status indicators for:
- Backend API connectivity
- Face recognition system status
- Current attendance statistics

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py` and corresponding logic in service files
2. **Frontend**: Create new pages in `src/app/` and update API service in `src/lib/api.ts`

### Database Schema

**Students Collection:**
```json
{
  "student_id": "string",
  "name": "string",
  "department": "string",
  "year": "string",
  "face_encoding": [float],
  "attendance": [
    {
      "date": "string",
      "timestamp": "datetime",
      "status": "Present",
      "subject": "string",
      "department": "string",
      "year": "string",
      "semester": "string",
      "class_div": "string"
    }
  ]
}
```

**Users Collection:**
```json
{
  "username": "string",
  "password": "hashed_string",
  "role": "student|teacher"
}
```

## Production Deployment

### Backend Deployment

1. Set up a production server (AWS EC2, DigitalOcean, etc.)
2. Install dependencies and configure environment variables
3. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
4. Set up reverse proxy with Nginx
5. Configure SSL certificates

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or your preferred hosting platform
3. Update environment variables with production API URL

## Troubleshooting

### Common Issues

1. **Camera not working**: Ensure HTTPS is used in production and camera permissions are granted
2. **Face recognition errors**: Check if images are clear and faces are visible
3. **API connection issues**: Verify backend is running and CORS is configured
4. **Database connection errors**: Check MongoDB connection string and network access

### Performance Optimization

1. **Face Recognition**: Use smaller image sizes for faster processing
2. **Database**: Index frequently queried fields
3. **Frontend**: Implement image compression for uploads
4. **Caching**: Add Redis for frequently accessed data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs` endpoint
- Review the troubleshooting section above

## Changelog

### v2.0.0 (Current)
- Full-stack web application with FastAPI and Next.js
- Real-time webcam integration
- Modern responsive UI
- Comprehensive attendance management

### v1.0.0 (Legacy)
- Desktop application with CustomTkinter
- Basic face recognition functionality
- MongoDB integration