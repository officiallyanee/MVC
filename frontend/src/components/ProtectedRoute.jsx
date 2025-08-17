import { useAuth } from "../provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredPermissions }) => {
  const { user, loading } = useAuth(); 
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user || !user.username) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }
  const userPermissions = user.permissions || [];
  const hasPermission = userPermissions.some(permission => 
    requiredPermissions.includes(permission)
  );

  if (!hasPermission) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }

  return children;
};