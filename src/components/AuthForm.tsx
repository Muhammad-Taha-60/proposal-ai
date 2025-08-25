'use client';

import React, { useState } from 'react';

// Define the types for the component's props
interface AuthFormProps {
  type: 'login' | 'signup'; // Explicitly define type as 'login' or 'signup'
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export default function AuthForm({ type, onSubmit, loading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formTitle = type === 'login' ? 'Welcome Back!' : 'Create Your Account';
  const buttonText = type === 'login' ? 'Log In' : 'Sign Up';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200">
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
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
        </form>

        {type === 'login' && (
          <p className="mt-6 text-center text-gray-600">
            Don&apos;t have an account?{' '} {/* Fixed apostrophe */}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </a>
          </p>
        )}
        {type === 'signup' && (
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Log In
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
