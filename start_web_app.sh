#!/bin/bash

# Attendance System Web Application Startup Script

echo "=== Attendance System Web Application ==="
echo "Starting the refactored web application..."
echo

# Check if we're in the right directory
if [ ! -f "config.py" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed"
    exit 1
fi

echo "1. Setting up backend..."
cd backend

# Install Python dependencies (if needed)
if [ ! -f ".deps_installed" ]; then
    echo "Installing Python dependencies..."
    pip install flask flask-cors
    touch .deps_installed
fi

echo "2. Starting Flask backend server..."
echo "Backend will be available at: http://localhost:5000"
python app.py &
BACKEND_PID=$!

cd ..

echo "3. Setting up frontend..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Check if build exists
if [ ! -d "build" ]; then
    echo "Building React frontend..."
    npm run build
fi

echo "4. Frontend build is ready"
echo "React app is served by Flask backend at: http://localhost:5000"

echo
echo "=== Application Started Successfully ==="
echo "🌐 Open your browser and go to: http://localhost:5000"
echo "📚 Default teacher login:"
echo "   Username: teacher"
echo "   Password: teacher123"
echo
echo "To stop the application, press Ctrl+C"
echo

# Wait for the backend process
wait $BACKEND_PID