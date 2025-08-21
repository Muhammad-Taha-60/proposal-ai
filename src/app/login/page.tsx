'use client';

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
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

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalTitle('');
  };

  return (
    <>
      <AuthForm type="login" onSubmit={handleLogin} loading={loading} />
      {/* Add Forgot Password link here */}
      <div className="absolute bottom-8 w-full text-center">
        <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
          Forgot password?
        </a>
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
