#!/usr/bin/env bash
# =============================================================================
#  ReclamTrack — Script d'installation complet pour AlmaLinux 8/9
#  GitHub : https://github.com/terix85/reclamtrack
#  Usage  : sudo bash install.sh
# =============================================================================
set -euo pipefail

# ─── Couleurs ────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()     { echo -e "${GREEN}[✔] $1${NC}"; }
info()    { echo -e "${CYAN}[ℹ] $1${NC}"; }
warn()    { echo -e "${YELLOW}[⚠] $1${NC}"; }
error()   { echo -e "${RED}[✘] $1${NC}"; exit 1; }
section() { echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════${NC}"; \
             echo -e "${BOLD}${CYAN}  $1${NC}"; \
             echo -e "${BOLD}${CYAN}══════════════════════════════════════════${NC}\n"; }

# ─── Variables ───────────────────────────────────────────────────────────────
GITHUB_USER="terix85"
REPO_NAME="reclamtrack"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
INSTALL_DIR="/opt/reclamtrack"
NODE_VERSION="20"
APP_USER="reclamtrack"

# ─── Vérification root ───────────────────────────────────────────────────────
[[ $EUID -ne 0 ]] && error "Lancez ce script en tant que root : sudo bash install.sh"

# =============================================================================
section "1/9 — Mise à jour du système"
# =============================================================================
dnf update -y
dnf install -y git curl wget unzip firewalld util-linux-user
log "Système mis à jour"

# =============================================================================
section "2/9 — Installation de Node.js ${NODE_VERSION}"
# =============================================================================
if ! command -v node &>/dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
  dnf install -y nodejs
fi
NODE_INSTALLED=$(node -v)
log "Node.js ${NODE_INSTALLED} installé"
log "npm $(npm -v) installé"

# =============================================================================
section "3/9 — Installation de Docker & Docker Compose"
# =============================================================================
if ! command -v docker &>/dev/null; then
  dnf install -y dnf-plugins-core
  dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  systemctl enable --now docker
fi
log "Docker $(docker --version) installé"
log "Docker Compose $(docker compose version) installé"

# =============================================================================
section "4/9 — Création de l'utilisateur applicatif"
# =============================================================================
if ! id "${APP_USER}" &>/dev/null; then
  useradd -m -s /bin/bash "${APP_USER}"
  usermod -aG docker "${APP_USER}"
  log "Utilisateur '${APP_USER}' créé et ajouté au groupe docker"
else
  warn "Utilisateur '${APP_USER}' existe déjà"
fi

# =============================================================================
section "5/9 — Clonage du dépôt GitHub"
# =============================================================================
if [ -d "${INSTALL_DIR}/.git" ]; then
  warn "Dépôt déjà cloné — mise à jour (git pull)"
  cd "${INSTALL_DIR}"
  git pull origin main || git pull origin master
else
  info "Clonage de ${REPO_URL} → ${INSTALL_DIR}"
  git clone "${REPO_URL}" "${INSTALL_DIR}"
fi
chown -R "${APP_USER}":"${APP_USER}" "${INSTALL_DIR}"
log "Code source prêt dans ${INSTALL_DIR}"

# =============================================================================
section "6/9 — Configuration des variables d'environnement"
# =============================================================================
cd "${INSTALL_DIR}"

# ── Fichier .env principal ────────────────────────────────────────────────────
if [ ! -f ".env" ]; then
  cat > .env <<EOF
# ─── Backend ─────────────────────────────────────────────────
PORT=5001
NODE_ENV=production

# MongoDB (conteneur Docker interne)
MONGO_URI=mongodb://mongo:27017/reclamtrack

# JWT — CHANGEZ ces valeurs en production !
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d

# Kafka
KAFKA_BROKER=kafka:9092
DISABLE_KAFKA=false

# Google OAuth (facultatif)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Frontend ────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -hex 32)
EOF
  log "Fichier .env créé avec des secrets aléatoires"
else
  warn ".env existe déjà — non écrasé"
fi

# ── .env pour le frontend ─────────────────────────────────────────────────────
if [ ! -f "frontend/.env" ]; then
  cat > frontend/.env <<'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=CHANGE_ME_IN_PRODUCTION
EOF
  log "frontend/.env créé"
fi

# =============================================================================
section "7/9 — Lancement Docker Compose (build + démarrage)"
# =============================================================================
cd "${INSTALL_DIR}"

# Construction et démarrage de tous les services
docker compose pull --ignore-buildable 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

log "Tous les conteneurs démarrés"

# =============================================================================
section "8/9 — Installation du service systemd (démarrage automatique)"
# =============================================================================
cat > /etc/systemd/system/reclamtrack.service <<EOF
[Unit]
Description=ReclamTrack Application Stack
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=300
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable reclamtrack
log "Service systemd 'reclamtrack' activé (démarrage automatique au boot)"

# =============================================================================
section "9/9 — Configuration du Firewall"
# =============================================================================
systemctl enable --now firewalld

# Ports nécessaires
for port in 3000 5001 8080 9090 3001; do
  firewall-cmd --permanent --add-port="${port}/tcp" 2>/dev/null || true
done
firewall-cmd --reload
log "Ports ouverts : 3000 (Frontend), 5001 (API), 8080 (Kafka UI), 9090 (Prometheus), 3001 (Grafana)"

# =============================================================================
# ── Résumé final ─────────────────────────────────────────────────────────────
# =============================================================================
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║        ✅ RECLAMTRACK INSTALLÉ AVEC SUCCÈS !         ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
IP=$(hostname -I | awk '{print $1}')
echo -e "  🌐 Frontend   : ${CYAN}http://${IP}:3000${NC}"
echo -e "  🔧 API Backend: ${CYAN}http://${IP}:5001${NC}"
echo -e "  📊 Grafana    : ${CYAN}http://${IP}:3001${NC}  (admin / reclamtrack2024)"
echo -e "  📈 Prometheus : ${CYAN}http://${IP}:9090${NC}"
echo -e "  📨 Kafka UI   : ${CYAN}http://${IP}:8080${NC}"
echo -e "  📄 API Docs   : ${CYAN}http://${IP}:5001/api-docs${NC}"
echo ""
echo -e "  ${YELLOW}⚠  Modifiez ${INSTALL_DIR}/.env pour la production !${NC}"
echo ""
echo -e "  Commandes utiles :"
echo -e "  ${CYAN}sudo systemctl status reclamtrack${NC}  — statut"
echo -e "  ${CYAN}cd ${INSTALL_DIR} && docker compose logs -f${NC} — logs live"
echo -e "  ${CYAN}cd ${INSTALL_DIR} && docker compose down${NC} — arrêt"
echo -e "  ${CYAN}cd ${INSTALL_DIR} && docker compose up -d${NC} — démarrage"
echo ""
