import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        // Store role in localStorage for now (we'll use this later)
        localStorage.setItem('userRole', role);
        // Navigate to appropriate page based on role
        if (role === 'employee') {
            navigate('/employee/dashboard');
        } else if (role === 'admin') {
            navigate('/admin/dashboard');
        }
    };

    // Variants for animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6 } 
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-4xl"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    variants={cardVariants}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3B82F6] mb-4">
                        Maintenance Request System
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700">
                        Select your role to continue
                    </p>
                </motion.div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Employee Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all duration-300"
                        onClick={() => handleRoleSelect('employee')}
                    >
                        <div className="text-center">
                            <div className="mb-6">
                                <svg
                                    className="w-24 h-24 mx-auto text-[#3B82F6]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Employee
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Submit maintenance requests and track their status
                            </p>
                            <button className="bg-[#3B82F6] text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full">
                                Continue as Employee
                            </button>
                        </div>
                    </motion.div>

                    {/* Admin Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all duration-300"
                        onClick={() => handleRoleSelect('admin')}
                    >
                        <div className="text-center">
                            <div className="mb-6">
                                <svg
                                    className="w-24 h-24 mx-auto text-[#3B82F6]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Admin
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Manage and escalate maintenance requests
                            </p>
                            <button className="bg-[#3B82F6] text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full">
                                Continue as Admin
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default RoleSelection;

