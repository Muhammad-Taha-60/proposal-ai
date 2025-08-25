'use client';

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
// Spinner is now imported and used within AuthForm, so no need here if only AuthForm uses it.

export default function LoginPage() {
  const [loading, setLoading] = useState(false); // For email/password login
  const [googleLoading, setGoogleLoading] = useState(false); // For Google login
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setModalTitle('Login Error');
      setModalMessage(error.message);
      setShowModal(true);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Redirect to dashboard after Google login
        queryParams: {
            access_type: 'offline', // Request offline access if needed for refresh tokens
            prompt: 'consent', // Prompt for consent every time to allow account switching
        },
      },
    });

    if (error) {
      setModalTitle('Google Login Error');
      setModalMessage(error.message);
      setShowModal(true);
      setGoogleLoading(false); // Reset loading state on error
    }
    // If successful, Supabase handles redirection, so no need for router.push here
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalTitle('');
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
        {/* AuthForm now handles all sub-components */}
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          loading={loading}
          onGoogleLogin={handleGoogleLogin} // Pass Google login handler
          googleLoading={googleLoading}     // Pass Google loading state
        />
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
