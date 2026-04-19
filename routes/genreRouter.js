const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
  getGenre,
  getAllGenres,
  addGenre,
  updateGenre,
  deleteGenre
} = require('../controllers/genreController');

// Members can read genres (for book browsing/filter)
router.get('/getAll', getAllGenres);
router.get('/get/:id', getGenre);

// Admin-only
router.post('/add', isAdmin, addGenre);
router.put('/update/:id', isAdmin, updateGenre);
router.delete('/delete/:id', isAdmin, deleteGenre);

module.exports = router;
