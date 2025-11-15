const MaintenanceRequest = require('../models/MaintenanceRequest');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;

    const request = new MaintenanceRequest({
      title,
      description,
      category,
      priority,
      location,
      createdBy: req.user._id
    });

    await request.save();
    await request.populate('createdBy', 'name email');

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if user owns the request or is admin
    if (request.createdBy._id.toString() !== req.user._id.toString() && 
        req.user.role === 'employee') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};