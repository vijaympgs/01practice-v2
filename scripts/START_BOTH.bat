@echo off
echo .....................................................
echo  Starting Backend AND Frontend
echo .....................................................
echo.

start "Backend" cmd /k "D:\Python\01practice\scripts\START_BACKEND.bat"

echo Waiting 10 seconds for backend to start...
timeout /t 10

start "Frontend" cmd /k "D:\Python\01practice\scripts\START_FRONTEND.bat"

echo.
echo .....................................................
echo   Both servers starting in separate windows
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:3000
echo .....................................................
echo.
echo You can close this window now
pause


