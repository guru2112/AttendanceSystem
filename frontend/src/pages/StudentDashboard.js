import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

function StudentDashboard({ user }) {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentDetails();
  }, [user]);

  const fetchStudentDetails = async () => {
    try {
      const response = await apiService.getStudentDetails(user.username);
      if (response.success) {
        setStudentDetails(response.details);
      } else {
        setError(response.message || 'Failed to fetch student details');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch student details');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading student details...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Student Dashboard</h2>
        <p>Welcome to your personal attendance portal.</p>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        {studentDetails && (
          <div className="card" style={{ background: '#3A3D42' }}>
            <h3>Your Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <strong>Student ID:</strong> {studentDetails.student_id}
              </div>
              <div>
                <strong>Name:</strong> {studentDetails.name}
              </div>
              <div>
                <strong>Department:</strong> {studentDetails.department}
              </div>
              <div>
                <strong>Year:</strong> {studentDetails.year}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid">
          <div className="card">
            <h3>My Attendance</h3>
            <p>View your attendance records and statistics.</p>
            <Link to="/view-attendance" className="btn">
              View My Attendance
            </Link>
          </div>
          
          <div className="card">
            <h3>Face Recognition Test</h3>
            <p>Test if the system can recognize your face properly.</p>
            <Link to="/test-face-scan" className="btn">
              Test Face Recognition
            </Link>
          </div>
        </div>
        
        {studentDetails && studentDetails.attendance && (
          <div className="card" style={{ marginTop: '30px' }}>
            <h3>Recent Attendance Summary</h3>
            <p>Total Attendance Records: <strong>{studentDetails.attendance.length}</strong></p>
            
            {studentDetails.attendance.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Recent Records:</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {studentDetails.attendance.slice(-5).reverse().map((record, index) => (
                    <div key={index} style={{ 
                      padding: '10px', 
                      border: '1px solid #555', 
                      borderRadius: '5px', 
                      margin: '5px 0',
                      background: '#2D2F36'
                    }}>
                      <div><strong>Subject:</strong> {record.subject}</div>
                      <div><strong>Date:</strong> {record.date}</div>
                      <div><strong>Status:</strong> {record.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;