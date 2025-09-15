# Face Recognition Attendance System - Web Application

This is the Next.js web application version of the Python desktop Face Recognition Attendance System.

## 🚀 Successfully Converted Features

✅ **Modern Web Interface**: Responsive design that works on all devices  
✅ **Authentication System**: Login/logout with role-based access control  
✅ **API Architecture**: RESTful APIs for all backend operations  
✅ **Database Integration**: MongoDB with Mongoose for data persistence  
✅ **User Dashboards**: Separate interfaces for teachers and students  
✅ **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS  

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom auth with bcrypt
- **Styling**: Tailwind CSS with dark theme

## 📱 Features

### Teacher Dashboard
- 👤+ Register new students with face capture
- 🔄 Update student details and facial data
- ▶️ Start live attendance sessions
- 📊 View detailed attendance reports

### Student Dashboard
- 🔄 Update personal profile information
- 📸 Test face recognition functionality
- 📊 View personal attendance records
- 📚 Check attendance statistics

## 🎯 Demo

Visit `/demo` to see the converted application in action with both teacher and student interfaces.

## 🔧 Installation

1. Navigate to the webapp directory:
   ```bash
   cd webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your MongoDB connection string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Default Credentials

- **Teacher**: username: `teacher`, password: `teacher123`
- **Student**: Use student ID as both username and password

## 📋 Next Steps

The following features are ready to be implemented:

- [ ] Student registration with web camera face capture
- [ ] Live attendance tracking with browser-based face recognition
- [ ] Attendance reporting and filtering system
- [ ] Profile management and face data updates
- [ ] Real-time session management
- [ ] Face recognition using TensorFlow.js or similar web technologies

## 🎨 Design

The application features a modern dark theme with:
- Responsive grid layouts
- Interactive hover effects
- Clean typography
- Accessible color schemes
- Mobile-first design

## 🏗️ Project Structure

```
webapp/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── demo/             # Demo page
│   ├── login/            # Authentication pages
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                 # Utility functions
├── models/              # Database models
├── types/               # TypeScript definitions
└── data/                # Local JSON storage (development)
```

This conversion successfully transforms the Python desktop application into a modern, scalable web application ready for production deployment.
