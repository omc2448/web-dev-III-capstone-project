@echo off
TITLE RentEasy MongoDB Service
echo ===================================================
echo Starting Local MongoDB for RentEasy Project...
echo Student: Om Chaurasia ^| Roll No: 2501010063
echo University: KR Mangalam University
echo ===================================================
if not exist "%~dp0data\db" mkdir "%~dp0data\db"
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "%~dp0data\db" --bind_ip 127.0.0.1 --port 27017
pause
