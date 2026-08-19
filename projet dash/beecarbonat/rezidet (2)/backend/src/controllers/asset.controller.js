/**
 * @swagger
 * /api/assets:
 *   get:
 *     tags: [Assets]
 *     summary: Liste des actifs
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche par nom ou numéro de série
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPERATIONAL, MAINTENANCE, BREAKDOWN, RETIRED]
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: buildingId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Liste des actifs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     tags: [Assets]
 *     summary: Créer un nouvel actif
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetInput'
 *     responses:
 *       201:
 *         description: Actif créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /api/assets/{id}:
 *   get:
 *     tags: [Assets]
 *     summary: Détail d'un actif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Détails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     tags: [Assets]
 *     summary: Modifier un actif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetInput'
 *     responses:
 *       200:
 *         description: Actif modifié
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     tags: [Assets]
 *     summary: Supprimer un actif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Supprimé
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const prisma = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { search, status, category, buildingId } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) where.status = status;
    if (category) where.category = category;
    if (buildingId) where.buildingId = buildingId;

    const assets = await prisma.asset.findMany({
      where,
      include: {
        building: { select: { name: true } },
        manager: { select: { firstName: true, lastName: true } },
        sensors: true,
        _count: { select: { workOrders: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
      include: {
        building: true,
        manager: { select: { firstName: true, lastName: true, email: true } },
        sensors: { include: { readings: { orderBy: { timestamp: 'desc' }, take: 50 } } },
        workOrders: { orderBy: { createdAt: 'desc' }, take: 10 },
        maintenanceLogs: { orderBy: { performedAt: 'desc' }, take: 20 }
      }
    });
    if (!asset) return res.status(404).json({ error: 'Actif non trouvé' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const asset = await prisma.asset.create({
      data: req.body
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.json({ message: 'Actif supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [total, operational, maintenance, breakdown, byCategory] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'OPERATIONAL' } }),
      prisma.asset.count({ where: { status: 'MAINTENANCE' } }),
      prisma.asset.count({ where: { status: 'BREAKDOWN' } }),
      prisma.asset.groupBy({
        by: ['category'],
        _count: { category: true },
        _avg: { healthScore: true, purchasePrice: true }
      })
    ]);
    res.json({
      total,
      operational,
      maintenance,
      breakdown,
      byCategory,
      averageHealth: await prisma.asset.aggregate({ _avg: { healthScore: true } })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/assets/by-ifc-guid/:guid
 * Récupère un asset depuis son IFC GlobalId (pour le hook useAssetFromBIM)
 */
exports.getByIfcGuid = async (req, res) => {
  try {
    const { guid } = req.params;
    const asset = await prisma.asset.findFirst({
      where: { ifcGuid: guid },
      include: {
        building: { select: { id: true, name: true, city: true } },
        floor: { select: { id: true, name: true, level: true } },
        space: { select: { id: true, name: true, type: true } },
        sensors: { where: { status: 'active' }, take: 5 },
        workOrders: {
          where: { status: { in: ['PENDING', 'IN_PROGRESS', 'ASSIGNED'] } },
          orderBy: { scheduledAt: 'asc' },
          take: 3,
          select: { id: true, title: true, priority: true, status: true, scheduledAt: true }
        }
      }
    });
    if (!asset) return res.status(404).json({ error: 'Asset non trouvé pour ce GUID IFC' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/assets/hierarchy/:buildingId
 * Retourne la hiérarchie complète : Étages → Locaux → Assets
 * Pour l'arbre de navigation du bâtiment dans le frontend
 */
exports.getHierarchy = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const floors = await prisma.floor.findMany({
      where: { buildingId },
      orderBy: { level: 'asc' },
      include: {
        spaces: {
          include: {
            assets: {
              select: {
                id: true, name: true, category: true, status: true,
                healthScore: true, ifcGuid: true, tagNumber: true
              }
            }
          }
        },
        assets: {
          where: { spaceId: null }, // Assets directement sur l'étage (sans local précis)
          select: {
            id: true, name: true, category: true, status: true,
            healthScore: true, ifcGuid: true, tagNumber: true
          }
        }
      }
    });
    res.json({ buildingId, floors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
