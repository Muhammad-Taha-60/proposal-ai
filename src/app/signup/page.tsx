'use client';

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal'; // Import the Modal component

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State to store modal message
  const [modalTitle, setModalTitle] = useState(''); // State to store modal title
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setModalTitle('Sign Up Error');
      setModalMessage(error.message); // Set the error message
      setShowModal(true); // Show the modal
    } else {
      setModalTitle('Success!');
      setModalMessage('Sign up successful! Please check your email to confirm your account.');
      setShowModal(true); // Show modal for success message
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false); // Function to close the modal
    setModalMessage(''); // Clear the message
    setModalTitle(''); // Clear the title
    // If it was a successful signup message, redirect to login after closing modal
    if (modalMessage.includes('successful')) { // Simple check for success message
        router.push('/login');
    }
  };

  return (
    <>
      <AuthForm type="signup" onSubmit={handleSignup} loading={loading} />
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
