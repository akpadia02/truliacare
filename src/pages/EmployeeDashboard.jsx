import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "IT",
    });

    // Load requests from localStorage
    const loadRequests = () => {
        const savedRequests = localStorage.getItem('maintenanceRequests');
        if (savedRequests) {
            const parsed = JSON.parse(savedRequests);
            // Filter requests for current employee (using a simple userId for now)
            const employeeRequests = parsed.filter(req => req.userId === 'employee-1');
            setRequests(employeeRequests);
        }
    };

    // Load requests on mount and set up polling for real-time updates
    useEffect(() => {
        loadRequests();
        // Poll for updates every 2 seconds (simulating real-time)
        const interval = setInterval(loadRequests, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            alert("Please fill in all required fields");
            return;
        }

        const newRequest = {
            id: Date.now().toString(),
            userId: 'employee-1',
            title: formData.title,
            description: formData.description,
            category: formData.category,
            status: "Pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save to localStorage immediately
        const allRequests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        allRequests.push(newRequest);
        localStorage.setItem('maintenanceRequests', JSON.stringify(allRequests));

        // Update local state
        setRequests([newRequest, ...requests]);
        setFormData({ title: "", description: "", category: "IT" });
        setShowForm(false);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6] mb-2">
                                Employee Dashboard
                            </h1>
                            <p className="text-lg text-gray-700">
                                Submit and track your maintenance requests
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#3B82F6] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {/* Submit Request Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#3B82F6] text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? "Cancel" : "Submit New Request"}
                    </motion.button>
                </motion.div>

                {/* Request Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Maintenance Request</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Request Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                            placeholder="e.g., Internet not working"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                        >
                                            <option value="IT">IT</option>
                                            <option value="Facilities">Facilities</option>
                                            <option value="Infrastructure">Infrastructure</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition resize-none"
                                            placeholder="Please provide detailed information about the issue..."
                                            required
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-[#3B82F6] text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Submit Request
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Requests List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        My Requests ({requests.length})
                    </h2>

                    {requests.length === 0 ? (
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
                            <p className="text-gray-600 text-lg">No requests submitted yet</p>
                            <p className="text-gray-500 mt-2">Click "Submit New Request" to get started</p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {requests.map((request) => (
                                <motion.div
                                    key={request.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#3B82F6]"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-xl font-bold text-gray-800">{request.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${getStatusColor(request.status)}`}>
                                                    {getStatusIcon(request.status)}
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-3">{request.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
