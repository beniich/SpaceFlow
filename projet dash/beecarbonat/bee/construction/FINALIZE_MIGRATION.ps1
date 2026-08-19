# Script de Résolution de Conflits et Migration Finale
Write-Host "🚀 Démarrage de la migration finale..." -ForegroundColor Cyan

# === CONFIGURATION ===
$frontendPath = "C:\Users\pc gold\projet dash\ticket\reclamtrack\frontend\src\app"
$appGroup = "$frontendPath\(app)"
$publicGroup = "$frontendPath\(public)"

# === 1. Nettoyage des Conflits ===
Write-Host "🧹 1. Nettoyage des fichiers conflictuels..." -ForegroundColor Yellow

# Supprimer page.tsx à la racine (car il existe déjà dans (public)/page.tsx)
if (Test-Path "$frontendPath\page.tsx") {
    Remove-Item "$frontendPath\page.tsx" -Force
    Write-Host "✅ Supprimé: page.tsx (racine)" -ForegroundColor Green
}

# === 2. Migration vers (app) ===
Write-Host "📦 2. Déplacement des dossiers..." -ForegroundColor Yellow

$routesToMove = @(
    "(dashboard)",
    "(complaints)",
    "(teams)",
    "(planning)",
    "(inventory)",
    "(reports)",
    "(admin)",
    "map",
    "messages",
    "fleet",
    "roster",
    "knowledge",
    "feedback",
    "technician",
    "analytics",
    "settings"
)

foreach ($folderName in $routesToMove) {
    $sourcePath = "$frontendPath\$folderName"
    
    # Gérer les dossiers avec parenthèses pour le nom de destination
    $destName = $folderName.Replace("(", "").Replace(")", "")
    $destPath = "$appGroup\$destName"

    if (Test-Path $sourcePath) {
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
        }
        
        # Copier le contenu
        Copy-Item -Path "$sourcePath\*" -Destination $destPath -Recurse -Force
        
        # Supprimer la source
        Remove-Item $sourcePath -Recurse -Force
        Write-Host "✅ Migré: $folderName → (app)\$destName" -ForegroundColor Green
    }
}

# === 3. Nettoyage Final ===
Write-Host "🗑️ 3. Suppression des dossiers obsolètes..." -ForegroundColor Yellow

$obsoleteFolders = @(
    "(ecommerce)",
    "admin" # Doublon de (admin)
)

foreach ($folder in $obsoleteFolders) {
    $path = "$frontendPath\$folder"
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
        Write-Host "✅ Supprimé: $folder" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ MIGRATION TERMINÉE !" -ForegroundColor Cyan
Write-Host "Vous pouvez maintenant relancer 'npm run dev'" -ForegroundColor White
