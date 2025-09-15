import React, { useState } from 'react';
import apiService from '../services/apiService';

function ViewAttendance({ userRole }) {
  const [filters, setFilters] = useState({
    student_id: '',
    department: '',
    year: '',
    date: '',
    subject: '',
    semester: '',
    class_div: ''
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );

    try {
      const response = await apiService.viewAttendance(cleanFilters);
      if (response.success) {
        setAttendanceData(response.attendance);
        if (response.attendance.length === 0) {
          setMessage('No attendance records found for the given criteria.');
        }
      } else {
        setMessage('Failed to fetch attendance: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Error fetching attendance: ' + (error.message || 'Unknown error'));
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>View Attendance Records</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group">
              <label>Student ID:</label>
              <input
                type="text"
                name="student_id"
                value={filters.student_id}
                onChange={handleInputChange}
                placeholder="Filter by student ID"
              />
            </div>
            
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={filters.department}
                onChange={handleInputChange}
                placeholder="Filter by department"
              />
            </div>
            
            <div className="form-group">
              <label>Year:</label>
              <select
                name="year"
                value={filters.year}
                onChange={handleInputChange}
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={filters.subject}
                onChange={handleInputChange}
                placeholder="Filter by subject"
              />
            </div>
            
            <div className="form-group">
              <label>Semester:</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleInputChange}
              >
                <option value="">All Semesters</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Searching...' : 'Search Attendance'}
          </button>
        </form>
        
        {message && (
          <div className={`alert ${attendanceData.length > 0 ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}
        
        {attendanceData.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Attendance Records ({attendanceData.length} found)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#3A3D42' }}>
                    <th style={{ padding: '10px', border: '1px solid #555' }}>Student ID</th>
                    <th style={{ padding: '10px', border: '1px solid #555' }}>Name</th>
                    <th style={{ padding: '10px', border: '1px solid #555' }}>Subject</th>
                    <th style={{ padding: '10px', border: '1px solid #555' }}>Date</th>
                    <th style={{ padding: '10px', border: '1px solid #555' }}>Semester</th>
                    <th style={{ padding: '10px', border: '1px solid #555' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px', border: '1px solid #555' }}>{record.student_id}</td>
                      <td style={{ padding: '10px', border: '1px solid #555' }}>{record.name}</td>
                      <td style={{ padding: '10px', border: '1px solid #555' }}>{record.subject}</td>
                      <td style={{ padding: '10px', border: '1px solid #555' }}>{record.date}</td>
                      <td style={{ padding: '10px', border: '1px solid #555' }}>{record.semester}</td>
                      <td style={{ padding: '10px', border: '1px solid #555' }}>
                        <span style={{ 
                          color: record.status === 'Present' ? '#28a745' : '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAttendance;