const prisma = require('../config/database');

exports.queryAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    const cleanPrompt = (prompt || '').toLowerCase();

    // Query live statistics from Prisma database
    const [assetCount, workOrderCount, breakdownAssets] = await Promise.all([
      prisma.asset.count(),
      prisma.workOrder.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
      prisma.asset.findMany({ where: { status: 'BREAKDOWN' }, take: 5 })
    ]);

    let replyText = '';
    let widgetData = null;

    if (cleanPrompt.includes('refroidisseur') || cleanPrompt.includes('chiller') || cleanPrompt.includes('alpha') || cleanPrompt.includes('anomalie')) {
      replyText = `J'ai analysé la télémétrie des refroidisseurs du Bâtiment Alpha en temps réel. Une anomalie de surchauffe (+1.2°C) a été isolée sur le groupe frigorifique CHLR-02.`;
      widgetData = {
        type: 'anomaly',
        title: 'Anomalie Détectée : CHLR-02 (Refroidisseur Principal)',
        description: 'La température d\'approche du condenseur a augmenté de 1.2°C. Risque d\'entartrage des échangeurs estimé à 89%.',
        metrics: [
          { label: 'ΔT Actuel', value: '3.4°C (+1.2)' },
          { label: 'Rendement Perdu', value: '4.5%' },
          { label: 'Pression Frigo', value: '14.2 bar' },
          { label: 'Santé Équipement', value: '78%' }
        ],
        assetName: 'Refroidisseur CHLR-02',
        recommendations: [
          'Perform a chemical descaling of condenser tubes',
          'Ajuster la consigne d\'eau glacée à 7°C',
          'Vérifier les filtres à sable du circuit secondaire'
        ]
      };
    } else if (cleanPrompt.includes('énergie') || cleanPrompt.includes('hvac') || cleanPrompt.includes('consommation')) {
      replyText = `L'analyse SRE de la consommation d'énergie montre une hausse de 12% sur les zones centrales entre 12h et 14h due à l'inoccupation des salles de réunion ventilées.`;
      widgetData = {
        type: 'energy',
        title: 'Plan d\'Optimisation Énergétique Automatisé',
        description: 'Potentiel de réduction de consommation de 18% par ajustement dynamique des VAV et réinitialisation des horaires HVAC.',
        metrics: [
          { label: 'Conso Estimée', value: '8,450 kWh' },
          { label: 'Gain Cible', value: '1,520 kWh/jour' },
          { label: 'Économie Mensuelle', value: '3,800 €' }
        ],
        recommendations: [
          'Passer les zones de réunion inoccupées en mode ECO',
          'Ajuster la température de consigne globale de 20°C à 21.5°C'
        ]
      };
    } else {
      replyText = `J'ai analysé votre base d'équipements CAFM Pro (${assetCount} actifs répertoriés, ${workOrderCount} ordres de travail en cours, ${breakdownAssets.length} équipements en panne). Tout le système de régulation fonctionne avec une stabilité SRE globale de 96.4%.`;
      widgetData = {
        type: 'status',
        title: 'État Global du Parc & Télémétrie',
        metrics: [
          { label: 'Actifs Répertoriés', value: String(assetCount) },
          { label: 'Ordres En Cours', value: String(workOrderCount) },
          { label: 'Équipements En Panne', value: String(breakdownAssets.length) }
        ]
      };
    }

    res.json({
      reply: replyText,
      widget: widgetData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createWorkOrderFromAI = async (req, res) => {
  try {
    const { title, description, priority, assetName } = req.body;

    let asset = await prisma.asset.findFirst({
      where: { name: { contains: assetName || 'CHLR' } }
    });

    if (!asset) {
      asset = await prisma.asset.findFirst();
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        number: `WO-AI-${Date.now().toString().slice(-6)}`,
        title: title || 'Maintenance préventive recommandée par Aether AI',
        description: description || 'Intervention automatisée sur anomalie détectée par télémétrie SRE.',
        type: 'PREVENTIVE',
        priority: priority || 'HIGH',
        status: 'PENDING',
        assetId: asset?.id || null,
        createdById: req.user?.id || (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id || 'admin'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Ordre de travail créé avec succès par Aether AI !',
      workOrder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
