const mongoose = require('mongoose');

const escalationSchema = new mongoose.Schema({
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRequest',
      required: true
    },
    fromLevel: Number,
    toLevel: Number,
    reason: String,
    escalatedBy: {
      type: String,
      default: 'System'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('EscalationLog', escalationSchema);
  