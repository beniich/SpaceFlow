#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/cafm_${TIMESTAMP}.sql.gz"

mkdir -p backups

echo "📦 Backup vers ${BACKUP_FILE}..."
docker-compose exec -T postgres pg_dump -U cafm_user cafm_db | gzip > "${BACKUP_FILE}"

# Garder seulement les 30 derniers backups
ls -t backups/cafm_*.sql.gz | tail -n +31 | xargs -r rm

echo "✅ Backup créé: $(du -h ${BACKUP_FILE} | cut -f1)"
