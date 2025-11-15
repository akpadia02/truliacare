import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    
    // Check authentication
    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            navigate('/admin/login');
            return;
        }
        const user = JSON.parse(currentUser);
        if (user.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [navigate]);
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState({
        status: "",
        technician: "",
    });
    const [technicians] = useState([
        "John Smith",
        "Sarah Johnson",
        "Mike Davis",
        "Emily Wilson",
        "David Brown",
    ]);

    // Load all requests from localStorage
    const loadRequests = () => {
        const savedRequests = localStorage.getItem('maintenanceRequests');
        if (savedRequests) {
            const parsed = JSON.parse(savedRequests);
            // Sort by updatedAt (most recent first)
            const sorted = parsed.sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setRequests(sorted);
        }
    };

    // Load requests on mount and set up polling for real-time updates
    useEffect(() => {
        loadRequests();
        // Poll for updates every 2 seconds (simulating real-time)
        const interval = setInterval(loadRequests, 2000);
        return () => clearInterval(interval);
    }, []);

    // Auto-escalation logic: Escalate if pending > 24 hours
    useEffect(() => {
        const checkEscalations = () => {
            const now = new Date();
            const updatedRequests = requests.map(request => {
                if (request.status === "Pending" || request.status === "In Progress") {
                    const createdAt = new Date(request.createdAt);
                    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
                    
                    // Auto-escalate if pending > 24 hours
                    if (hoursSinceCreation > 24 && request.status !== "Escalated" && request.status !== "Resolved") {
                        return {
                            ...request,
                            status: "Escalated",
                            updatedAt: now.toISOString(),
                            escalatedAt: now.toISOString(),
                            escalationReason: "Auto-escalated: Request pending for more than 24 hours"
                        };
                    }
                }
                return request;
            });

            // Check if any requests were updated
            const hasChanges = updatedRequests.some((req, idx) => 
                req.status !== requests[idx]?.status
            );

            if (hasChanges) {
                localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
                setRequests(updatedRequests);
            }
        };

        const escalationInterval = setInterval(checkEscalations, 60000); // Check every minute
        return () => clearInterval(escalationInterval);
    }, [requests]);

    const handleStatusUpdate = (requestId, newStatus) => {
        const updatedRequests = requests.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                };
            }
            return req;
        });
        localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
        setRequests(updatedRequests);
        setShowUpdateModal(false);
        setSelectedRequest(null);
    };

    const handleTechnicianAssign = (requestId, technician) => {
        const updatedRequests = requests.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    technician: technician,
                    updatedAt: new Date().toISOString(),
                };
            }
            return req;
        });
        localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
        setRequests(updatedRequests);
    };

    const handleManualEscalation = (requestId) => {
        const updatedRequests = requests.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    status: "Escalated",
                    updatedAt: new Date().toISOString(),
                    escalatedAt: new Date().toISOString(),
                    escalationReason: "Manually escalated by admin"
                };
            }
            return req;
        });
        localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
        setRequests(updatedRequests);
    };

    const openUpdateModal = (request) => {
        setSelectedRequest(request);
        setUpdateData({
            status: request.status,
            technician: request.technician || "",
        });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = () => {
        if (selectedRequest) {
            if (updateData.status !== selectedRequest.status) {
                handleStatusUpdate(selectedRequest.id, updateData.status);
            }
            if (updateData.technician !== selectedRequest.technician) {
                handleTechnicianAssign(selectedRequest.id, updateData.technician);
            }
        }
    };

    const getStatusOptions = (currentStatus) => {
        const statusFlow = {
            "Pending": ["In Progress", "Resolved", "Escalated"],
            "In Progress": ["Resolved", "Escalated"],
            "Resolved": ["Resolved"], // Can't change from resolved
            "Escalated": ["In Progress", "Resolved"], // Can recover from escalated
        };
        return statusFlow[currentStatus] || [];
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "In Progress":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Resolved":
                return "bg-green-100 text-green-800 border-green-300";
            case "Escalated":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case "In Progress":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case "Resolved":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case "Escalated":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getHoursSinceCreation = (dateString) => {
        const now = new Date();
        const created = new Date(dateString);
        const hours = Math.floor((now - created) / (1000 * 60 * 60));
        return hours;
    };

    const filteredRequests = filterStatus === "All" 
        ? requests 
        : requests.filter(req => req.status === filterStatus);

    const statusCounts = {
        All: requests.length,
        Pending: requests.filter(r => r.status === "Pending").length,
        "In Progress": requests.filter(r => r.status === "In Progress").length,
        Resolved: requests.filter(r => r.status === "Resolved").length,
        Escalated: requests.filter(r => r.status === "Escalated").length,
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6] mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-lg text-gray-700">
                                Manage and monitor all maintenance requests
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('currentUser');
                                    navigate('/admin/login');
                                }}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Status Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-8"
                >
                    <div className="flex flex-wrap gap-4">
                        {["All", "Pending", "In Progress", "Resolved", "Escalated"].map((status) => (
                            <motion.button
                                key={status}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilterStatus(status)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                    filterStatus === status
                                        ? "bg-[#3B82F6] text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {status} ({statusCounts[status]})
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Requests List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {filterStatus === "All" ? "All Requests" : `${filterStatus} Requests`} ({filteredRequests.length})
                    </h2>

                    {filteredRequests.length === 0 ? (
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl shadow-xl p-12 text-center"
                        >
                            <svg
                                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-gray-600 text-lg">No requests found</p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredRequests.map((request) => {
                                const hoursSinceCreation = getHoursSinceCreation(request.createdAt);
                                const needsEscalation = (request.status === "Pending" || request.status === "In Progress") && hoursSinceCreation > 24;
                                
                                return (
                                    <motion.div
                                        key={request.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.01 }}
                                        className={`bg-white rounded-2xl shadow-xl p-6 border-l-4 ${
                                            request.status === "Escalated" 
                                                ? "border-red-500" 
                                                : needsEscalation 
                                                    ? "border-orange-500" 
                                                    : "border-[#3B82F6]"
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                            {request.title}
                                                        </h3>
                                                        {needsEscalation && request.status !== "Escalated" && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                                Needs Escalation ({hoursSinceCreation}h old)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        {request.status}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-gray-600 mb-4">{request.description}</p>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {request.category}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {formatDate(request.createdAt)}
                                                    </span>
                                                    {request.technician && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {request.technician}
                                                        </span>
                                                    )}
                                                </div>

                                                {request.escalationReason && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                                        <p className="text-sm text-red-800">
                                                            <strong>Escalation:</strong> {request.escalationReason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2 lg:min-w-[200px]">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openUpdateModal(request)}
                                                    className="bg-[#3B82F6] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                                                >
                                                    Update Status
                                                </motion.button>
                                                
                                                {(request.status === "Pending" || request.status === "In Progress") && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleManualEscalation(request.id)}
                                                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
                                                    >
                                                        Escalate Now
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Update Status Modal */}
                <AnimatePresence>
                    {showUpdateModal && selectedRequest && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowUpdateModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Update Request
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={updateData.status}
                                            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                        >
                                            {getStatusOptions(selectedRequest.status).map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                            {selectedRequest.status !== "Resolved" && (
                                                <option value="Escalated">Escalated</option>
                                            )}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Current: {selectedRequest.status}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Assign Technician (Optional)
                                        </label>
                                        <select
                                            value={updateData.technician}
                                            onChange={(e) => setUpdateData({ ...updateData, technician: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                        >
                                            <option value="">Unassigned</option>
                                            {technicians.map((tech) => (
                                                <option key={tech} value={tech}>
                                                    {tech}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowUpdateModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleUpdateSubmit}
                                        className="flex-1 bg-[#3B82F6] text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Update
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default AdminDashboard;
