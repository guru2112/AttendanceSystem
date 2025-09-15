// pages/TeacherDashboard.tsx

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  PersonAdd,
  Assignment,
  Analytics,
  People,
  Schedule,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}> = ({ icon, title, description, action, onClick }) => {
  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: '#2A2D2E',
        color: '#DCE4EE',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
          borderColor: '#4A90E2',
          borderWidth: 1,
          borderStyle: 'solid',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color: '#4A90E2', mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#7B8BAB', mb: 3, lineHeight: 1.6 }}>
          {description}
        </Typography>
        <Button
          variant="text"
          endIcon={<ArrowForward />}
          sx={{
            color: '#4A90E2',
            '&:hover': { bgcolor: 'rgba(74, 144, 226, 0.1)' },
          }}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      icon: <PersonAdd sx={{ fontSize: 32 }} />,
      title: 'Register Student',
      description: 'Add new students to the system with their details',
      action: 'Register Now',
      onClick: () => navigate('/teacher/register-student'),
    },
    {
      icon: <Assignment sx={{ fontSize: 32 }} />,
      title: 'Mark Attendance',
      description: 'Start an attendance session for your class',
      action: 'Start Session',
      onClick: () => navigate('/teacher/mark-attendance'),
    },
    {
      icon: <Analytics sx={{ fontSize: 32 }} />,
      title: 'View Attendance',
      description: 'View and analyze attendance records with filters',
      action: 'View Records',
      onClick: () => navigate('/teacher/view-attendance'),
    },
    {
      icon: <People sx={{ fontSize: 32 }} />,
      title: 'Manage Students',
      description: 'View and update student information',
      action: 'Manage',
      onClick: () => navigate('/teacher/manage-students'),
    },
  ];

  return (
    <Layout title="Teacher Dashboard">
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
            <Schedule sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Teacher Dashboard
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage your classes and student attendance efficiently
          </Typography>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#4A90E2', fontWeight: 'bold' }}>
                --
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Total Students
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                --
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Present Today
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                --
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Absent Today
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#2A2D2E', color: '#DCE4EE', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                --
              </Typography>
              <Typography variant="body2" sx={{ color: '#7B8BAB' }}>
                Attendance Rate
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Dashboard Actions */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <DashboardCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default TeacherDashboard;