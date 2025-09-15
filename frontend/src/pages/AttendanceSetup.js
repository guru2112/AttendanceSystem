import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

function AttendanceSetup() {
  const [formData, setFormData] = useState({
    subject: '',
    department: '',
    year: '',
    semester: '',
    class_div: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiService.setupAttendance(formData);
      if (response.success) {
        setMessage('Attendance setup successful! Redirecting to live attendance...');
        setTimeout(() => {
          navigate('/live-attendance');
        }, 2000);
      } else {
        setMessage('Setup failed: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Setup failed: ' + (error.message || 'Unknown error'));
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Setup Attendance Session</h2>
        <p>Configure the details for the attendance session.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Enter subject name"
              />
            </div>
            
            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                placeholder="Enter department"
              />
            </div>
            
            <div className="form-group">
              <label>Year:</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Semester:</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Class Division:</label>
              <input
                type="text"
                name="class_div"
                value={formData.class_div}
                onChange={handleInputChange}
                required
                placeholder="Enter class division (e.g., A, B, C)"
              />
            </div>
          </div>
          
          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Setting up...' : 'Setup Attendance Session'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AttendanceSetup;