// pages/RegisterStudent.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
} from '@mui/material';
import {
  PersonAdd,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentsAPI } from '../services/api';
import { StudentRegistration } from '../types';

const RegisterStudent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentRegistration>({
    student_id: '',
    name: '',
    department: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology',
    'Biotechnology',
  ];

  const years = ['1', '2', '3', '4'];

  const handleInputChange = (field: keyof StudentRegistration, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await studentsAPI.register(formData);
      setSuccess(response.message);
      
      // Reset form after successful registration
      setFormData({
        student_id: '',
        name: '',
        department: '',
        year: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.student_id && formData.name && formData.department && formData.year;
  };

  return (
    <Layout title="Register Student">
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/teacher/dashboard')}
            sx={{ mb: 2, color: '#4A90E2' }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Register New Student
          </Typography>
          <Typography variant="body1" sx={{ color: '#7B8BAB' }}>
            Add a new student to the attendance system
          </Typography>
        </Box>

        {/* Registration Form */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonAdd sx={{ mr: 2, color: '#4A90E2', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Student Information
                  </Typography>
                </Box>

                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mb: 3,
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      '& .MuiAlert-icon': { color: '#4CAF50' }
                    }}
                  >
                    {success}
                  </Alert>
                )}

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                      color: '#f44336',
                      '& .MuiAlert-icon': { color: '#f44336' }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Student ID *"
                        variant="outlined"
                        value={formData.student_id}
                        onChange={(e) => handleInputChange('student_id', e.target.value)}
                        placeholder="e.g., CS2021001"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: '#4A90E2' },
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiInputBase-input': { color: '#DCE4EE' },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., John Doe"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused fieldset': { borderColor: '#4A90E2' },
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiInputBase-input': { color: '#DCE4EE' },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department *</InputLabel>
                        <Select
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            color: '#DCE4EE',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                          }}
                        >
                          {departments.map((dept) => (
                            <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Year *</InputLabel>
                        <Select
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', e.target.value)}
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            color: '#DCE4EE',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                          }}
                        >
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>Year {year}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={!isFormValid() || loading}
                      sx={{
                        bgcolor: '#4A90E2',
                        '&:hover': { bgcolor: '#357ABD' },
                        '&.Mui-disabled': { bgcolor: 'rgba(74, 144, 226, 0.3)' },
                        px: 4,
                      }}
                    >
                      {loading ? 'Registering...' : 'Register Student'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/teacher/dashboard')}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: '#DCE4EE',
                        '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Registration Notes
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB', lineHeight: 1.6, mb: 2 }}>
                • Student ID should be unique and follow your institution's format
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB', lineHeight: 1.6, mb: 2 }}>
                • A default password will be created using the Student ID
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB', lineHeight: 1.6, mb: 2 }}>
                • Face recognition data can be added later through the update feature
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB', lineHeight: 1.6 }}>
                • Students can use their Student ID as both username and password for initial login
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default RegisterStudent;