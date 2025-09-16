// pages/student.js - Student Dashboard

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { apiClient } from '../lib/api';
import Layout from '../components/Layout';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: '',
    department: '',
    year: ''
  });
  
  const { user, isAuthenticated, isStudent } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    if (!isStudent) {
      router.push('/teacher');
      return;
    }
    
    fetchStudentData();
    fetchAttendance();
  }, [isAuthenticated, isStudent, router]);

  const fetchStudentData = async () => {
    try {
      const data = await apiClient.getMyDetails();
      setStudentData(data);
      setUpdateData({
        name: data.name,
        department: data.department,
        year: data.year
      });
    } catch (error) {
      setError('Failed to load student data');
    }
  };

  const fetchAttendance = async () => {
    try {
      const data = await apiClient.getMyAttendance();
      setAttendance(data.attendance);
    } catch (error) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.updateMyDetails(updateData);
      setStudentData({ ...studentData, ...updateData });
      setEditMode(false);
      setError('');
    } catch (error) {
      setError('Failed to update details');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <h1>Student Dashboard</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="grid">
          <div className="card">
            <h2>Personal Information</h2>
            {!editMode ? (
              <div>
                <p><strong>Student ID:</strong> {studentData?.student_id}</p>
                <p><strong>Name:</strong> {studentData?.name}</p>
                <p><strong>Department:</strong> {studentData?.department}</p>
                <p><strong>Year:</strong> {studentData?.year}</p>
                <button 
                  onClick={() => setEditMode(true)}
                  className="btn mt-4"
                >
                  Edit Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={updateData.name}
                    onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={updateData.department}
                    onChange={(e) => setUpdateData({...updateData, department: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select
                    className="form-input"
                    value={updateData.year}
                    onChange={(e) => setUpdateData({...updateData, year: e.target.value})}
                    required
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn">Save</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="card">
            <h2>Attendance Statistics</h2>
            <p><strong>Total Classes:</strong> {attendance.length}</p>
            <p><strong>Present:</strong> {attendance.filter(a => a.status === 'Present').length}</p>
            <p><strong>Attendance Rate:</strong> {
              attendance.length > 0 
                ? ((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100).toFixed(1) + '%'
                : '0%'
            }</p>
          </div>
        </div>
        
        <div className="card">
          <h2>Attendance Records</h2>
          {attendance.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.subject}</td>
                    <td>
                      <span style={{ 
                        color: record.status === 'Present' ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}