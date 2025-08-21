'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Spinner from '@/components/Spinner';

// Define the Proposal type to match your database schema
interface Proposal {
  id: string;
  user_id: string;
  title: string; // This will now hold the full prompt
  content: string;
  tone: string;
  created_at: string;
}

export default function SingleProposalPage() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams(); // Hook to get dynamic route parameters
  const router = useRouter();

  useEffect(() => {
    const fetchProposal = async () => {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid proposal ID.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', params.id)
        .single(); // Use .single() to expect only one row

      if (error) {
        console.error('Error fetching proposal:', error);
        setError(`Failed to load proposal: ${error.message}`);
      } else if (!data) {
        setError('Proposal not found.');
      } else {
        setProposal(data);
      }
      setIsLoading(false);
    };

    fetchProposal();
  }, [params.id]); // Re-run effect if the ID changes

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Spinner size="lg" color="text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">Loading proposal details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8 text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-8">{error}</p>
        <button
          onClick={() => router.push('/dashboard')} // FIX: Explicitly push to dashboard
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Proposal Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">The proposal you are looking for does not exist.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8 flex justify-center items-start pt-20">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full border border-gray-200">
        <button
          onClick={() => router.push('/dashboard')} // FIX: Explicitly push to dashboard
          className="mb-6 bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200 flex items-center"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{proposal.title}</h1> {/* This will now display the full title/prompt */}
        <p className="text-sm text-gray-500 mb-6 font-medium">
          Tone: <span className="text-blue-600 font-semibold">{proposal.tone}</span> &bull; Generated on: {new Date(proposal.created_at).toLocaleDateString()}
        </p>
        <div className="prose lg:prose-lg max-w-none text-gray-800 leading-relaxed border-t border-b border-gray-200 py-6 mb-8">
          <p className="whitespace-pre-wrap">{proposal.content}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => navigator.clipboard.writeText(proposal.content)}
            className="bg-purple-600 text-white font-medium py-2 px-5 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 flex items-center"
          >
            <span className="mr-2">📋</span> Copy Full Proposal
          </button>
        </div>
      </div>
    </div>
  );
}
