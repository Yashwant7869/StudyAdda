const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Public routes - get all seats and statistics
router.get('/', seatController.getAllSeats);
router.get('/statistics', seatController.getSeatStatistics);

// Protected routes - require authentication
router.get('/my-booking', seatController.getCurrentBooking);
router.get('/my-bookings', seatController.getUserBookings);
router.get('/:id', seatController.getSeatById);
router.post('/:seatId/book', seatController.bookSeat);
router.post('/:seatId/release', seatController.releaseSeat);

// Admin routes
router.post('/initialize', seatController.initializeSeats);
router.post('/', seatController.createSeat);
router.patch('/:seatId/status', seatController.updateSeatStatus);
router.delete('/:id', seatController.deleteSeat);

module.exports = router;
