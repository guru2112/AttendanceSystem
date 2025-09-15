// pages/StudentDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Event,
  Analytics,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../utils/AuthContext';
import { attendanceAPI, studentsAPI } from '../services/api';
import { AttendanceRecord, Student } from '../types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.username) return;

      try {
        setLoading(true);
        
        // Fetch student details
        const studentResponse = await studentsAPI.getById(user.username);
        setStudent(studentResponse.student);

        // Fetch attendance records for this student
        const attendanceResponse = await attendanceAPI.getFiltered({
          student_id: user.username,
        });
        setAttendanceRecords(attendanceResponse.attendance);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user?.username]);

  const calculateAttendanceStats = () => {
    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter(record => record.status === 'Present').length;
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    return {
      totalClasses,
      presentClasses,
      absentClasses: totalClasses - presentClasses,
      attendancePercentage: Math.round(attendancePercentage),
    };
  };

  const getRecentAttendance = () => {
    return attendanceRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <Layout title="Student Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#4A90E2' }} />
        </Box>
      </Layout>
    );
  }

  const stats = calculateAttendanceStats();
  const recentAttendance = getRecentAttendance();

  return (
    <Layout title="Student Dashboard">
      <Box>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            bgcolor: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
            background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Welcome, {student?.name || user?.username}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Track your attendance and academic progress
          </Typography>
          {student && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Chip
                label={`${student.department} - Year ${student.year}`}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            </Box>
          )}
        </Paper>

        {/* Attendance Statistics */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Attendance Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#4A90E2', fontWeight: 'bold' }}>
                {stats.totalClasses}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Total Classes
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                {stats.presentClasses}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Classes Attended
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#FF5722', fontWeight: 'bold' }}>
                {stats.absentClasses}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Classes Missed
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                {stats.attendancePercentage}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Attendance Rate
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Attendance */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Recent Attendance
        </Typography>
        {recentAttendance.length > 0 ? (
          <Grid container spacing={3}>
            {recentAttendance.map((record, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ bgcolor: '#2A2D2E', color: '#DCE4EE' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {record.subject}
                      </Typography>
                      {record.status === 'Present' ? (
                        <CheckCircle sx={{ color: '#4CAF50' }} />
                      ) : (
                        <Cancel sx={{ color: '#FF5722' }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#7B8BAB', mb: 1 }}>
                      <Event sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {new Date(record.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7B8BAB', mb: 2 }}>
                      Semester: {record.semester}
                    </Typography>
                    <Chip
                      label={record.status}
                      size="small"
                      sx={{
                        bgcolor: record.status === 'Present' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 87, 34, 0.2)',
                        color: record.status === 'Present' ? '#4CAF50' : '#FF5722',
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
            <Analytics sx={{ fontSize: 48, color: '#7B8BAB', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No attendance records found
            </Typography>
            <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
              Your attendance will appear here once classes begin
            </Typography>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default StudentDashboard;