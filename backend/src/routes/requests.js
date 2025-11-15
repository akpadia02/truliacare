const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createRequest,
  getMyRequests,
  getRequestById
} = require('../controllers/requestController');

router.post('/', auth, createRequest);
router.get('/my-requests', auth, getMyRequests);
router.get('/:id', auth, getRequestById);

module.exports = router;