'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { apiService, RecognitionResult } from '@/lib/api';

export default function AttendancePage() {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [recognition, setRecognition] = useState<RecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    subject: '',
    department: '',
    year: '',
    semester: '',
    class_div: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const captureAndRecognize = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      // Convert base64 to File object
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

      // Send to recognition API
      const result = await apiService.recognizeFace(file);
      setRecognition(result);

      if (result.error) {
        setMessage({type: 'error', text: result.error});
      } else if (result.faces_detected === 0) {
        setMessage({type: 'error', text: 'No faces detected in the image'});
      } else {
        const recognizedFaces = result.recognitions.filter(r => r.student_id);
        if (recognizedFaces.length === 0) {
          setMessage({type: 'error', text: 'No recognized faces found'});
        }
      }
    } catch (error: any) {
      console.error('Recognition error:', error);
      setMessage({
        type: 'error', 
        text: error.response?.data?.detail || 'Error processing image'
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const markAttendance = async (studentId: string) => {
    if (!attendanceData.subject) {
      setMessage({type: 'error', text: 'Please enter subject name'});
      return;
    }

    try {
      const result = await apiService.markAttendance({
        student_id: studentId,
        ...attendanceData
      });
      setMessage({type: 'success', text: result.message});
      
      // Clear recognition after successful attendance marking
      setTimeout(() => {
        setRecognition(null);
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error', 
        text: error.response?.data?.detail || 'Error marking attendance'
      });
    }
  };

  const startContinuousCapture = () => {
    setIsCapturing(true);
    const interval = setInterval(() => {
      if (!isProcessing) {
        captureAndRecognize();
      }
    }, 3000); // Capture every 3 seconds

    // Store interval ID to clear it later
    (window as any).captureInterval = interval;
  };

  const stopContinuousCapture = () => {
    setIsCapturing(false);
    if ((window as any).captureInterval) {
      clearInterval((window as any).captureInterval);
      (window as any).captureInterval = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera and Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Live Camera Feed</h2>
              </div>
              
              <div className="p-6">
                {/* Webcam */}
                <div className="relative mb-6">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    height={360}
                    screenshotFormat="image/jpeg"
                    width={640}
                    videoConstraints={videoConstraints}
                    className="w-full rounded-lg border border-gray-300"
                  />
                  
                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Processing...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={captureAndRecognize}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capture & Recognize
                  </button>

                  {!isCapturing ? (
                    <button
                      onClick={startContinuousCapture}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16a3 3 0 006 0" />
                      </svg>
                      Start Auto-Capture
                    </button>
                  ) : (
                    <button
                      onClick={stopContinuousCapture}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                      </svg>
                      Stop Auto-Capture
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings and Recognition Results */}
          <div className="space-y-6">
            {/* Attendance Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={attendanceData.subject}
                    onChange={(e) => setAttendanceData({...attendanceData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={attendanceData.department}
                    onChange={(e) => setAttendanceData({...attendanceData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={attendanceData.year}
                    onChange={(e) => setAttendanceData({...attendanceData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input
                    type="text"
                    value={attendanceData.semester}
                    onChange={(e) => setAttendanceData({...attendanceData, semester: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter semester"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class/Division</label>
                  <input
                    type="text"
                    value={attendanceData.class_div}
                    onChange={(e) => setAttendanceData({...attendanceData, class_div: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter class/division"
                  />
                </div>
              </div>
            </div>

            {/* Recognition Results */}
            {recognition && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recognition Results</h3>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Faces Detected: <span className="font-medium">{recognition.faces_detected}</span>
                  </p>
                  
                  {recognition.recognitions.map((result, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      result.student_id 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {result.name}
                        </h4>
                        {result.confidence > 0 && (
                          <span className="text-sm text-gray-600">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      
                      {result.student_id && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            ID: {result.student_id}
                          </p>
                          <button
                            onClick={() => markAttendance(result.student_id!)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm"
                          >
                            Mark Present
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Camera</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto-Capture</span>
                  <span className={`font-medium ${isCapturing ? 'text-green-600' : 'text-gray-400'}`}>
                    {isCapturing ? 'Running' : 'Stopped'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Processing</span>
                  <span className={`font-medium ${isProcessing ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {isProcessing ? 'Processing' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}