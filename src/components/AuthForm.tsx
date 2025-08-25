'use client';

import React, { useState } from 'react';
import Spinner from '@/components/Spinner';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  onGoogleLogin: () => Promise<void>;
  googleLoading: boolean;
}

export default function AuthForm({ type, onSubmit, loading, onGoogleLogin, googleLoading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formTitle = type === 'login' ? 'Welcome Back!' : 'Create Your Account';
  const buttonText = type === 'login' ? 'Log In' : 'Sign Up';

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        {formTitle}
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }} className="flex flex-col space-y-5">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <><Spinner size="sm" color="text-white" className="mr-3" /> Processing...</> : buttonText}
        </button>
      </form>

      {/* Conditional links for Login/Signup */}
      {type === 'login' && (
        <>
          <p className="mt-6 text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </a>
          </p>
          <div className="mt-2 text-center text-gray-600">
            <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
              Forgot password?
            </a>
          </div>
        </>
      )}
      {type === 'signup' && (
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Log In
          </a>
        </p>
      )}

      {/* OR Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 rounded-full">OR</span>
        </div>
      </div>

      {/* Google Sign-in Button */}
      <div>
        <button
          onClick={onGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center justify-center"
          disabled={googleLoading}
        >
          {googleLoading ? (
            <>
              <Spinner size="sm" color="text-blue-600" className="mr-3" /> Signing in with Google...
            </>
          ) : (
            <>
              {/* Updated Google 'G' Logo SVG */}
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.0001 12.5C22.0001 11.6667 21.9221 10.9922 21.7661 10.4754H12.2401V13.8427H17.7611C17.6531 14.509 17.2791 15.1953 16.7171 15.6872L19.4631 18.4332C21.0331 16.9298 22.0001 14.819 22.0001 12.5Z" fill="#4285F4"/>
                <path d="M12.2401 22C14.717 22 16.822 21.1667 18.421 19.6738L16.7171 18.4332C15.6724 19.1601 14.1678 19.6841 12.2401 19.6841C10.0384 19.6841 8.16914 18.2575 7.42414 16.2734L4.54214 18.4116C5.97621 20.8996 8.86877 22 12.2401 22Z" fill="#34A853"/>
                <path d="M7.42414 16.2734C7.03159 15.0863 6.82203 13.8164 6.82203 12.5C6.82203 11.1836 7.03159 9.91372 7.42414 8.72656L4.54214 6.58838C3.12513 8.35649 2.24011 10.3541 2.24011 12.5C2.24011 14.6459 3.12513 16.6435 4.54214 18.4116L7.42414 16.2734Z" fill="#FBBC04"/>
                <path d="M12.2401 5.31592C13.6731 5.31592 14.8961 5.86439 15.7531 6.64336L18.421 3.97573C16.822 2.76646 14.717 2 12.2401 2C8.86877 2 5.97621 3.10041 4.54214 5.58838L7.42414 7.72656C8.16914 5.74252 10.0384 4.31592 12.2401 4.31592V5.31592Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>

      {/* Back to Home link */}
      <div className="mt-4 text-center">
        <a href="/" className="text-gray-600 hover:underline text-sm">
          Back to Home
        </a>
      </div>
    </div>
  );
}
