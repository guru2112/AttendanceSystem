import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './utils/AuthContext';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ViewAttendance from './pages/ViewAttendance';
import RegisterStudent from './pages/RegisterStudent';
import MarkAttendance from './pages/MarkAttendance';

// Create custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#7B8BAB',
    },
    background: {
      default: '#16181A',
      paper: '#2A2D2E',
    },
    text: {
      primary: '#DCE4EE',
      secondary: '#7B8BAB',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'teacher' | 'student';
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main App component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Teacher routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/view-attendance"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <ViewAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/register-student"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <RegisterStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/mark-attendance"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <MarkAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/manage-students"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <ViewAttendance />
                </ProtectedRoute>
              }
            />

            {/* Student routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
