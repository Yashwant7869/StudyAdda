const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  getGenre,
  getAllGenres,
  addGenre,
  updateGenre,
  deleteGenre
} = require('../controllers/genreController');

// Members can read genres (for book browsing/filter)
router.get('/getAll', isAuthenticated, getAllGenres);
router.get('/get/:id', isAuthenticated, getGenre);

// Admin-only
router.post('/add', isAuthenticated, isAdmin, addGenre);
router.put('/update/:id', isAuthenticated, isAdmin, updateGenre);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteGenre);

module.exports = router;
