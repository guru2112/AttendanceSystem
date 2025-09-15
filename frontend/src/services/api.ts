// services/api.ts

import axios from 'axios';
import { 
  User, 
  Student, 
  AttendanceRecord, 
  LoginCredentials, 
  StudentRegistration, 
  AttendanceDetails,
  AttendanceFilters
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Students API
export const studentsAPI = {
  getAll: async (): Promise<{ students: Student[] }> => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (studentId: string): Promise<{ student: Student }> => {
    const response = await api.get(`/students/${studentId}`);
    return response.data;
  },

  update: async (studentId: string, data: Partial<Student>): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/students/${studentId}`, data);
    return response.data;
  },

  register: async (studentData: StudentRegistration): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/register/student', studentData);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getFiltered: async (filters: AttendanceFilters = {}): Promise<{ attendance: AttendanceRecord[] }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/attendance?${params.toString()}`);
    return response.data;
  },

  mark: async (attendanceData: AttendanceDetails): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/attendance/mark', attendanceData);
    return response.data;
  },
};

// Health check API
export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;