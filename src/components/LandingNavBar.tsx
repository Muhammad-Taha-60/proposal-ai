'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Spinner from '@/components/Spinner';

// Removed empty interface declaration for LandingNavBarProps

const LandingNavBar: React.FC = () => { // Changed to React.FC without props interface
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
      setLoadingAuth(false);
    });
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm shadow-lg border-b border-gray-100 p-4">
      <div className="relative z-10 container mx-auto flex items-center justify-between">
        {/* Logo/App Title */}
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
          AI Proposal Generator
        </div>

        {/* Navigation Button */}
        <div>
          {!loadingAuth && (
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
          )}
          {loadingAuth && (
            <div className="inline-flex items-center text-gray-700">
              <Spinner size="sm" color="text-blue-600" />
              <span className="ml-2 text-sm">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavBar;
