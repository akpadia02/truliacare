const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getAllRequests,
  updateRequestStatus,
  getDashboardStats
} = require('../controllers/adminController');

router.get('/requests', auth, adminAuth, getAllRequests);
router.patch('/requests/:id', auth, adminAuth, updateRequestStatus);
router.get('/dashboard/stats', auth, adminAuth, getDashboardStats);

module.exports = router;