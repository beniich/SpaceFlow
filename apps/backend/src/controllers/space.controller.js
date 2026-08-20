const { createCrudController } = require('../lib/crudFactory');
const { body, param, validationResult } = require('express-validator');

const crud = createCrudController('space', {
  searchable: ['name', 'code'],
  sortable: ['name', 'createdAt', 'area'],
  defaultSort: { name: 'asc' },
  relations: {
    building: { select: { name: true } }
  },
  softDelete: false // Depends on prisma schema, assume false if deletedAt is absent
});

exports.spaceValidation = {
  create: [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Nom requis (1-100 chars)'),
    body('code').optional().trim().isLength({ min: 1, max: 20 }),
    body('buildingId').isUUID().withMessage('buildingId doit être un UUID valide'),
    body('area').optional().isFloat({ min: 0 }),
    body('type').optional().isIn(['office', 'meeting', 'common', 'OTHER']),
    body('floor').optional().isInt()
  ],
  update: [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('area').optional().isFloat({ min: 0 })
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
  ...exports.spaceValidation.create,
  validate,
  crud.create
];
exports.update = [
  ...exports.spaceValidation.update,
  validate,
  crud.update
];
exports.delete = crud.delete;
