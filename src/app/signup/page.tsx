'use client';

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

export default function SignupPage() {
  const [loading, setLoading] = useState(false); // For email/password signup
  const [googleLoading, setGoogleLoading] = useState(false); // For Google signup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      setModalTitle('Sign Up Error');
      setModalMessage(error.message);
      setShowModal(true);
    } else {
      setModalTitle('Success!');
      setModalMessage('Sign up successful! Please check your email to confirm your account.');
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => { // Function name kept consistent, as it's the same OAuth flow
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Redirect to dashboard after Google signup
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
      },
    });

    if (error) {
      setModalTitle('Google Sign Up Error'); // Specific error title
      setModalMessage(error.message);
      setShowModal(true);
      setGoogleLoading(false);
    }
    // Supabase handles redirection on success
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalTitle('');
    // If it was a successful signup message, redirect to dashboard after closing modal
    if (modalMessage.includes('successful')) {
        router.push('/dashboard');
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
        {/* AuthForm now handles all sub-components */}
        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          loading={loading}
          onGoogleLogin={handleGoogleLogin} // Pass Google signup handler
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
