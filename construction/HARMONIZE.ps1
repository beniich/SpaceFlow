#!/usr/bin/env pwsh
# 🔧 Harmonization & Fix Script
# Auto-fixes common issues and runs validation

Write-Host "🚀 ReclamTrack Harmonization Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Step 1: Clean obsolete node_modules
Write-Host "`n📦 Cleaning node_modules..." -ForegroundColor Yellow
if (Test-Path ".\node_modules") {
    Remove-Item -Recurse -Force ".\node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path ".\frontend\node_modules") {
    Remove-Item -Recurse -Force ".\frontend\node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path ".\backend\node_modules") {
    Remove-Item -Recurse -Force ".\backend\node_modules" -ErrorAction SilentlyContinue
}

# Step 2: Reinstall dependencies
Write-Host "`n📥 Installing fresh dependencies..." -ForegroundColor Yellow
npm run install:all

# Step 3: Run lint with auto-fix
Write-Host "`n🧹 Running ESLint with auto-fix..." -ForegroundColor Yellow
npm run lint:fix --workspace=frontend

# Step 4: Type check
Write-Host "`n🔍 Type checking..." -ForegroundColor Yellow
npm run type-check --workspace=frontend

# Step 5: Build test
Write-Host "`n🏗️ Testing build..." -ForegroundColor Yellow
npm run build

Write-Host "`n✅ Harmonization complete!" -ForegroundColor Green
