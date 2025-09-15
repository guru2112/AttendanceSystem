'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'student') {
      router.push('/dashboard/teacher');
    }
  }, [user, router]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.username}</p>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            icon="🔄"
            title="Update My Profile"
            description="Update your personal details and facial recognition data."
            onClick={() => navigateTo('/profile')}
          />
          <DashboardCard
            icon="📸"
            title="Test Face Scan"
            description="Check if the system correctly recognizes your face."
            onClick={() => navigateTo('/test-face')}
          />
          <DashboardCard
            icon="📊"
            title="View My Attendance"
            description="Check your historical attendance records."
            onClick={() => navigateTo('/attendance/my-records')}
          />
          <DashboardCard
            icon="📚"
            title="My Statistics"
            description="View your attendance statistics and performance."
            onClick={() => navigateTo('/stats')}
          />
        </div>
      </div>
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
        Open
      </button>
    </div>
  );
}