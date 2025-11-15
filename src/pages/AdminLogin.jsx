import React from "react";
import AuthForm from "../components/AuthForm";

function AdminLogin() {
    return <AuthForm mode="login" role="admin" />;
}

// Exporting the AdminLogin component as the default export
export default AdminLogin;

