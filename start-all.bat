@echo off
TITLE Launch RentEasy Full-Stack Application
echo =========================================================================
echo   RENTEASY - PROPERTY RENTAL LISTING SYSTEM
echo   Web Development Capstone Project (3rd Semester)
echo   Student: Om Chaurasia ^| Roll No: 2501010063
echo   University: KR Mangalam University
echo =========================================================================
echo.
echo [1/3] Launching MongoDB Engine...
start "RentEasy MongoDB" "%~dp0start-mongo.bat"
timeout /t 3 /nobreak > nul

echo [2/3] Launching Express.js API Backend on Port 5000...
start "RentEasy Backend" "%~dp0start-backend.bat"
timeout /t 3 /nobreak > nul

echo [3/3] Launching React Vite Frontend on Port 3000...
start "RentEasy Frontend" "%~dp0start-frontend.bat"
timeout /t 3 /nobreak > nul

echo.
echo =========================================================================
echo All services launched!
echo Open your browser at: http://localhost:3000
echo =========================================================================
pause
