import React, { useState, useRef } from 'react';
import apiService from '../services/apiService';

function RegisterStudent() {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    department: '',
    year: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (error) {
      setMessage('Error accessing camera: ' + error.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!capturedImage) {
      setMessage('Please capture an image first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await apiService.registerStudent({
        ...formData,
        image_data: capturedImage
      });

      if (response.success) {
        setMessage('Student registered successfully!');
        setFormData({ student_id: '', name: '', department: '', year: '' });
        setCapturedImage(null);
        stopCamera();
      } else {
        setMessage('Registration failed: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Registration failed: ' + (error.message || 'Unknown error'));
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register New Student</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div>
              <div className="form-group">
                <label>Student ID:</label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter student ID"
                />
              </div>
              
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
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
            </div>
            
            <div>
              <h3>Capture Face Photo</h3>
              
              <div className="video-container">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    display: cameraActive ? 'block' : 'none' 
                  }}
                />
                
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    style={{ 
                      width: '100%', 
                      maxWidth: '400px',
                      marginTop: '10px'
                    }}
                  />
                )}
              </div>
              
              <div className="camera-controls">
                {!cameraActive ? (
                  <button type="button" className="btn" onClick={startCamera}>
                    Start Camera
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn" onClick={captureImage}>
                      Capture Image
                    </button>
                    <button type="button" className="btn btn-danger" onClick={stopCamera}>
                      Stop Camera
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </form>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default RegisterStudent;