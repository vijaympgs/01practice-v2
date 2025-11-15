@echo off
echo ..............................
echo    Starting Backend Server
echo ..............................
echo.

cd D:\Python\01practice\backend

echo.
echo Starting server on port 8000...
echo.
echo .....................................................
echo   Backend running at: http://localhost:8000
echo   API Docs at: http://localhost:8000/api/schema/
echo   API Forms at: http://localhost:8000/api/forms/
echo   Admin at: http://localhost:8000/admin/
echo   Master upload at  http://localhost/masters/upload/
echo .....................................................
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 0.0.0.0:8000

