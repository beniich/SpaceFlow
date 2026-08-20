const { createCrudController } = require('../lib/crudFactory');
const { body, param, validationResult } = require('express-validator');

const crud = createCrudController('workOrder', {
  searchable: ['title', 'number', 'description'],
  sortable: ['createdAt', 'priority', 'status', 'dueDate'],
  defaultSort: { createdAt: 'desc' },
  relations: {
    asset: { select: { name: true } },
    assignedTo: { select: { firstName: true, lastName: true } }
  },
  softDelete: false
});

exports.maintenanceValidation = {
  create: [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Titre requis'),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    body('priority').optional().isIn(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']),
    body('assetId').optional().isUUID(),
    body('assignedToId').optional().isUUID(),
    body('dueDate').optional().isISO8601()
  ],
  update: [
    param('id').isUUID(),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    body('priority').optional().isIn(['LOW', 'NORMAL', 'HIGH', 'CRITICAL'])
  ]
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'VALIDATION_FAILED',
      details: errors.array() 
    });
  }
  next();
};

exports.getAll = crud.list;
exports.getById = crud.getById;
exports.create = [
  ...exports.maintenanceValidation.create,
  validate,
  crud.create
];
exports.update = [
  ...exports.maintenanceValidation.update,
  validate,
  crud.update
];
exports.delete = crud.delete;
