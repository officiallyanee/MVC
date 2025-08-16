import { useAuth } from "../provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredPermissions }) => {
  const { user } = useAuth();
  const location = useLocation();

  const hasPermission = user.permissions.some(permission => 
    requiredPermissions.includes(permission)
  );

  if (!user.username || !hasPermission) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }

  return children;
};