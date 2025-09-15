import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Attendance System</h1>
        
        <div className="nav-links">
          {user.role === 'teacher' ? (
            <>
              <Link to="/teacher">Dashboard</Link>
              <Link to="/register-student">Register Student</Link>
              <Link to="/attendance-setup">Setup Attendance</Link>
              <Link to="/live-attendance">Live Attendance</Link>
              <Link to="/view-attendance">View Attendance</Link>
              <Link to="/update-student">Update Student</Link>
              <Link to="/test-face-scan">Test Face Scan</Link>
            </>
          ) : (
            <>
              <Link to="/student">Dashboard</Link>
              <Link to="/view-attendance">My Attendance</Link>
              <Link to="/test-face-scan">Test Face Scan</Link>
            </>
          )}
          
          <span>Welcome, {user.username}!</span>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;