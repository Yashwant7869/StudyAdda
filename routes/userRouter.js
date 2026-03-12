const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  blockStudent,
  unblockStudent,
  getStudentByScholarNumber,
  getStudentByEnrollmentNumber,
  getStudentByRFID,
  getMyProfile
} = require('../controllers/userController');

router.use(isAuthenticated);

// Profile route for logged-in user
router.get('/me', getMyProfile);

// Admin-only routes
router.get('/getAll', isAdmin, getAllUsers);
router.get('/getAllMembers', isAdmin, getAllMembers);
router.get('/get/:id', isAdmin, getUser);
router.post('/add', isAdmin, addUser);
router.put('/update/:id', isAdmin, updateUser);
router.delete('/delete/:id', isAdmin, deleteUser);

// Student management
router.patch('/:id/block', isAdmin, blockStudent);
router.patch('/:id/unblock', isAdmin, unblockStudent);

// Student search
router.get('/search/scholar/:scholarNumber', isAdmin, getStudentByScholarNumber);
router.get('/search/enrollment/:enrollmentNumber', isAdmin, getStudentByEnrollmentNumber);
router.get('/search/rfid/:rfidCard', isAdmin, getStudentByRFID);

module.exports = router;
