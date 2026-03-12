const CheckIn = require('../models/checkin');
const User = require('../models/user');

// Get all check-in records (with student info joined)
const getAllCheckIns = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.checkInTime = { $gte: today, $lt: tomorrow };
    }

    const records = await CheckIn.find(filter)
      .populate('studentId', 'name email scholarNumber enrollmentNumber photoUrl rfidCard')
      .sort({ checkInTime: -1 });

    // Shape for frontend
    const formatted = records.map(r => {
      const obj = r.toObject();
      obj.student = obj.studentId;
      return obj;
    });

    return res.status(200).json({ success: true, checkInsList: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

// Check in a student via RFID
const checkInStudent = async (req, res) => {
  try {
    const { rfidCard } = req.body;

    if (!rfidCard) {
      return res.status(400).json({ success: false, message: 'RFID card is required' });
    }

    // Find student by RFID
    const student = await User.findOne({ rfidCard, isAdmin: false });
    if (!student) {
      return res.status(404).json({ success: false, message: 'No student found with this RFID card' });
    }
    if (student.status === 'Blocked') {
      return res.status(403).json({ success: false, message: `Student ${student.name} is blocked` });
    }

    // Check if already checked in
    const existing = await CheckIn.findOne({ studentId: student._id, status: 'checked-in' });
    if (existing) {
      return res.status(400).json({ success: false, message: `${student.name} is already checked in` });
    }

    const record = await CheckIn.create({
      studentId: student._id,
      rfidCard,
      checkInTime: new Date(),
      status: 'checked-in'
    });

    return res.status(201).json({
      success: true,
      message: `${student.name} checked in successfully`,
      student: { name: student.name, scholarNumber: student.scholarNumber, photoUrl: student.photoUrl },
      checkIn: record
    });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

// Check out a student by check-in record ID
const checkOutStudent = async (req, res) => {
  try {
    const { checkInId } = req.params;

    const record = await CheckIn.findById(checkInId).populate('studentId', 'name scholarNumber photoUrl');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Check-in record not found' });
    }
    if (record.status === 'checked-out') {
      return res.status(400).json({ success: false, message: 'Student already checked out' });
    }

    const checkOutTime = new Date();
    const durationMs = checkOutTime - record.checkInTime;
    const durationMins = Math.round(durationMs / (1000 * 60));

    record.checkOutTime = checkOutTime;
    record.status = 'checked-out';
    record.duration = durationMins;
    await record.save();

    return res.status(200).json({
      success: true,
      message: `${record.studentId.name} checked out successfully`,
      student: { name: record.studentId.name },
      duration: durationMins,
      checkIn: record
    });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

// Check out by RFID (tap to exit)
const checkOutByRFID = async (req, res) => {
  try {
    const { rfidCard } = req.body;
    if (!rfidCard) {
      return res.status(400).json({ success: false, message: 'RFID card is required' });
    }

    const student = await User.findOne({ rfidCard, isAdmin: false });
    if (!student) {
      return res.status(404).json({ success: false, message: 'No student found with this RFID card' });
    }

    const record = await CheckIn.findOne({ studentId: student._id, status: 'checked-in' });
    if (!record) {
      return res.status(404).json({ success: false, message: `${student.name} is not currently checked in` });
    }

    const checkOutTime = new Date();
    const durationMins = Math.round((checkOutTime - record.checkInTime) / (1000 * 60));

    record.checkOutTime = checkOutTime;
    record.status = 'checked-out';
    record.duration = durationMins;
    await record.save();

    return res.status(200).json({
      success: true,
      message: `${student.name} checked out successfully`,
      student: { name: student.name },
      duration: durationMins,
      checkIn: record
    });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

// Get check-in history for a specific student
const getStudentCheckInHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await CheckIn.find({ studentId })
      .sort({ checkInTime: -1 })
      .limit(50);
    return res.status(200).json({ success: true, history: records });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

module.exports = {
  getAllCheckIns,
  checkInStudent,
  checkOutStudent,
  checkOutByRFID,
  getStudentCheckInHistory
};
