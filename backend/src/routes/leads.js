const express = require('express');
const { body, query, param } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createLead,
  listLeads,
  getLeadById,
  updateLead,
  searchLeads,
} = require('../controllers/leadsController');
const { leadSources, connectivityStatuses, currentStatuses } = require('../utils/enums');

const router = express.Router();

const leadValidators = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('phone').trim().notEmpty().withMessage('phone is required'),
  body('email').optional({ nullable: true }).isEmail().withMessage('email must be valid'),
  body('source').isIn(leadSources).withMessage('invalid source'),
  body('connectivity_status').isIn(connectivityStatuses).withMessage('invalid connectivity_status'),
  body('current_status').isIn(currentStatuses).withMessage('invalid current_status'),
  body('assigned_to').optional({ nullable: true }).isInt({ min: 1 }).withMessage('assigned_to must be a valid counselor id'),
];

router.post('/', leadValidators, validate, createLead);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  listLeads,
);

router.get(
  '/search',
  [
    query('source').optional().isIn(leadSources),
    query('status').optional().isIn(currentStatuses),
    query('connectivity').optional().isIn(connectivityStatuses),
    query('assigned_to').optional().isInt({ min: 1 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  searchLeads,
);

router.get('/:id', [param('id').isInt({ min: 1 })], validate, getLeadById);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('email').optional({ nullable: true }).isEmail(),
    body('source').optional().isIn(leadSources),
    body('connectivity_status').optional().isIn(connectivityStatuses),
    body('current_status').optional().isIn(currentStatuses),
    body('assigned_to').optional({ nullable: true }).custom((value) => value === null || Number.isInteger(value)),
  ],
  validate,
  updateLead,
);

module.exports = router;
