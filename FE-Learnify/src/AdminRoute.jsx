import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = document.cookie
        .split("; ")
        .find(c => c.startsWith("token="))
        ?.split("=")[1];

    const role = document.cookie
        .split("; ")
        .find(c => c.startsWith("role="))
        ?.split("=")[1];

    if (!token) return <Navigate to="/login" replace />;

    if (role !== "admin") return <Navigate to="/forbidden" replace />;

    return children;
}
