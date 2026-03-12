const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// Public read access (members can also browse books)
router.get('/getAll', isAuthenticated, getAllBooks);
router.get('/get/:id', isAuthenticated, getBook);

// Admin-only write access
router.post('/add', isAuthenticated, isAdmin, addBook);
router.put('/update/:id', isAuthenticated, isAdmin, updateBook);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteBook);

module.exports = router;
