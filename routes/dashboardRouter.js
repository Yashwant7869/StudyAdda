const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', isAuthenticated, isAdmin, getDashboardStats);

module.exports = router;
