const workorderController = require('../controllers/workorder.controller');
const { prisma } = require('../config/database');

describe('WorkOrder Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      query: {},
      params: {},
      body: {},
      user: { id: 'usr-1', fullName: 'Tech Admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  test('getAll should return work orders filtered by status', async () => {
    req.query = { status: 'OPEN' };
    const mockList = [{ id: 'wo-1', title: 'Réparation Climatisation', status: 'OPEN' }];
    prisma.workOrder.findMany.mockResolvedValueOnce(mockList);

    await workorderController.getAll(req, res);

    expect(prisma.workOrder.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { status: 'OPEN' }
    }));
    expect(res.json).toHaveBeenCalledWith(mockList);
  });

  test('create should create a work order with audit trail', async () => {
    req.body = {
      title: 'Vérification Groupe Électrogène',
      priority: 'HIGH',
      status: 'OPEN'
    };
    const createdWO = { id: 'wo-new-1', ...req.body, createdById: 'usr-1' };
    prisma.workOrder.create.mockResolvedValueOnce(createdWO);

    await workorderController.create(req, res);

    expect(prisma.workOrder.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        title: 'Vérification Groupe Électrogène',
        createdById: 'usr-1',
        auditLog: expect.any(Array)
      })
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdWO);
  });
});
