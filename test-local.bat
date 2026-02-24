@echo off
echo Starting local server...
echo.
echo Open in browser: http://localhost:8000
echo Press Ctrl+C to stop
echo.
cd out
python -m http.server 8000
