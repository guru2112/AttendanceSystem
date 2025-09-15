// pages/LandingPage.tsx

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
} from '@mui/material';
import {
  Face,
  Security,
  Speed,
  Analytics,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: '#2A2D2E',
        color: '#DCE4EE',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(74, 144, 226, 0.15)',
          borderColor: '#4A90E2',
          borderWidth: 1,
          borderStyle: 'solid',
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ color: '#4A90E2', mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7B8BAB', lineHeight: 1.6 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#16181A', color: '#DCE4EE', minHeight: '100vh' }}>
      {/* Navigation */}
      <Box
        sx={{
          bgcolor: '#1B1D1F',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              FaceAuth
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#4A90E2',
                '&:hover': { bgcolor: '#357ABD' },
                px: 3,
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              background: 'linear-gradient(45deg, #4A90E2, #7B8BAB)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Smart Attendance System
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, color: '#7B8BAB', maxWidth: '600px', mx: 'auto' }}
          >
            Revolutionize attendance tracking with facial recognition technology.
            Secure, fast, and accurate.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: '#4A90E2',
              '&:hover': { bgcolor: '#357ABD' },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}
          >
            Why Choose FaceAuth?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<Face sx={{ fontSize: 48 }} />}
                title="Face Recognition"
                description="Advanced AI-powered facial recognition for accurate identification"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<Speed sx={{ fontSize: 48 }} />}
                title="Lightning Fast"
                description="Mark attendance in seconds with real-time processing"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<Security sx={{ fontSize: 48 }} />}
                title="Secure & Private"
                description="We prioritize data security with end-to-end encryption"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={<Analytics sx={{ fontSize: 48 }} />}
                title="Easy Integration"
                description="Seamlessly integrate with your existing HR systems"
              />
            </Grid>
          </Grid>
        </Box>

        {/* How it Works Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}
          >
            Simple Steps to Get Started
          </Typography>
          <Card sx={{ bgcolor: '#2A2D2E', color: '#DCE4EE', p: 4 }}>
            <Typography variant="body1" sx={{ lineHeight: 2, fontSize: '1.1rem' }}>
              <strong>1.</strong> Register Students: A teacher registers each student by capturing their facial data.
              <br />
              <strong>2.</strong> Start a Session: The teacher sets up a new attendance session for a specific subject.
              <br />
              <strong>3.</strong> Automated Marking: Students simply look at the camera, and attendance is marked.
              <br />
              <strong>4.</strong> View Reports: Access detailed attendance records anytime through the filtered view.
            </Typography>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;