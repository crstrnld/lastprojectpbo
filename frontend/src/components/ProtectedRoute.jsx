import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Wrap protected routes: <Route element={<ProtectedRoute roles={['ADMIN']} />}>
export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}
