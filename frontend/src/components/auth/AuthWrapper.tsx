// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from 'react';

import { AuthService, AuthUser } from '../../services/AuthService';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if this is a redirect from the OAuth provider
      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        const user = await AuthService.handleRedirect();
        if (user) {
          setIsAuthenticated(true);
        }
      } else {
        // Otherwise, check for an existing session
        const user = AuthService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsLoading(true);
    AuthService.signInWithRedirect();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-purple-900/10 animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md w-full p-8 bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-800">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Q Business Tools
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl text-gray-300">Loading...</p>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-purple-900/10 animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md w-full p-8 bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-800">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Q Business Tools
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center">Welcome</h2>
            <p className="mb-6 text-gray-300 text-center">
              Please log in to access the Q Business Tools suite for monitoring, analyzing, and
              enhancing your Amazon Q Business experience.
            </p>

            <button
              onClick={login}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center"
            >
              <span>Sign In</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
