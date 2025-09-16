// pages/register.js - Student registration page

import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '../lib/api';
import Layout from '../components/Layout';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    department: '',
    year: ''
  });
  const [faceImage, setFaceImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFaceImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!faceImage) {
      setError('Please upload a face image');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.register({
        ...formData,
        face_image: faceImage
      });
      
      setSuccess('Registration successful! You can now login with your Student ID.');
      setFormData({
        student_id: '',
        name: '',
        department: '',
        year: ''
      });
      setFaceImage('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
          <h1 className="text-center mb-4">Student Registration</h1>
          
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                name="student_id"
                className="form-input"
                value={formData.student_id}
                onChange={handleInputChange}
                required
                placeholder="Enter your student ID"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleInputChange}
                required
                placeholder="Enter your department"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Face Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleImageUpload}
                required
              />
              {faceImage && (
                <div className="mt-4 text-center">
                  <img 
                    src={faceImage} 
                    alt="Face preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="btn"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/')}
              className="btn btn-secondary"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}