'use client';

import React from 'react';

interface ModalProps {
  message: string;
  onClose: () => void;
  title?: string; // Optional title for the modal
}

const Modal: React.FC<ModalProps> = ({ message, onClose, title = 'Notification' }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full transform transition-all sm:my-8 sm:align-middle">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="mb-6 text-gray-700">
          <p>{message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
