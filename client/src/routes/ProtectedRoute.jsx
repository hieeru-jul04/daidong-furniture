import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/access-denied" replace />;
    }

    try {
        // Simple JWT decode (payload is the second part)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        const userRole = decodedToken.role;

        // Exact match required if a role is specified
        if (requiredRole && userRole !== requiredRole) {
            return <Navigate to="/access-denied" replace />;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        // If token is invalid/malformed, redirect to access denied and clear it
        localStorage.removeItem("token");
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute;