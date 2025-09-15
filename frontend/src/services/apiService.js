import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const apiService = {
  // Students
  registerStudent: async (studentData) => {
    try {
      const response = await api.post('/api/students/register', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  getStudent: async (studentId) => {
    try {
      const response = await api.get(`/api/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student' };
    }
  },

  getStudentDetails: async (studentId) => {
    try {
      const response = await api.get(`/api/students/${studentId}/details`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student details' };
    }
  },

  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/api/students/${studentId}/update`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Update failed' };
    }
  },

  updateStudentFace: async (studentId, imageData) => {
    try {
      const response = await api.put(`/api/students/${studentId}/face`, { image_data: imageData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Face update failed' };
    }
  },

  // Attendance
  setupAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/api/attendance/setup', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Attendance setup failed' };
    }
  },

  processFrame: async (imageData) => {
    try {
      const response = await api.post('/api/attendance/process-frame', { image_data: imageData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Frame processing failed' };
    }
  },

  processDemoFrame: async (imageData) => {
    try {
      const response = await api.post('/api/attendance/demo-frame', { image_data: imageData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Demo processing failed' };
    }
  },

  viewAttendance: async (filters) => {
    try {
      const response = await api.post('/api/attendance/view', filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance' };
    }
  },

  reloadFaces: async () => {
    try {
      const response = await api.post('/api/attendance/reload-faces');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reload faces' };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Health check failed' };
    }
  }
};

export default apiService;