'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-400">AttendanceSystem</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-to-use')}
                  className="hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  How It Works
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="text-blue-400">Face Recognition</span>
              <br />
              Attendance System
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionize attendance tracking with our cutting-edge face recognition technology. 
              Secure, efficient, and user-friendly solution for educational institutions.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-medium"
              >
                Get Started
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="border border-gray-600 hover:border-gray-500 px-8 py-3 rounded-lg text-lg font-medium"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-300 text-lg">
              Discover the features that make our system powerful and user-friendly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="🕒"
              title="Real-time Tracking"
              description="Monitor attendance instantly with live data streams."
            />
            <FeatureCard
              icon="🎯"
              title="High Accuracy"
              description="Our advanced AI algorithms ensure over 99.7% accuracy."
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Private"
              description="End-to-end encryption keeps all data safe and secure."
            />
            <FeatureCard
              icon="📊"
              title="Detailed Reports"
              description="Generate comprehensive attendance reports and analytics."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-to-use" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg">
              Our system is designed for a quick and hassle-free setup.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Register Students</h3>
                  <p className="text-gray-300">A teacher registers each student by capturing their facial data.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Start a Session</h3>
                  <p className="text-gray-300">The teacher sets up a new attendance session for a specific subject.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Automated Marking</h3>
                  <p className="text-gray-300">Students simply look at the camera, and attendance is marked.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">View Reports</h3>
                  <p className="text-gray-300">Access detailed attendance records anytime through the filtered view.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Face Recognition Attendance System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg text-center hover:bg-gray-600 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}