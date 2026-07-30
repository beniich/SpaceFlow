@echo off
setlocal
echo ========================================
echo   ReclamTrack - Demarrage Serveur Dev
echo ========================================
echo.

:: Se placer dans le dossier du script (racine du projet)
cd /d "%~dp0"

echo [1/3] Installation des dependances racine...
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Echec de l'installation racine.
    pause
    exit /b 1
)

echo.
echo [2/3] Installation des dependances projets (frontend + backend)...
call npm run install:all
if %errorlevel% neq 0 (
    echo ERREUR: Echec de l'installation des projets.
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage des serveurs...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001
echo.
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ERREUR: Les serveurs se sont arretes avec une erreur.
    pause
)
