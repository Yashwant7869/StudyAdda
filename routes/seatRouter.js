const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const seatController = require('../controllers/seatController');

// Public stats (can be shown on login page if needed)
router.get('/statistics', seatController.getSeatStatistics);

// All other routes require authentication
router.use(isAuthenticated);

router.get('/', seatController.getAllSeats);
router.get('/my-booking', seatController.getCurrentBooking);
router.get('/my-bookings', seatController.getUserBookings);
router.get('/:id', seatController.getSeatById);

// Member can book/release their own seat
router.post('/:seatId/book', seatController.bookSeat);
router.post('/:seatId/release', seatController.releaseSeat);

// Admin-only seat management
router.post('/initialize', isAdmin, seatController.initializeSeats);
router.post('/', isAdmin, seatController.createSeat);
router.patch('/:seatId/status', isAdmin, seatController.updateSeatStatus);
router.delete('/:id', isAdmin, seatController.deleteSeat);

module.exports = router;
