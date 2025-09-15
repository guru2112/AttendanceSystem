'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  role: string;
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'teacher') {
      router.push('/auth/login');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">FaceAuth</span>
              <span className="ml-4 text-slate-400">Teacher Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user.username}</span>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-slate-400 hover:text-white"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-slate-800 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Menu</h3>
                <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-white">×</button>
              </div>
              <nav className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded">
                  Dashboard
                </button>
                <button 
                  onClick={() => navigateTo('/register')}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
                >
                  Register Student
                </button>
                <button 
                  onClick={() => navigateTo('/attendance/setup')}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
                >
                  Start Session
                </button>
                <button 
                  onClick={() => navigateTo('/attendance/view')}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
                >
                  View Attendance
                </button>
                <div className="pt-4 border-t border-slate-700">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded"
                  >
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Teacher Dashboard</h1>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Register Student Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 rounded-lg p-3 mr-4">
                <span className="text-2xl">👤+</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Register Student</h3>
                <p className="text-slate-400">Add a new student and capture facial data</p>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('/register')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
            >
              Go →
            </button>
          </div>

          {/* Start Session Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 rounded-lg p-3 mr-4">
                <span className="text-2xl">▶️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Start Session</h3>
                <p className="text-slate-400">Begin live attendance tracking</p>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('/attendance/setup')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
            >
              Go →
            </button>
          </div>

          {/* Update Details Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 rounded-lg p-3 mr-4">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Update Details</h3>
                <p className="text-slate-400">Modify student information</p>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('/students/update')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md transition-colors"
            >
              Go →
            </button>
          </div>

          {/* View Reports Card */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 rounded-lg p-3 mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">View Reports</h3>
                <p className="text-slate-400">Check attendance records</p>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('/attendance/view')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors"
            >
              Go →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}