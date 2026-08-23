# Script de finalisation de la connexion VM pour Tarik
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Finalisation de la Connexion SSH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$USER_VM = "terix"
$PORT_VM = "2222"

Write-Host "Nous allons copier votre clé de sécurité sur la VM." -ForegroundColor Yellow
Write-Host "Le mot de passe de la VM vous sera demandé une DERNIÈRE fois." -ForegroundColor Yellow
Write-Host ""

# Commande pour copier la clé
powershell -Command "Get-Content -Path '$env:USERPROFILE\.ssh\id_rsa.pub' | ssh -p $PORT_VM -o StrictHostKeyChecking=no $USER_VM@127.0.0.1 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Succès ! La clé a été copiée." -ForegroundColor Green
    Write-Host "Désormais, vous pouvez utiliser ./vm_cmd.ps1 sans mot de passe." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de la copie de la clé." -ForegroundColor Red
}

Read-Host "Appuyez sur Entrée pour terminer"
