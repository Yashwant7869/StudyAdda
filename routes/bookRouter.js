const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const { isAdmin } = require('../middleware/auth');
const {
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// Public read access (members can also browse books)
router.get('/getAll', getAllBooks);
router.get('/get/:id', getBook);

// Admin-only write access
// router.post('/add', isAdmin, addBook);
router.post('/add', isAdmin, upload.single("image"), addBook);
// router.put('/update/:id', isAdmin, updateBook);
router.put('/update/:id', isAdmin, upload.single("image"), updateBook);
router.delete('/delete/:id', isAdmin, deleteBook);

module.exports = router;
