const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  collectFine,
  getAllPayments,
  getStudentPayments,
  getPaymentStats
} = require('../controllers/paymentController');

router.use(isAuthenticated);

// GET all payments (admin)
router.get('/', isAdmin, getAllPayments);

// GET payment stats
router.get('/stats', isAdmin, getPaymentStats);

// GET payment history for a student
router.get('/student/:studentId', isAdmin, getStudentPayments);

// POST collect fine payment
router.post('/collect', isAdmin, collectFine);

module.exports = router;
