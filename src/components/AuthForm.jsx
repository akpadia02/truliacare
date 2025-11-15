import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AuthForm({ mode, role, onAuthSuccess }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const isLogin = mode === "login";
    const roleTitle = role === "employee" ? "Employee" : "Admin";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.email || !formData.password) {
            setError("Please fill in all required fields");
            return;
        }

        if (!isLogin) {
            if (!formData.name) {
                setError("Please enter your name");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (isLogin) {
            // Login logic
            const user = users.find(
                u => u.email === formData.email && 
                     u.password === formData.password && 
                     u.role === role
            );
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (onAuthSuccess) {
                    onAuthSuccess(user);
                } else {
                    navigate(role === 'employee' ? '/employee/dashboard' : '/admin/dashboard');
                }
            } else {
                setError("Invalid email or password");
            }
        } else {
            // Signup logic
            const existingUser = users.find(u => u.email === formData.email);
            if (existingUser) {
                setError("Email already exists");
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: role,
                createdAt: new Date().toISOString(),
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            if (onAuthSuccess) {
                onAuthSuccess(newUser);
            } else {
                navigate(role === 'employee' ? '/employee/dashboard' : '/admin/dashboard');
            }
        }
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <svg
                                className={`w-16 h-16 mx-auto ${role === 'employee' ? 'text-[#3bf66d]' : 'text-[#3bf66d]'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {role === 'employee' ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                )}
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[#3bf66d] mb-2">
                            {isLogin ? `Login as ${roleTitle}` : `Sign Up as ${roleTitle}`}
                        </h1>
                        <p className="text-gray-600">
                            {isLogin 
                                ? "Welcome back! Please login to continue" 
                                : "Create your account to get started"}
                        </p>
                    </div>

                    {/* Error Msg */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                    placeholder="John Doe"
                                    required={!isLogin}
                                />
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bf66d] focus:border-transparent outline-none transition"
                                placeholder="john.doe@example.com"
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                placeholder="Enter your password"
                                required
                            />
                        </motion.div>

                        {!isLogin && (
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none transition"
                                    placeholder="Confirm your password"
                                    required={!isLogin}
                                />
                            </motion.div>
                        )}
                    
                        <motion.button
                            type="submit"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#3bf66d] text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {isLogin ? "Login" : "Sign Up"}
                        </motion.button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 space-y-3 text-center">
                        <div>
                            {isLogin ? (
                                <p className="text-gray-600 text-sm">
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => navigate(role === 'employee' ? '/employee/signup' : '/admin/signup')}
                                        className="text-[#3bf66d] hover:text-green-600 font-semibold transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            ) : (
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => navigate(role === 'employee' ? '/employee/login' : '/admin/login')}
                                        className="text-[#3bf66d] hover:text-green-600 font-semibold transition-colors"
                                    >
                                        Login
                                    </button>
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-600 hover:text-[#3B82F6] transition-colors text-sm flex items-center justify-center gap-1 mx-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Role Selection
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default AuthForm;

