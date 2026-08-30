const workorderController = require('../../controllers/workorder.controller');
const { prisma } = require('../../config/database');

const mockReq = (body = {}, params = {}, query = {}, user = { id: 'user-1', organizationId: 'org-1' }) => ({
  body, params, query, user,
  app: { get: jest.fn() },
});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockWO = (overrides = {}) => ({
  id: 'wo-uuid-1',
  title: 'Maintenance préventive HVAC',
  type: 'PREVENTIVE',
  priority: 'HIGH',
  status: 'PENDING',
  scheduledAt: new Date(),
  estimatedCost: 500,
  assetId: 'asset-1',
  organizationId: 'org-1',
  asset: { id: 'asset-1', name: 'HVAC Zone A' },
  assignedTo: null,
  ...overrides,
});

describe('WorkOrder Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAll()', () => {
    it('retourne la liste des WO', async () => {
      prisma.workOrder.findMany.mockResolvedValue([mockWO(), mockWO({ id: 'wo-2', status: 'IN_PROGRESS' })]);
      prisma.workOrder.count.mockResolvedValue(2);

      const req = mockReq();
      const res = mockRes();

      await workorderController.getAll(req, res);

      expect(prisma.workOrder.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('filtre par statut', async () => {
      prisma.workOrder.findMany.mockResolvedValue([mockWO({ status: 'PENDING' })]);
      prisma.workOrder.count.mockResolvedValue(1);

      const req = mockReq({}, {}, { status: 'PENDING' });
      const res = mockRes();

      await workorderController.getAll(req, res);

      expect(prisma.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PENDING' }),
        })
      );
    });

    it('filtre par priorité', async () => {
      prisma.workOrder.findMany.mockResolvedValue([mockWO({ priority: 'CRITICAL' })]);
      prisma.workOrder.count.mockResolvedValue(1);

      const req = mockReq({}, {}, { priority: 'CRITICAL' });
      const res = mockRes();

      await workorderController.getAll(req, res);

      expect(prisma.workOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ priority: 'CRITICAL' }),
        })
      );
    });
  });

  describe('create()', () => {
    it('crée un WO et retourne 201', async () => {
      const created = mockWO();
      prisma.workOrder.create.mockResolvedValue(created);

      const req = mockReq({
        title: 'Maintenance préventive HVAC',
        type: 'PREVENTIVE',
        priority: 'HIGH',
        assetId: 'asset-1',
        scheduledAt: new Date().toISOString(),
        estimatedCost: 500,
      });
      const res = mockRes();

      await workorderController.create(req, res);

      expect(prisma.workOrder.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('update()', () => {
    it('met à jour un WO existant', async () => {
      const existingWO = mockWO({ id: 'wo-uuid-1', title: 'Ancien titre' });
      const updatedWO = mockWO({ id: 'wo-uuid-1', title: 'Nouveau titre' });

      prisma.workOrder.findUnique.mockResolvedValue(existingWO);
      prisma.workOrder.update.mockResolvedValue(updatedWO);

      const req = mockReq({ title: 'Nouveau titre' }, { id: 'wo-uuid-1' });
      const res = mockRes();

      await workorderController.update(req, res);

      expect(prisma.workOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'wo-uuid-1' },
        })
      );
      expect(res.json).toHaveBeenCalledWith(updatedWO);
    });

    it('retourne 404 si le WO n\'existe pas', async () => {
      prisma.workOrder.findUnique.mockResolvedValue(null);

      const req = mockReq({ title: 'Titre' }, { id: 'inconnu' });
      const res = mockRes();

      await workorderController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('retourne 400 en cas d\'erreur de mise à jour', async () => {
      const existingWO = mockWO({ id: 'wo-uuid-1' });
      prisma.workOrder.findUnique.mockResolvedValue(existingWO);
      prisma.workOrder.update.mockRejectedValue(new Error('Erreur DB'));

      const req = mockReq({ title: 'Titre' }, { id: 'wo-uuid-1' });
      const res = mockRes();

      await workorderController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateStatus()', () => {
    it('met à jour le statut COMPLETED d’un WO + crée maintenance log', async () => {
      const existingWO = mockWO({ id: 'wo-uuid-1', status: 'IN_PROGRESS', assetId: 'asset-1' });
      const completedWO = mockWO({ id: 'wo-uuid-1', status: 'COMPLETED', completedAt: new Date(), assetId: 'asset-1' });

      prisma.workOrder.findUnique.mockResolvedValue(existingWO);
      prisma.workOrder.update.mockResolvedValue(completedWO);
      prisma.maintenanceLog = { create: jest.fn().mockResolvedValue({}) };

      const req = mockReq({ status: 'COMPLETED', actualDuration: 120, resolutionNotes: 'Terminé' }, { id: 'wo-uuid-1' });
      const res = mockRes();

      await workorderController.updateStatus(req, res);

      expect(prisma.workOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'wo-uuid-1' },
        })
      );
    });
  });
});
