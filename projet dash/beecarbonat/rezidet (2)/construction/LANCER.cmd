@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "START_DEV.ps1"
pause
