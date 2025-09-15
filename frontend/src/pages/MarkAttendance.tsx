// pages/MarkAttendance.tsx

import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
} from '@mui/material';
import {
  Assignment,
  Save,
  ArrowBack,
  People,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentsAPI, attendanceAPI } from '../services/api';
import { Student, AttendanceDetails } from '../types';

interface StudentWithAttendance extends Student {
  isPresent: boolean;
}

const MarkAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithAttendance[]>([]);
  const [sessionData, setSessionData] = useState({
    subject: '',
    department: '',
    year: '',
    semester: '',
    class_div: 'A',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'Database Systems', 'Software Engineering'];
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const years = ['1', '2', '3', '4'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const classDivisions = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, sessionData.department, sessionData.year]);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      const studentsWithAttendance = response.students.map(student => ({
        ...student,
        isPresent: false,
      }));
      setStudents(studentsWithAttendance);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
    }
  };

  const filterStudents = () => {
    let filtered = students;
    
    if (sessionData.department) {
      filtered = filtered.filter(student => student.department === sessionData.department);
    }
    
    if (sessionData.year) {
      filtered = filtered.filter(student => student.year === sessionData.year);
    }
    
    setFilteredStudents(filtered);
  };

  const handleSessionDataChange = (field: string, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleStudentAttendanceChange = (studentId: string, isPresent: boolean) => {
    setStudents(prev => 
      prev.map(student => 
        student.student_id === studentId 
          ? { ...student, isPresent }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, isPresent: true }))
    );
  };

  const markAllAbsent = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, isPresent: false }))
    );
  };

  const handleSubmit = async () => {
    if (!sessionData.subject || !sessionData.department || !sessionData.year || !sessionData.semester) {
      setError('Please fill in all session details');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const presentStudents = filteredStudents.filter(student => student.isPresent);
      
      if (presentStudents.length === 0) {
        setError('Please select at least one student as present');
        setLoading(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const student of presentStudents) {
        try {
          const attendanceData: AttendanceDetails = {
            student_id: student.student_id,
            date: sessionData.date,
            subject: sessionData.subject,
            department: sessionData.department,
            year: sessionData.year,
            semester: sessionData.semester,
            class_div: sessionData.class_div,
          };

          await attendanceAPI.mark(attendanceData);
          successCount++;
        } catch (err) {
          failCount++;
          console.error(`Failed to mark attendance for ${student.student_id}:`, err);
        }
      }

      if (successCount > 0) {
        setSuccess(`Successfully marked attendance for ${successCount} student(s)${failCount > 0 ? `. ${failCount} failed.` : '.'}`);
        // Reset form
        setStudents(prev => prev.map(student => ({ ...student, isPresent: false })));
      } else {
        setError('Failed to mark attendance for any student');
      }
    } catch (err) {
      setError('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = filteredStudents.filter(student => student.isPresent).length;
  const totalCount = filteredStudents.length;

  return (
    <Layout title="Mark Attendance">
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
            Mark Attendance
          </Typography>
          <Typography variant="body1" sx={{ color: '#7B8BAB' }}>
            Set up a new attendance session and mark student attendance
          </Typography>
        </Box>

        {/* Session Setup */}
        <Card sx={{ mb: 4, bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Assignment sx={{ mr: 2, color: '#4A90E2', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Session Details
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Subject *</InputLabel>
                  <Select
                    value={sessionData.subject}
                    onChange={(e) => handleSessionDataChange('subject', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department *</InputLabel>
                  <Select
                    value={sessionData.department}
                    onChange={(e) => handleSessionDataChange('department', e.target.value)}
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

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Year *</InputLabel>
                  <Select
                    value={sessionData.year}
                    onChange={(e) => handleSessionDataChange('year', e.target.value)}
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

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Semester *</InputLabel>
                  <Select
                    value={sessionData.semester}
                    onChange={(e) => handleSessionDataChange('semester', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    {semesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>Semester {semester}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Class Division</InputLabel>
                  <Select
                    value={sessionData.class_div}
                    onChange={(e) => handleSessionDataChange('class_div', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    {classDivisions.map((division) => (
                      <MenuItem key={division} value={division}>Division {division}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  variant="outlined"
                  value={sessionData.date}
                  onChange={(e) => handleSessionDataChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
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
            </Grid>
          </CardContent>
        </Card>

        {/* Alerts */}
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

        {/* Student List */}
        <Card sx={{ bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 2, color: '#4A90E2', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Students ({presentCount}/{totalCount} present)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={markAllPresent}
                  sx={{
                    borderColor: 'rgba(76, 175, 80, 0.5)',
                    color: '#4CAF50',
                    '&:hover': { borderColor: '#4CAF50', bgcolor: 'rgba(76, 175, 80, 0.1)' },
                  }}
                >
                  Mark All Present
                </Button>
                <Button
                  variant="outlined"
                  onClick={markAllAbsent}
                  sx={{
                    borderColor: 'rgba(255, 87, 34, 0.5)',
                    color: '#FF5722',
                    '&:hover': { borderColor: '#FF5722', bgcolor: 'rgba(255, 87, 34, 0.1)' },
                  }}
                >
                  Mark All Absent
                </Button>
              </Box>
            </Box>

            {filteredStudents.length > 0 ? (
              <>
                <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Present</TableCell>
                        <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Student ID</TableCell>
                        <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Department</TableCell>
                        <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Year</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.student_id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                          <TableCell>
                            <Checkbox
                              checked={student.isPresent}
                              onChange={(e) => handleStudentAttendanceChange(student.student_id, e.target.checked)}
                              sx={{
                                color: '#4A90E2',
                                '&.Mui-checked': { color: '#4CAF50' },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#DCE4EE' }}>{student.student_id}</TableCell>
                          <TableCell sx={{ color: '#DCE4EE' }}>{student.name}</TableCell>
                          <TableCell sx={{ color: '#DCE4EE' }}>{student.department}</TableCell>
                          <TableCell sx={{ color: '#DCE4EE' }}>Year {student.year}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    icon={<CheckCircle />}
                    label={`${presentCount} students marked present`}
                    sx={{
                      bgcolor: presentCount > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: presentCount > 0 ? '#4CAF50' : '#7B8BAB',
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={loading || presentCount === 0}
                    sx={{
                      bgcolor: '#4A90E2',
                      '&:hover': { bgcolor: '#357ABD' },
                      '&.Mui-disabled': { bgcolor: 'rgba(74, 144, 226, 0.3)' },
                      px: 4,
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Attendance'}
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <People sx={{ fontSize: 48, color: '#7B8BAB', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No students found
                </Typography>
                <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                  Please select department and year to see students
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default MarkAttendance;