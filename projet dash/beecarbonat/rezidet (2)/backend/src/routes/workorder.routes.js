const router = require('express').Router();
const ctrl = require('../controllers/workorder.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const prisma = require('../config/database');

router.use(authMiddleware);

// Upload plans 2D en local (dev) ou S3 (prod via config/upload.js)
let uploadPlan;
try {
  const { uploadMiddleware } = require('../config/upload');
  uploadPlan = uploadMiddleware;
} catch {
  // Fallback multer local si S3 non configuré
  uploadPlan = multer({
    dest: 'uploads/plans/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (req, file, cb) => {
      const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.svg'];
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, allowed.includes(ext));
    }
  });
}

// ── Stats et Templates (routes statiques AVANT /:id) ──────────────────────────
router.get('/stats', ctrl.getStats);
router.get('/templates', ctrl.getTemplates);
router.post('/templates', ctrl.createTemplate);

// ── CRUD principal ─────────────────────────────────────────────────────────────
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

// ── Clôture terrain (signature + photos) ──────────────────────────────────────
router.post('/:id/close', ctrl.close);

// ── Upload plan 2D (PDF ou image) associé à un bâtiment ───────────────────────
// POST /api/workorders/plans/upload — corps: { buildingId, floorId?, name }
router.post('/plans/upload', uploadPlan.single('plan'), async (req, res) => {
  try {
    const { buildingId, floorId, name } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });

    // URL selon le stockage (S3 location ou local path)
    const fileUrl = req.file.location || `/uploads/plans/${req.file.filename}`;
    const fileSize = req.file.size;

    // Si floorId, mettre à jour l'étage avec l'URL du plan
    if (floorId) {
      await prisma.floor.update({
        where: { id: floorId },
        data: { floorPlanUrl: fileUrl }
      });
    }

    res.json({
      success: true,
      fileUrl,
      fileSize,
      buildingId,
      floorId: floorId || null,
      name: name || req.file.originalname,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Annotations de plan 2D ─────────────────────────────────────────────────────
// POST /api/workorders/plans/:floorId/annotations
router.post('/plans/:floorId/annotations', async (req, res) => {
  try {
    const { floorId } = req.params;
    const { annotations } = req.body; // [{x, y, type, label, woId?, assetId?}]

    const floor = await prisma.floor.findUnique({ where: { id: floorId } });
    if (!floor) return res.status(404).json({ error: 'Étage introuvable' });

    // Stocker les annotations dans un champ JSON (on réutilise la relation Floor)
    // Pour un MVP, on peut les stocker dans la table Floor via un champ metadata
    // Ici on retourne simplement la confirmation (les annotations sont gérées côté frontend avec IndexedDB ou state)
    res.json({
      success: true,
      floorId,
      annotationsCount: Array.isArray(annotations) ? annotations.length : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Commentaires WO ────────────────────────────────────────────────────────────
router.post('/:id/comments', async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        workOrderId: req.params.id,
        authorId: req.user.id
      },
      include: { author: { select: { firstName: true, lastName: true, avatar: true } } }
    });

    // Notification temps réel
    const io = req.app.get('io');
    if (io) io.emit('wo:comment', { workOrderId: req.params.id, comment });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
