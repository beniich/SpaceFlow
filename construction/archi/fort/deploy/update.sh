#!/usr/bin/env bash
# =============================================================================
#  ReclamTrack — Script de MISE À JOUR pour AlmaLinux
#  Usage : sudo bash update.sh
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔] $1${NC}"; }
info() { echo -e "${CYAN}[ℹ] $1${NC}"; }

INSTALL_DIR="/opt/reclamtrack"

[[ $EUID -ne 0 ]] && { echo "Root requis."; exit 1; }

info "Arrêt des conteneurs..."
cd "${INSTALL_DIR}"
docker compose down

info "Mise à jour du code source..."
git pull origin main || git pull origin master

info "Reconstruction et redémarrage..."
docker compose build --no-cache
docker compose up -d

log "Mise à jour terminée !"
docker compose ps
