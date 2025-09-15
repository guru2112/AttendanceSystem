import React from 'react';
import { Link } from 'react-router-dom';

function TeacherDashboard() {
  return (
    <div className="container">
      <div className="card">
        <h2>Teacher Dashboard</h2>
        <p>Welcome to the Face Recognition Attendance System. Select an option below:</p>
        
        <div className="grid">
          <div className="card">
            <h3>Student Management</h3>
            <p>Register new students and manage existing student records.</p>
            <Link to="/register-student" className="btn">
              Register Student
            </Link>
            <Link to="/update-student" className="btn" style={{ marginLeft: '10px' }}>
              Update Student
            </Link>
          </div>
          
          <div className="card">
            <h3>Attendance Management</h3>
            <p>Setup and conduct live attendance sessions.</p>
            <Link to="/attendance-setup" className="btn">
              Setup Attendance
            </Link>
            <Link to="/live-attendance" className="btn" style={{ marginLeft: '10px' }}>
              Live Attendance
            </Link>
          </div>
          
          <div className="card">
            <h3>Reports & Testing</h3>
            <p>View attendance reports and test face recognition functionality.</p>
            <Link to="/view-attendance" className="btn">
              View Attendance
            </Link>
            <Link to="/test-face-scan" className="btn" style={{ marginLeft: '10px' }}>
              Test Face Scan
            </Link>
          </div>
        </div>
        
        <div className="card" style={{ marginTop: '30px', background: '#3A3D42' }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link to="/register-student" className="btn btn-success">
              + Register New Student
            </Link>
            <Link to="/attendance-setup" className="btn btn-success">
              📋 Start Attendance Session
            </Link>
            <Link to="/view-attendance" className="btn">
              📊 View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;