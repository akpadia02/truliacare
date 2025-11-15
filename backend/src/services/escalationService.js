const MaintenanceRequest = require('../models/MaintenanceRequest');
const EscalationLog = require('../models/EscalationLog');
const cron = require('node-cron');

const ESCALATION_THRESHOLD_HOURS = 24;

const checkAndEscalate = async () => {
  try {
    const threshold = new Date(Date.now() - ESCALATION_THRESHOLD_HOURS * 60 * 60 * 1000);
    
    const pendingRequests = await MaintenanceRequest.find({
      status: { $in: ['Pending', 'In Progress'] },
      createdAt: { $lt: threshold },
      escalationLevel: { $lt: 3 }
    });

    for (const request of pendingRequests) {
      request.status = 'Escalated';
      request.escalationLevel += 1;
      request.escalatedAt = Date.now();
      await request.save();

      const escalationLog = new EscalationLog({
        requestId: request._id,
        fromLevel: request.escalationLevel - 1,
        toLevel: request.escalationLevel,
        reason: `Unresolved for ${ESCALATION_THRESHOLD_HOURS} hours`
      });
      await escalationLog.save();

      console.log(`Escalated request ${request._id} to level ${request.escalationLevel}`);
    }
  } catch (error) {
    console.error('Escalation check error:', error);
  }
};

// Run every hour
cron.schedule('0 * * * *', checkAndEscalate);

module.exports = { checkAndEscalate };