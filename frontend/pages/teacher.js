// pages/teacher.js - Teacher Dashboard

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { apiClient } from '../lib/api';
import Layout from '../components/Layout';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Student search
  const [searchId, setSearchId] = useState('');
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  
  // Attendance data
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filters, setFilters] = useState({
    student_id: '',
    department: '',
    year: '',
    date: '',
    subject: ''
  });
  
  // Face recognition
  const [sessionData, setSessionData] = useState({
    subject: '',
    department: '',
    year: '',
    semester: '',
    class_div: ''
  });
  const [capturedImage, setCapturedImage] = useState('');
  
  const { user, isAuthenticated, isTeacher } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    if (!isTeacher) {
      router.push('/student');
      return;
    }
    
    fetchAttendanceRecords();
  }, [isAuthenticated, isTeacher, router]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllAttendance(filters);
      setAttendanceRecords(data.attendance);
    } catch (error) {
      setError('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const searchStudent = async () => {
    if (!searchId.trim()) return;
    
    try {
      setLoading(true);
      const student = await apiClient.getStudentById(searchId);
      setSearchedStudent(student);
      setEditStudent({ ...student });
      setError('');
    } catch (error) {
      setError('Student not found');
      setSearchedStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async () => {
    try {
      await apiClient.updateStudentById(editStudent.student_id, {
        name: editStudent.name,
        department: editStudent.department,
        year: editStudent.year
      });
      setSearchedStudent({ ...editStudent });
      setError('');
      alert('Student updated successfully!');
    } catch (error) {
      setError('Failed to update student');
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAttendanceSession = async () => {
    if (!capturedImage) {
      setError('Please capture an image first');
      return;
    }
    
    try {
      setLoading(true);
      const result = await apiClient.startAttendanceSession(sessionData, capturedImage);
      alert(`Attendance session completed! ${result.attendance_marked} students marked present.`);
      setCapturedImage('');
      fetchAttendanceRecords(); // Refresh attendance data
    } catch (error) {
      setError('Failed to start attendance session');
    } finally {
      setLoading(false);
    }
  };

  const demoFaceRecognition = async () => {
    if (!capturedImage) {
      setError('Please capture an image first');
      return;
    }
    
    try {
      setLoading(true);
      const result = await apiClient.demoFaceRecognition(capturedImage);
      alert(`Demo completed! Recognized: ${result.recognized_names.join(', ')}`);
    } catch (error) {
      setError('Failed to run demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Teacher Dashboard</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        {/* Navigation Tabs */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            className={`btn ${activeTab === 'attendance' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('attendance')}
            style={{ marginRight: '10px' }}
          >
            View Attendance
          </button>
          <button 
            className={`btn ${activeTab === 'students' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('students')}
            style={{ marginRight: '10px' }}
          >
            Manage Students
          </button>
          <button 
            className={`btn ${activeTab === 'recognition' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('recognition')}
          >
            Face Recognition
          </button>
        </div>

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="card">
            <h2>Attendance Records</h2>
            
            {/* Filters */}
            <div className="grid" style={{ marginBottom: '20px' }}>
              <input
                className="form-input"
                placeholder="Student ID"
                value={filters.student_id}
                onChange={(e) => setFilters({...filters, student_id: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Department"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Year"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              />
              <input
                type="date"
                className="form-input"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Subject"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
              />
              <button onClick={fetchAttendanceRecords} className="btn">
                Apply Filters
              </button>
            </div>
            
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.student_id}</td>
                      <td>{record.name}</td>
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
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="card">
            <h2>Search & Manage Students</h2>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                className="form-input"
                placeholder="Enter Student ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={searchStudent} className="btn" disabled={loading}>
                Search
              </button>
            </div>
            
            {searchedStudent && (
              <div>
                <h3>Student Details</h3>
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input
                    className="form-input"
                    value={editStudent?.student_id || ''}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    value={editStudent?.name || ''}
                    onChange={(e) => setEditStudent({...editStudent, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    className="form-input"
                    value={editStudent?.department || ''}
                    onChange={(e) => setEditStudent({...editStudent, department: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select
                    className="form-input"
                    value={editStudent?.year || ''}
                    onChange={(e) => setEditStudent({...editStudent, year: e.target.value})}
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <button onClick={updateStudent} className="btn">
                  Update Student
                </button>
              </div>
            )}
          </div>
        )}

        {/* Face Recognition Tab */}
        {activeTab === 'recognition' && (
          <div className="card">
            <h2>Face Recognition</h2>
            
            <div className="form-group">
              <label className="form-label">Capture Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleImageCapture}
              />
              {capturedImage && (
                <div className="mt-4 text-center">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    style={{ maxWidth: '400px', maxHeight: '300px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={demoFaceRecognition} className="btn btn-secondary" disabled={loading}>
                Demo Recognition
              </button>
            </div>
            
            <h3>Start Attendance Session</h3>
            <div className="grid">
              <input
                className="form-input"
                placeholder="Subject"
                value={sessionData.subject}
                onChange={(e) => setSessionData({...sessionData, subject: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Department"
                value={sessionData.department}
                onChange={(e) => setSessionData({...sessionData, department: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Year"
                value={sessionData.year}
                onChange={(e) => setSessionData({...sessionData, year: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Semester"
                value={sessionData.semester}
                onChange={(e) => setSessionData({...sessionData, semester: e.target.value})}
              />
              <input
                className="form-input"
                placeholder="Class Division"
                value={sessionData.class_div}
                onChange={(e) => setSessionData({...sessionData, class_div: e.target.value})}
              />
            </div>
            
            <button onClick={startAttendanceSession} className="btn mt-4" disabled={loading}>
              Start Attendance Session
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}