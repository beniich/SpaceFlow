#!/bin/bash
# ================================================================
# ReclamTrack - Installation de la sync automatique dans la VM
# À exécuter UNE SEULE FOIS dans votre VM (terix@localhost)
# ================================================================

REPO_DIR="$HOME/reclamtrack"

echo "=== Installation Sync Automatique ReclamTrack ==="
echo ""

# 1. Cloner le projet si pas encore fait
if [ ! -d "$REPO_DIR" ]; then
    echo "[1/3] Clonage du dépôt depuis GitHub..."
    git clone git@github.com:terix85/reclamtrackvm.git "$REPO_DIR"
else
    echo "[1/3] Dossier $REPO_DIR existe déjà."
fi

# 2. Rendre le script de sync exécutable
chmod +x "$REPO_DIR/scripts/vm-sync.sh"
echo "[2/3] Script vm-sync.sh rendu exécutable"

# 3. Ajouter un raccourci global
echo "[3/3] Ajout du raccourci 'sync-reclamtrack'..."
echo "alias sync-reclamtrack='bash $REPO_DIR/scripts/vm-sync.sh'" >> ~/.bashrc
source ~/.bashrc

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Pour synchroniser manuellement: sync-reclamtrack"
echo "Pour activer la sync automatique (cron toutes les 5 min):"
echo "  crontab -e"
echo "  # Ajouter cette ligne:"
echo "  */5 * * * * bash $REPO_DIR/scripts/vm-sync.sh >> $HOME/vm-sync-cron.log 2>&1"
echo ""
echo "=== Fin installation ==="
