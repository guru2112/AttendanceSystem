// components/Layout.js - Common layout component

import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div>
      {isAuthenticated && (
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              Attendance System
            </div>
            <div className="navbar-nav">
              <span>Welcome, {user?.username} ({user?.role})</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <main>
        {children}
      </main>
    </div>
  );
}