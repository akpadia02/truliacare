const MaintenanceRequest = require('../models/MaintenanceRequest');

exports.getAllRequests = async (req, res) => {
    try {
      const { status, category, priority } = req.query;
      const filter = {};
  
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (priority) filter.priority = priority;
  
      const requests = await MaintenanceRequest.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
  
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.updateRequestStatus = async (req, res) => {
    try {
      const { status, assignedTo } = req.body;
      const request = await MaintenanceRequest.findById(req.params.id);
  
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      if (status) request.status = status;
      if (assignedTo) request.assignedTo = assignedTo;
      
      if (status === 'Resolved') {
        request.resolvedAt = Date.now();
      }
  
      await request.save();
      await request.populate('createdBy assignedTo', 'name email');
  
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getDashboardStats = async (req, res) => {
    try {
      const stats = await MaintenanceRequest.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
  
      const totalRequests = await MaintenanceRequest.countDocuments();
      const escalatedRequests = await MaintenanceRequest.countDocuments({ 
        status: 'Escalated' 
      });
  
      res.json({
        totalRequests,
        escalatedRequests,
        statusBreakdown: stats
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };