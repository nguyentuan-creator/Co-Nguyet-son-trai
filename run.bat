@echo off
chcp 65001 >nul
echo ======================================================
echo  CO CHAN NHAN: CO NGUYET SON TRAI (NAM THU NHAT)
echo  Dang khoi dong Web Game tai http://127.0.0.1:8000 ...
echo ======================================================
start "" http://127.0.0.1:8000
python server.py
pause
