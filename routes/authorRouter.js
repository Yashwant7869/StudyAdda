const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  getAuthor,
  getAllAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');

// Members can read authors (for book browsing)
router.get('/getAll', isAuthenticated, getAllAuthors);
router.get('/get/:id', isAuthenticated, getAuthor);

// Admin-only
router.post('/add', isAuthenticated, isAdmin, addAuthor);
router.put('/update/:id', isAuthenticated, isAdmin, updateAuthor);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteAuthor);

module.exports = router;
