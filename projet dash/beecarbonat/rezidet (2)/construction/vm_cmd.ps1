# Script pour exécuter des commandes sur la VM via SSH
# Usage: ./vm_cmd.ps1 "votre commande linux"

param(
    [string]$Command
)

# --- CONFIGURATION MISE A JOUR ---
$VM_USER = "terix"        # Utilisateur (vu dans votre prompt: terix@localhost)
$VM_IP   = "127.0.0.1"    # Adresse IP
$VM_PORT = "2222"         # Port SSH (Probablement 2222 car 10.0.2.15 est une IP NAT VirtualBox)
# ----------------------------------

if ([string]::IsNullOrEmpty($Command)) {
    Write-Host "Usage: ./vm_cmd.ps1 'commande'" -ForegroundColor Yellow
    Write-Host "Exemple: ./vm_cmd.ps1 'ls -la /var/www'"
    exit
}

Write-Host "Connexion à $VM_USER@$VM_IP sur le port $VM_PORT..." -ForegroundColor Cyan
Write-Host "CMD > $Command" -ForegroundColor Green

# Exécution de la commande via SSH
# L'option -o StrictHostKeyChecking=no évite de demander confirmation pour la clé
ssh -p $VM_PORT -o StrictHostKeyChecking=no $VM_USER@$VM_IP $Command
