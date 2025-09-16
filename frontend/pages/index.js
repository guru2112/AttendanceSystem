// pages/index.js - Landing/Login page

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import Layout from '../components/Layout';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard
      if (user.role === 'student') {
        router.push('/student');
      } else if (user.role === 'teacher') {
        router.push('/teacher');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login(username, password);
      
      // Redirect based on role
      if (userData.role === 'student') {
        router.push('/student');
      } else if (userData.role === 'teacher') {
        router.push('/teacher');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
          <h1 className="text-center mb-4">Attendance System</h1>
          <h2 className="text-center mb-4">Login</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="btn"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button
              onClick={() => router.push('/register')}
              className="btn btn-secondary"
            >
              Register as Student
            </button>
          </div>
          
          <div className="text-center mt-4">
            <small>
              <strong>Demo Accounts:</strong><br/>
              Teacher: username=teacher, password=teacher123<br/>
              Student: username=student1, password=student1
            </small>
          </div>
        </div>
      </div>
    </Layout>
  );
}