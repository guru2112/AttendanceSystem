@echo off
title Face Recognition Attendance System

echo 🚀 Starting Face Recognition Attendance System...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

echo 🔧 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Start backend server
echo 🚀 Starting backend server on http://localhost:8000
start "Backend Server" cmd /k "python main.py"

cd ..

echo 🔧 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

REM Start frontend server
echo 🚀 Starting frontend server on http://localhost:3000
start "Frontend Server" cmd /k "npm run dev"

cd ..

echo.
echo 🎉 Attendance System is now running!
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Close the command windows to stop the servers
pause