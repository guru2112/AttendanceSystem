import React from 'react';

function TestFaceScan() {
  return (
    <div className="container">
      <div className="card">
        <h2>Test Face Recognition</h2>
        <p>Test the face recognition system to see if it can identify you.</p>
        <div className="alert alert-error">
          Camera functionality for face testing will be implemented here.
          This feature will capture your face and show recognition results without marking attendance.
        </div>
      </div>
    </div>
  );
}

export default TestFaceScan;