@echo off
echo .....................................................
echo  A B ™ learning - Clean Start Script
echo .....................................................
echo.

echo [CLEANUP] Killing existing processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
taskkill /f /im vite.exe 2>nul
echo Cleanup completed.

echo.
echo [STARTUP] Starting Backend AND Frontend
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
echo   Admin Panel: http://localhost:8000/admin
echo   Settlement Console: http://localhost:3000/pos/settlement
echo   Day Management: http://localhost:3000/pos/day-management
echo   Browser Recommendation: Use Chrome for best React DevTools support
echo .....................................................
echo.
echo Opening Chrome browser in 5 seconds...
timeout /t 5

start chrome http://localhost:3000
start chrome http://localhost:8000/admin

echo.
echo You can close this window now
pause
