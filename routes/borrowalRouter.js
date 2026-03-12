const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  getBorrowal,
  getAllBorrowals,
  addBorrowal,
  returnBorrowal,
  updateBorrowal,
  deleteBorrowal,
  getBorrowalsByStudent,
  getIssuedBooksByStudent,
  searchAvailableBooks
} = require('../controllers/borrowalController');

router.use(isAuthenticated);

// Search available books (for issue dialog) - must be before /:id routes
router.get('/available-books', isAdmin, searchAvailableBooks);

// Student borrowal history
router.get('/student/:studentId/history', isAdmin, getBorrowalsByStudent);

// Currently issued books for a student
router.get('/student/:studentId/issued', isAdmin, getIssuedBooksByStudent);

// Admin CRUD
router.get('/getAll', isAdmin, getAllBorrowals);
router.get('/get/:id', isAdmin, getBorrowal);
router.post('/add', isAdmin, addBorrowal);
router.post('/return/:id', isAdmin, returnBorrowal);
router.put('/update/:id', isAdmin, updateBorrowal);
router.delete('/delete/:id', isAdmin, deleteBorrowal);

module.exports = router;
