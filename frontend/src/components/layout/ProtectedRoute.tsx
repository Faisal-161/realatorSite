import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext'; // Adjust path as needed
import type { UserRole } from '@/lib/types'; // Adjust path as needed

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { isAuthenticated, user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    // You can render a global loading spinner here, or null if handled by a layout component
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading session...</p> {/* Or a spinner component */}
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role
    // Redirect to an unauthorized page or home page
    // For now, redirecting to home. An <Unauthorized /> page would be better.
    // Or, show a message on the current page if layout permits.
    return <Navigate to="/" replace />; // Or to an "/unauthorized" page
  }

  return element;
};

export default ProtectedRoute;
