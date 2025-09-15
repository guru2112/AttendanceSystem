import React from 'react';

function LiveAttendance() {
  return (
    <div className="container">
      <div className="card">
        <h2>Live Attendance</h2>
        <p>Live face recognition attendance tracking will be implemented here.</p>
        <div className="alert alert-error">
          Camera functionality requires additional implementation for web browsers.
          This feature will capture frames from webcam and send to backend for face recognition.
        </div>
      </div>
    </div>
  );
}

export default LiveAttendance;