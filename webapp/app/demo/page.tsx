'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<'landing' | 'teacher' | 'student'>('landing');
  const router = useRouter();

  const TeacherDashboardDemo = () => (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-400">Attendance System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Welcome, <span className="font-semibold">teacher</span> (teacher)
              </span>
              <button
                onClick={() => setCurrentView('landing')}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm font-medium"
              >
                Back to Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage students and attendance sessions</p>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard
                icon="👤+"
                title="Register Student"
                description="Add a new student to the system and capture their facial data."
                onClick={() => alert('Feature would redirect to /register')}
              />
              <DashboardCard
                icon="🔄"
                title="Update Details"
                description="Modify student information or update their facial scan."
                onClick={() => alert('Feature would redirect to /update')}
              />
              <DashboardCard
                icon="▶️"
                title="Start Session"
                description="Begin a live attendance session for a class or subject."
                onClick={() => alert('Feature would redirect to /attendance/setup')}
              />
              <DashboardCard
                icon="📊"
                title="View Reports"
                description="Filter and view all historical attendance records."
                onClick={() => alert('Feature would redirect to /attendance/reports')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const StudentDashboardDemo = () => (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-400">Attendance System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Welcome, <span className="font-semibold">student123</span> (student)
              </span>
              <button
                onClick={() => setCurrentView('landing')}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm font-medium"
              >
                Back to Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back, student123</p>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard
                icon="🔄"
                title="Update My Profile"
                description="Update your personal details and facial recognition data."
                onClick={() => alert('Feature would redirect to /profile')}
              />
              <DashboardCard
                icon="📸"
                title="Test Face Scan"
                description="Check if the system correctly recognizes your face."
                onClick={() => alert('Feature would redirect to /test-face')}
              />
              <DashboardCard
                icon="📊"
                title="View My Attendance"
                description="Check your historical attendance records."
                onClick={() => alert('Feature would redirect to /attendance/my-records')}
              />
              <DashboardCard
                icon="📚"
                title="My Statistics"
                description="View your attendance statistics and performance."
                onClick={() => alert('Feature would redirect to /stats')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (currentView === 'teacher') {
    return <TeacherDashboardDemo />;
  }

  if (currentView === 'student') {
    return <StudentDashboardDemo />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-400">AttendanceSystem</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">
              <span className="text-blue-400">Web Application</span> Demo
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              This demonstrates the successful conversion from Python desktop application to Next.js web application.
              Click below to explore the different user interfaces.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <DemoCard
                icon="👨‍🏫"
                title="Teacher Dashboard"
                description="View the teacher interface for managing students and attendance sessions."
                onClick={() => setCurrentView('teacher')}
              />
              <DemoCard
                icon="👨‍🎓"
                title="Student Dashboard"
                description="View the student interface for profile management and attendance tracking."
                onClick={() => setCurrentView('student')}
              />
            </div>
          </div>

          {/* Features Converted */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Successfully Converted Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureItem
                icon="✅"
                title="Authentication System"
                description="Login/logout with role-based access control"
              />
              <FeatureItem
                icon="✅"
                title="Responsive Design"
                description="Modern web interface that works on all devices"
              />
              <FeatureItem
                icon="✅"
                title="API Architecture"
                description="RESTful APIs for all backend operations"
              />
              <FeatureItem
                icon="✅"
                title="Database Integration"
                description="MongoDB with Mongoose for data persistence"
              />
              <FeatureItem
                icon="✅"
                title="User Dashboards"
                description="Separate interfaces for teachers and students"
              />
              <FeatureItem
                icon="✅"
                title="Modern Tech Stack"
                description="Next.js 14, TypeScript, Tailwind CSS"
              />
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-16 bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready for Implementation</h2>
            <p className="text-gray-300 mb-4">
              The foundation has been successfully converted from Python desktop to Next.js web application. 
              The following features are ready to be implemented:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Student registration with face capture using web camera</li>
              <li>Live attendance tracking with web-based face recognition</li>
              <li>Attendance reporting and filtering system</li>
              <li>Profile management and face data updates</li>
              <li>Real-time session management</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function DemoCard({ icon, title, description, onClick }: { 
  icon: string; 
  title: string; 
  description: string; 
  onClick: () => void; 
}) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-750 cursor-pointer transition-all duration-200"
    >
      <div className="text-6xl mb-4 text-center">{icon}</div>
      <h3 className="text-2xl font-semibold text-white mb-3 text-center">{title}</h3>
      <p className="text-gray-400 mb-6 text-center">{description}</p>
      <button className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white font-medium">
        View Dashboard
      </button>
    </div>
  );
}

function DashboardCard({ 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  onClick: () => void; 
}) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-750 cursor-pointer transition-all duration-200"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm font-medium">
        Go →
      </button>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}