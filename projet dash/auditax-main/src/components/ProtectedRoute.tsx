import React, { ReactNode } from 'react';
import { useAuth, SignIn, useUser } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }
  
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <SignIn routing="hash" />
      </div>
    );
  }

  // RBAC Support
  if (allowedRoles) {
    const userRole = (user?.publicMetadata?.role as string) || 'AUDITOR';
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 border-b-2 border-red-500 pb-2 mb-4">403</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Access Forbidden: Insufficient clearance</p>
          </div>
        </div>
      );
    }
  }
  
  return <>{children}</>;
};
