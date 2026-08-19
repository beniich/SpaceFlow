# Guide d'Intégration Grafana - ReclamTrack

## 🎯 Vue d'Ensemble

Grafana a été intégré dans ReclamTrack pour fournir une surveillance en temps réel des performances de l'application. Cette intégration est accessible uniquement aux **superadministrateurs**.

---

## 🏗️ Architecture de Monitoring

### Stack de Surveillance
- **Grafana** : Interface de visualisation (Port 3001)
- **Prometheus** : Collecte des métriques (Port 9090)
- **Node Exporter** : Métriques système (Port 9100)

### Schéma de Flux
```
ReclamTrack Backend → Prometheus → Grafana → Frontend (Superadmin)
System Metrics → Node Exporter → Prometheus → Grafana
```

---

## 🚀 Démarrage

### Option 1 : Avec Docker Compose (Recommandé)

```bash
# Lancer toute la stack (incluant monitoring)
docker-compose up -d

# Vérifier que Grafana est actif
docker logs grafana

# Accéder à Grafana
# URL: http://localhost:3001
# User: admin
# Pass: reclamtrack2024
```

### Option 2 : Local (Développement)

**1. Installer Prometheus**
```bash
# Windows (via Chocolatey)
choco install prometheus

# Ou télécharger depuis https://prometheus.io/download/
```

**2. Lancer Prometheus**
```bash
cd monitoring
prometheus --config.file=prometheus.yml
```

**3. Installer Grafana**
```bash
# Windows (via Chocolatey)
choco install grafana

# Ou télécharger depuis https://grafana.com/grafana/download
```

**4. Lancer Grafana**
```bash
# Windows Service (auto-start)
net start grafana

# Ou manuellement
grafana-server
```

---

## 🔐 Accès Frontend

### Compte Superadministrateur

Pour accéder à la page de monitoring dans le frontend :

**Identifiants** :
```
Email: superadmin@reclamtrack.com
Mot de passe: SuperAdmin123!
```

**URL** :
```
http://localhost:3000/[locale]/admin/monitoring
```

### Navigation
1. Connectez-vous avec le compte superadmin
2. Allez dans le menu Admin
3. Cliquez sur "Monitoring" ou accédez directement à `/admin/monitoring`

---

## 📊 Configuration des Dashboards

### Créer un Dashboard ReclamTrack

1. Accédez à Grafana : `http://localhost:3001`
2. Connectez-vous (admin / reclamtrack2024)
3. Allez dans **Dashboards > New Dashboard**
4. Ajoutez des panels avec les métriques suivantes :

#### Métriques Clés

**API Performance** :
```promql
# Temps de réponse moyen
avg(http_request_duration_seconds)

# Requêtes par seconde
rate(http_requests_total[5m])

# Taux d'erreur
rate(http_requests_total{status=~"5.."}[5m])
```

**System Metrics** :
```promql
# CPU Usage
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk Usage
(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100
```

**Database (MongoDB)** :
```promql
# Connexions actives
mongodb_connections{state="current"}

# Requêtes par seconde
rate(mongodb_op_counters_total[5m])
```

---

## 🔧 Variables d'Environnement

### Frontend `.env.local`
```env
NEXT_PUBLIC_GRAFANA_URL=http://localhost:3001
```

### Backend Variables
```env
# Pas de variables spécifiques pour Grafana
# Metrics endpoint sera exposé automatiquement
```

---

## 📈 Bonnes Pratiques

### 1. Dashboards Recommandés
- **ReclamTrack Overview** : Vue d'ensemble de l'application
- **API Performance** : Métriques des endpoints
- **System Health** : CPU, RAM, Disk
- **Database Monitoring** : MongoDB métriques

### 2. Alertes à Configurer
```yaml
# Exemple d'alerte : CPU élevé
- alert: HighCPUUsage
  expr: avg(cpu_usage) > 80
  for: 5m
  annotations:
    summary: "CPU usage above 80% for 5 minutes"
```

### 3. Rétention des Données
```yaml
# prometheus.yml
storage:
  tsdb:
    retention.time: 15d  # Garder 15 jours de données
```

---

## 🐛 Dépannage

### Grafana ne démarre pas
```bash
# Vérifier les logs
docker logs grafana

# Si erreur de permissions
docker-compose down
docker volume rm reclamtrack_grafana-data
docker-compose up -d grafana
```

### Prometheus ne récupère pas les métriques
```bash
# Vérifier la configuration
curl http://localhost:9090/api/v1/targets

# Vérifier que le backend expose /metrics
curl http://localhost:5001/metrics
```

### Iframe bloqué dans le frontend
Si l'iframe Grafana est bloqué, ajoutez dans `grafana.ini` :
```ini
[security]
allow_embedding = true
cookie_samesite = none
```

---

## 🔐 Sécurité

**Important** :
- Les identifiants par défaut doivent être changés en production
- L'accès à la page monitoring est réservé aux superadmins
- Prometheus et Grafana ne doivent pas être exposés publiquement (utilisez un reverse proxy avec auth)

**Recommandations Production** :
```bash
# Changer le mot de passe Grafana
docker exec -it grafana grafana-cli admin reset-admin-password NEW_PASSWORD

# Restreindre l'accès réseau
# Utiliser un firewall ou nginx proxy avec authentification
```

---

## 📚 Ressources

- [Documentation Grafana](https://grafana.com/docs/)
- [Prometheus Query Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Node Exporter Metrics](https://github.com/prometheus/node_exporter)

---

**Note** : Pour exécuter le monitoring en production, assurez-vous que tous les services Docker sont démarrés avec `docker-compose up -d`.
