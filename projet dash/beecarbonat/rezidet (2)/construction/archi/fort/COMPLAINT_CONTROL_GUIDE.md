# Guide du Contrôle des Plaintes

## 📋 Vue d'ensemble

Le système de contrôle des plaintes permet aux administrateurs/superviseurs d'approuver ou de rejeter les nouvelles plaintes avant qu'elles ne soient traitées par les équipes techniques.

## 🔄 Workflow

```
Nouvelle Plainte (status: 'nouvelle')
    ↓
    ├── Approuver → Status: 'en cours' (peut être assignée et traitée)
    └── Rejeter → Status: 'rejetée' (avec motif de rejet)
```

## 🛠️ Implémentation Backend

### Modèle de données

**Nouveau champ ajouté au modèle `Complaint`:**

```typescript
rejectionReason?: string  // Motif du rejet (requis si status = 'rejetée')
```

### API Endpoints

#### 1. Approuver une plainte

```http
POST /api/complaints/:id/approve
Authorization: Bearer {token}
x-organization-id: {organizationId}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Complaint approved successfully",
  "data": {
    "_id": "...",
    "number": "REC-20260217-1234",
    "status": "en cours",
    ...
  }
}
```

**Actions automatiques:**

- Change le status à `'en cours'`
- Envoie une notification à l'équipe assignée (si existe)
- Crée un log d'audit
- Publie un événement Kafka `COMPLAINT_APPROVED`

#### 2. Rejeter une plainte

```http
POST /api/complaints/:id/reject
Authorization: Bearer {token}
x-organization-id: {organizationId}
Content-Type: application/json

{
  "rejectionReason": "La plainte ne relève pas de notre compétence"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Complaint rejected successfully",
  "data": {
    "_id": "...",
    "number": "REC-20260217-1234",
    "status": "rejetée",
    "rejectionReason": "La plainte ne relève pas de notre compétence",
    ...
  }
}
```

**Actions automatiques:**

- Change le status à `'rejetée'`
- Stocke le motif de rejet
- Crée un log d'audit
- Publie un événement Kafka `COMPLAINT_REJECTED`

### Règles de Validation

**Approuver:**

- ✅ La plainte doit exister
- ✅ Le status doit être `'nouvelle'`
- ❌ Impossible d'approuver une plainte déjà traitée

**Rejeter:**

- ✅ La plainte doit exister
- ✅ Le status doit être `'nouvelle'`
- ✅ Un motif de rejet est **obligatoire**
- ❌ Impossible de rejeter une plainte déjà traitée

## 🎨 Implémentation Frontend (à venir)

### Page de contrôle suggérée

Créer une page `/complaints/pending` qui liste toutes les plaintes avec `status: 'nouvelle'`.

**Fonctionnalités:**

- Liste des plaintes en attente
- Boutons d'action : "Approuver" / "Rejeter"
- Modal de rejet avec champ texte pour le motif
- Filtres par catégorie/priorité

**Exemple de composant React:**

```tsx
const PendingComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);

  const handleApprove = async (id) => {
    await api.post(`/api/complaints/${id}/approve`);
    toast.success("Plainte approuvée");
    loadComplaints();
  };

  const handleReject = async (id, reason) => {
    await api.post(`/api/complaints/${id}/reject`, { rejectionReason: reason });
    toast.success("Plainte rejetée");
    loadComplaints();
  };

  return (
    <div>
      {complaints
        .filter((c) => c.status === "nouvelle")
        .map((complaint) => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
            onApprove={() => handleApprove(complaint._id)}
            onReject={(reason) => handleReject(complaint._id, reason)}
          />
        ))}
    </div>
  );
};
```

## 📊 Statistiques et Reporting

Les actions d'approbation/rejet sont trackées via:

1. **Audit Logs**: Actions `APPROVE_COMPLAINT` et `REJECT_COMPLAINT`
2. **Kafka Events**: Pour intégrations externes et analytics
3. **Status Aggregation**: Utiliser `/api/complaints/stats` pour voir la répartition

## 🔒 Permissions

**Recommandation:**

- Seuls les utilisateurs avec role `admin` ou `manager` devraient pouvoir approuver/rejeter.
- Ajouter un middleware de vérification de rôle si nécessaire:

```typescript
import { requireRole } from '../middleware/organization.js';

router.post('/:id/approve', requireRole(['admin', 'manager']), ...);
router.post('/:id/reject', requireRole(['admin', 'manager']), ...);
```

## 🧪 Tests

### Exemple de test avec curl

**Approuver:**

```bash
curl -X POST http://localhost:5000/api/complaints/65f1234567890abcdef12345/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-organization-id: YOUR_ORG_ID"
```

**Rejeter:**

```bash
curl -X POST http://localhost:5000/api/complaints/65f1234567890abcdef12345/reject \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-organization-id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{"rejectionReason": "Hors périmètre"}'
```

## 📝 Notes de Migration

Si vous avez des plaintes existantes dans la base de données, elles conserveront leur status actuel. Seules les nouvelles plaintes (status = 'nouvelle') pourront être approuvées/rejetées.

---

**Date de création:** 2026-02-17  
**Version:** 1.0
