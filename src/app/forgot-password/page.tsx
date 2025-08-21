'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
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
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // IMPORTANT CHANGE: Point redirectTo directly to your reset password page.
    // Supabase will append the tokens as a hash automatically.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // <-- SIMPLIFIED REDIRECT URL
    });

    if (error) {
      displayModal('Error', error.message);
    } else {
      displayModal('Success', 'If an account with that email exists, a password reset link has been sent to your inbox!');
      setEmail(''); // Clear the email input
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Forgot Password?
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handlePasswordReset} className="flex flex-col space-y-5">
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  <Spinner size="sm" color="text-white" className="mr-3" /> Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Remember your password?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Log In
            </a>
          </p>
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
