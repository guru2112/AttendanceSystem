'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

export default function Home() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        await apiService.healthCheck();
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkAPIStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Face Recognition Attendance System
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Modern attendance tracking with facial recognition technology
          </p>
          
          {/* API Status */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${
              isOnline === null 
                ? 'bg-yellow-400' 
                : isOnline 
                  ? 'bg-green-400' 
                  : 'bg-red-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              API Status: {
                isOnline === null 
                  ? 'Checking...' 
                  : isOnline 
                    ? 'Online' 
                    : 'Offline'
              }
            </span>
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Mark Attendance */}
          <Link href="/attendance" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Mark Attendance</h3>
              <p className="text-gray-600 text-sm">
                Use webcam to recognize faces and mark attendance in real-time
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Start Recognition →
              </div>
            </div>
          </Link>

          {/* Manage Users */}
          <Link href="/users" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full">
              <div className="text-green-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Users</h3>
              <p className="text-gray-600 text-sm">
                Add new students and upload their photos for face recognition
              </p>
              <div className="mt-4 text-green-600 text-sm font-medium group-hover:text-green-700">
                Manage Users →
              </div>
            </div>
          </Link>

          {/* View Records */}
          <Link href="/records" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full">
              <div className="text-purple-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Attendance Records</h3>
              <p className="text-gray-600 text-sm">
                View and analyze attendance data with filtering options
              </p>
              <div className="mt-4 text-purple-600 text-sm font-medium group-hover:text-purple-700">
                View Records →
              </div>
            </div>
          </Link>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <div className="text-gray-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">System Status</h3>
            <p className="text-gray-600 text-sm mb-4">
              Monitor system health and performance metrics
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Backend API</span>
                <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Face Recognition</span>
                <span className="text-green-600 font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Quick Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Students
              </div>
              <p className="text-gray-600 text-sm">Registered for face recognition</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Today&apos;s Attendance
              </div>
              <p className="text-gray-600 text-sm">Total check-ins for today</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recognition Accuracy
              </div>
              <p className="text-gray-600 text-sm">Average face recognition accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
