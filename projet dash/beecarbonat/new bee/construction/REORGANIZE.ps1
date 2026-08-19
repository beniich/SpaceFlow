# Script de Réorganisation - ReclamTrack Frontend
# Ce script réorganise la structure des dossiers selon le nouveau plan

Write-Host "🚀 Démarrage de la réorganisation de ReclamTrack..." -ForegroundColor Cyan
Write-Host ""

$frontendPath = "C:\Users\pc gold\projet dash\ticket\reclamtrack\frontend\src\app"

# Vérifier que le chemin existe
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Erreur: Le chemin $frontendPath n'existe pas!" -ForegroundColor Red
    exit 1
}

Set-Location $frontendPath

Write-Host "📁 Création de la nouvelle structure..." -ForegroundColor Yellow

# ===== Créer les nouveaux groupes de routes =====
$newGroups = @(
    "(public)",
    "(app)"
)

foreach ($group in $newGroups) {
    if (-not (Test-Path $group)) {
        New-Item -ItemType Directory -Path $group -Force | Out-Null
        Write-Host "✅ Créé: $group" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📦 Déplacement des fichiers..." -ForegroundColor Yellow

# ===== Déplacer la landing page vers (public) =====
if (Test-Path "page.tsx") {
    Copy-Item "page.tsx" -Destination "(public)\page.tsx" -Force
    Write-Host "✅ Copié: page.tsx → (public)\page.tsx" -ForegroundColor Green
}

# ===== Créer le layout pour (public) =====
$publicLayoutContent = @"
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ReclamTrack - Accueil',
    description: 'Plateforme de gestion des services municipaux',
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
"@

Set-Content -Path "(public)\layout.tsx" -Value $publicLayoutContent -Force
Write-Host "✅ Créé: (public)\layout.tsx" -ForegroundColor Green

# ===== Créer le layout pour (app) avec Header/Sidebar =====
$appLayoutContent = @"
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className=\"flex items-center justify-center min-h-screen\">
                <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-primary\"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className=\"flex flex-col min-h-screen\">
            <Header />
            <main className=\"flex-1\">
                {children}
            </main>
        </div>
    );
}
"@

Set-Content -Path "(app)\layout.tsx" -Value $appLayoutContent -Force
Write-Host "✅ Créé: (app)\layout.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "🔄 Réorganisation des routes existantes..." -ForegroundColor Yellow

# ===== Fonction pour déplacer un dossier =====
function Move-RouteGroup {
    param(
        [string]$Source,
        [string]$Destination
    )
    
    if (Test-Path $Source) {
        if (-not (Test-Path $Destination)) {
            New-Item -ItemType Directory -Path $Destination -Force | Out-Null
        }
        
        # Copier le contenu
        Copy-Item -Path "$Source\*" -Destination $Destination -Recurse -Force
        Write-Host "✅ Déplacé: $Source → $Destination" -ForegroundColor Green
        
        # Marquer l'ancien pour suppression (ne pas supprimer immédiatement pour sécurité)
        if (Test-Path "$Source.old") {
            Remove-Item "$Source.old" -Recurse -Force
        }
        Rename-Item -Path $Source -NewName "$Source.old" -Force
    }
}

# ===== Déplacer les routes vers (app) =====
$routesToMove = @{
    "(dashboard)" = "(app)\dashboard"
    "(complaints)" = "(app)\complaints"
    "(teams)" = "(app)\teams"
    "(planning)" = "(app)\planning"
    "(inventory)" = "(app)\inventory"
    "(reports)" = "(app)\reports"
    "(admin)" = "(app)\admin"
    "map" = "(app)\map"
    "messages" = "(app)\messages"
    "fleet" = "(app)\fleet"
    "roster" = "(app)\roster"
    "knowledge" = "(app)\knowledge"
    "feedback" = "(app)\feedback"
    "technician" = "(app)\technician"
    "analytics" = "(app)\analytics"
    "settings" = "(app)\settings"
}

foreach ($route in $routesToMove.GetEnumerator()) {
    Move-RouteGroup -Source $route.Key -Destination $route.Value
}

# ===== Garder (auth) tel quel =====
Write-Host ""
Write-Host "✅ Le dossier (auth) reste inchangé" -ForegroundColor Green

# ===== Supprimer les dossiers obsolètes =====
Write-Host ""
Write-Host "🗑️  Nettoyage des anciens dossiers..." -ForegroundColor Yellow

$foldersToRemove = @(
    "(ecommerce)",
    "admin"
)

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        if (Test-Path "$folder.old") {
            Remove-Item "$folder.old" -Recurse -Force
        }
        Rename-Item -Path $folder -NewName "$folder.old" -Force
        Write-Host "✅ Marqué pour suppression: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Réorganisation terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "  1. Vérifiez la nouvelle structure dans: $frontendPath" -ForegroundColor White
Write-Host "  2. Testez l'application: npm run dev" -ForegroundColor White
Write-Host "  3. Si tout fonctionne, supprimez les dossiers *.old" -ForegroundColor White
Write-Host "  4. Mettez à jour les imports si nécessaire" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Les anciens dossiers sont renommés en .old pour sécurité" -ForegroundColor Yellow
Write-Host "   Vous pouvez les supprimer manuellement après vérification" -ForegroundColor Yellow
