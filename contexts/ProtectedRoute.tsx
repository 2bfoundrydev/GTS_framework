'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',  // Add landing page
  '/login', 
  '/signup', 
  '/verify-email', 
  '/reset-password', 
  '/update-password',
  '/test'
];

// Function to check if route is public (including prefix matches)
function isPublicRoute(pathname: string): boolean {
  // Exact match
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }
  // Prefix match for preview routes
  if (pathname.startsWith('/preview/')) {
    return true;
  }
  return false;
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute(pathname)) {
      setShouldRedirect(true);
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      window.location.assign(redirectUrl);
    }
  }, [user, isLoading, pathname]);

  // Only show loading screen after a delay to prevent flash on quick loads
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 300); // Show loading only if it takes more than 300ms
      
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);

  // Show loading state only if it's taking a while
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <div className="text-gray-900 dark:text-white">Loading at lightspeed ⚡️</div>
      </div>
    );
  }

  // Don't render anything if we're about to redirect (prevents flash of protected content)
  if (shouldRedirect) {
    return null;
  }

  // Always render children - let components handle their own loading states
  return <>{children}</>;
} 