@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
echo Dang khoi dong Co Chan Nhan GM...
start "" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:8000/"
python server.py
pause
