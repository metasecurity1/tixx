import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Allow access to all routes without authentication
  return <>{children}</>;
}