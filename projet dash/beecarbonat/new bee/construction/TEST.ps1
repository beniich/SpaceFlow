#!/usr/bin/env pwsh
# 🧪 Test & Validation Script
# Runs comprehensive tests across the application

Write-Host "🧪 ReclamTrack Test Suite" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

$errors = 0

# Test 1: Type Check Frontend
Write-Host "`n📝 Type checking frontend..." -ForegroundColor Yellow
npm run type-check --workspace=frontend
if ($LASTEXITCODE -ne 0) { $errors++ }

# Test 2: Lint Frontend
Write-Host "`n🧹 Linting frontend..." -ForegroundColor Yellow
npm run lint --workspace=frontend --  --max-warnings=50
if ($LASTEXITCODE -ne 0) { $errors++ }

# Test 3: Build Frontend
Write-Host "`n🏗️ Building frontend..." -ForegroundColor Yellow
npm run build --workspace=frontend
if ($LASTEXITCODE -ne 0) { $errors++ }

# Test 4: Build Backend
Write-Host "`n🏗️ Building backend..." -ForegroundColor Yellow
npm run build --workspace=backend
if ($LASTEXITCODE -ne 0) { $errors++ }

# Summary
Write-Host "`n" -NoNewline
if ($errors -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
}
else {
    Write-Host "❌ $errors test(s) failed!" -ForegroundColor Red
    exit 1
}
