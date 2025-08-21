'use client';

import React from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ensure correct import path
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Modal from '@/components/Modal'; // Assuming your Modal component is here
import { useState } from 'react'; // Import useState for modal

interface TopBarProps {
  user: User | null;
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

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

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      displayModal('Logout Error', error.message);
    } else {
      router.push('/login'); // Redirect to login after successful logout
    }
  }

  const userEmail = user?.email?.split('@')[0] || 'Guest';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center justify-between">
        {/* Left: User Profile Icon and Username */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold text-lg">
            {userEmail.charAt(0).toUpperCase()} {/* First letter of username */}
          </div>
          <span className="text-gray-800 font-semibold text-lg">{userEmail}</span>
        </div>

        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
        >
          Logout
        </button>
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
};

export default TopBar;
