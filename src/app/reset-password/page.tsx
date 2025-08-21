'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
import { AuthChangeEvent } from '@supabase/supabase-js'; // Import AuthChangeEvent for better typing

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [sessionSet, setSessionSet] = useState(false); // New state to track if session is confirmed
  const router = useRouter();

  const displayModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalTitle('');
    // After a successful password reset, redirect to login page
    if (modalTitle === 'Success') {
      router.push('/login');
    }
  };

  useEffect(() => {
    // This effect listens for auth state changes, which includes when a user is redirected
    // from a password reset email link, causing their session to be set.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        if (event === 'SIGNED_IN' && session) {
          // If the user is signed in (likely from the reset link)
          setSessionSet(true); // Indicate that a session is now available
          // Optionally, fetch user details if needed, or just prepare for password update
        } else if (event === 'SIGNED_OUT') {
          // If somehow signed out, redirect them
          displayModal('Session Ended', 'Your session has ended. Please try resetting your password again.');
          router.push('/forgot-password');
        }
      }
    );

    // Initial check for session in case the listener doesn't fire immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionSet(true);
      } else {
        // If no session on initial load, ensure they go through forgot-password
        // This handles cases where they might try to access /reset-password directly without a token
        displayModal('Invalid Access', 'Please use the password reset link from your email.');
        router.push('/forgot-password');
      }
    });

    return () => {
      // Corrected: Access unsubscribe through data.subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);


  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      displayModal('Error', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) { // Supabase's default minimum password length is 6
      displayModal('Error', 'Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Update the user's password
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      displayModal('Error', error.message);
    } else {
      displayModal('Success', 'Your password has been reset successfully! You can now log in with your new password.');
      setPassword('');
      setConfirmPassword('');
      // The closeModal function will handle redirection to /login after success modal is closed
    }
    setLoading(false);
  };

  if (!sessionSet) {
    // Show a loading state while waiting for the session from the URL hash
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Spinner size="lg" color="text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">Checking reset link...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Set New Password
          </h2>
          <p className="text-gray-600 mb-6">
            Enter and confirm your new password below.
          </p>
          <form onSubmit={handlePasswordUpdate} className="flex flex-col space-y-5">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="text-white" className="mr-3" /> Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
      {showModal && (
        <Modal
          title={modalTitle}
          message={modalMessage}
          onClose={closeModal}
        />
      )}
    </>
  );
}
