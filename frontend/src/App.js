import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RegisterStudent from './pages/RegisterStudent';
import AttendanceSetup from './pages/AttendanceSetup';
import LiveAttendance from './pages/LiveAttendance';
import ViewAttendance from './pages/ViewAttendance';
import TestFaceScan from './pages/TestFaceScan';
import UpdateStudent from './pages/UpdateStudent';
import authService from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await authService.checkAuth();
      if (authStatus.authenticated) {
        setUser(authStatus.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              !user ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
              )
            } 
          />
          
          <Route 
            path="/teacher" 
            element={
              user && user.role === 'teacher' ? (
                <TeacherDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/student" 
            element={
              user && user.role === 'student' ? (
                <StudentDashboard user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/register-student" 
            element={
              user && user.role === 'teacher' ? (
                <RegisterStudent />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/attendance-setup" 
            element={
              user && user.role === 'teacher' ? (
                <AttendanceSetup />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/live-attendance" 
            element={
              user && user.role === 'teacher' ? (
                <LiveAttendance />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/view-attendance" 
            element={
              user ? (
                <ViewAttendance userRole={user.role} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/test-face-scan" 
            element={
              user ? (
                <TestFaceScan />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/update-student" 
            element={
              user && user.role === 'teacher' ? (
                <UpdateStudent />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;