# ReclamTrack - Script de démarrage pour Tarik
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ReclamTrack - Démarrage par Tarik" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Se placer dans le dossier du script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[1/3] Vérification et installation des dépendances..." -ForegroundColor Yellow
# Installation racine
if (!(Test-Path "node_modules")) {
    Write-Host "Installation des dépendances racine..."
    npm install
}

# Installation workspaces
Write-Host "Installation des dépendances frontend et backend..."
npm run install:all
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors de l'installation des dépendances" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Préparation de l'environnement..." -ForegroundColor Yellow

# Vérification simple des fichiers .env (optionnel mais utile)
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Fichier .env créé à partir de .env.example" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[3/3] Démarrage des serveurs (Frontend + Backend)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend sera accessible sur: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend sera accessible sur:  http://localhost:5001" -ForegroundColor Green
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter les serveurs" -ForegroundColor Gray
Write-Host ""

npm run dev
