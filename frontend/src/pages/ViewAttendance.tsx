// pages/ViewAttendance.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Event,
  Person,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { attendanceAPI } from '../services/api';
import { AttendanceRecord, AttendanceFilters } from '../types';

const ViewAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<AttendanceFilters>({});

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async (searchFilters: AttendanceFilters = {}) => {
    try {
      setLoading(true);
      setError('');
      const response = await attendanceAPI.getFiltered(searchFilters);
      setAttendanceRecords(response.attendance);
    } catch (err: any) {
      setError('Failed to fetch attendance records');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof AttendanceFilters, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    fetchAttendance(filters);
  };

  const handleReset = () => {
    setFilters({});
    fetchAttendance();
  };

  const getStatusColor = (status: string) => {
    return status === 'Present' ? '#4CAF50' : '#FF5722';
  };

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const years = ['1', '2', '3', '4'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'Database Systems'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <Layout title="View Attendance Records">
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Attendance Records
          </Typography>
          <Typography variant="body1" sx={{ color: '#7B8BAB' }}>
            View and filter attendance records for all students
          </Typography>
        </Box>

        {/* Filters Card */}
        <Card sx={{ mb: 4, bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FilterList sx={{ mr: 1, color: '#4A90E2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Filter Options
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Student ID"
                  variant="outlined"
                  value={filters.student_id || ''}
                  onChange={(e) => handleFilterChange('student_id', e.target.value)}
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

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Department</InputLabel>
                  <Select
                    value={filters.department || ''}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Year</InputLabel>
                  <Select
                    value={filters.year || ''}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>Year {year}</MenuItem>
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
                  value={filters.date || ''}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
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

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Subject</InputLabel>
                  <Select
                    value={filters.subject || ''}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    <MenuItem value="">All Subjects</MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Semester</InputLabel>
                  <Select
                    value={filters.semester || ''}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#DCE4EE',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4A90E2' },
                    }}
                  >
                    <MenuItem value="">All Semesters</MenuItem>
                    {semesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>Semester {semester}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                sx={{
                  bgcolor: '#4A90E2',
                  '&:hover': { bgcolor: '#357ABD' },
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#DCE4EE',
                  '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                }}
              >
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Error Alert */}
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

        {/* Results */}
        <Card sx={{ bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Attendance Records ({attendanceRecords.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#DCE4EE',
                  '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                }}
              >
                Export
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#4A90E2' }} />
              </Box>
            ) : attendanceRecords.length > 0 ? (
              <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Student ID</TableCell>
                      <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Subject</TableCell>
                      <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Semester</TableCell>
                      <TableCell sx={{ color: '#DCE4EE', fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceRecords.map((record, index) => (
                      <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                        <TableCell sx={{ color: '#DCE4EE' }}>{record.student_id}</TableCell>
                        <TableCell sx={{ color: '#DCE4EE' }}>{record.name}</TableCell>
                        <TableCell sx={{ color: '#DCE4EE' }}>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: '#DCE4EE' }}>{record.subject}</TableCell>
                        <TableCell sx={{ color: '#DCE4EE' }}>{record.semester}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            size="small"
                            sx={{
                              bgcolor: record.status === 'Present' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 87, 34, 0.2)',
                              color: getStatusColor(record.status),
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Event sx={{ fontSize: 48, color: '#7B8BAB', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No attendance records found
                </Typography>
                <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                  Try adjusting your search filters
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default ViewAttendance;