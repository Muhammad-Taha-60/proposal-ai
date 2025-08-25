'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
import TopBar from '@/components/TopBar';

// Define a type for your Proposal data
interface Proposal {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tone: string;
  created_at: string; // ISO 8601 string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('formal');
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [userProposals, setUserProposals] = useState<Proposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const router = useRouter(); 

  // Function to display a modal message - now wrapped in useCallback
  const displayModal = useCallback((title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  }, []); // Empty dependency array means this function is stable

  // Function to fetch user's proposals from Supabase - wrapped in useCallback for dependency
  const fetchUserProposals = useCallback(async (userId: string) => {
    setIsLoadingProposals(true);
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error.message);
      displayModal('Error', 'Failed to load your proposals.');
    } else {
      setUserProposals(data || []);
    }
    setIsLoadingProposals(false);
  }, [displayModal]); // displayModal is a dependency

  // Handle generating and saving a proposal
  const handleGenerateProposal = async () => {
    if (!userPrompt.trim()) {
      displayModal('Input Required', 'Please describe your proposal before generating.');
      return;
    }

    if (!user) {
      displayModal('Authentication Required', 'Please log in to generate proposals.');
      router.push('/login');
      return;
    }

    setIsGenerating(true);
    setGeneratedProposal(null); // Clear previous proposal

    try {
      // Get the user's current session token (access_token)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        displayModal('Session Expired', 'Your session has expired. Please log in again.');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userPrompt, selectedTone }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes from the API route (e.g., 429 for limit exceeded)
        if (response.status === 429) {
          throw new Error(data.error || 'Daily generation limit exceeded.');
        }
        throw new Error(data.error || 'Failed to generate proposal from API.');
      }

      setGeneratedProposal(data.proposal);

      // Re-fetch proposals to update the list, as saving/limit update happens on the API route
      fetchUserProposals(user.id);
      displayModal('Success', 'Proposal generated and saved!');

      setUserPrompt(''); // Clear the input textarea

    } catch (error: unknown) { // Changed 'any' to 'unknown'
        let errorMessage = 'An unexpected error occurred during proposal generation.';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: string }).message === 'string') {
            errorMessage = (error as { message: string }).message;
        }
        displayModal('Generation Error', errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalTitle('');
  };

  // Handle copying content to clipboard
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(null), 2000); // Clear feedback after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyFeedback('Copy failed!');
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  // Effect hook for handling user authentication session and fetching proposals
  useEffect(() => {
    const checkSession = async () => {
      setIsLoadingAuth(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        router.push('/login');
        return;
      }

      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchUserProposals(session.user.id); // Dependency fetchUserProposals is now stable due to useCallback
      }
      setIsLoadingAuth(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchUserProposals(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, fetchUserProposals]); // Added fetchUserProposals as dependency

  // Display loading screen while authentication status is being determined
  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <Spinner size="lg" color="text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">Loading user session...</p>
      </div>
    );
  }

  // If no user is authenticated after loading, return null (redirection handled by useEffect)
  if (!user) {
    return null;
  }

  return (
    <>
      <TopBar user={user} />
      <div className="pt-20 px-8 bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
        <div className="flex flex-col lg:flex-row lg:space-x-8 h-[calc(100vh-100px)]">

          {/* Left Column: User Prompt Input (25%) */}
          <div className="lg:w-1/4 w-full mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-2xl p-8 h-full flex flex-col border border-gray-200">
              <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center">
                <span role="img" aria-label="sparkles" className="mr-3 text-3xl">✨</span> Generate New Proposal
              </h2>
              
              <div className="mb-6 flex-grow flex flex-col">
                <label htmlFor="userPrompt" className="block text-gray-700 text-base font-semibold mb-2">
                  Describe your proposal needs:
                </label>
                <textarea
                  id="userPrompt"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 flex-grow resize-none"
                  placeholder="E.g., A comprehensive proposal for a SaaS platform offering project management tools, targeting small to medium businesses..."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  disabled={isGenerating}
                ></textarea>
              </div>

              <div className="mb-8">
                <label htmlFor="toneStyle" className="block text-gray-700 text-base font-semibold mb-2">
                  Select Tone/Style:
                </label>
                <select
                  id="toneStyle"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="concise">Concise</option>
                </select>
              </div>

              <button
                onClick={handleGenerateProposal}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Spinner size="sm" color="text-white" className="mr-3" /> Generating...
                  </>
                ) : (
                  'Generate Proposal'
                )}
              </button>
            </div>
          </div>

          {/* Middle Column: Generated Proposal (50%) */}
          <div className="lg:w-1/2 w-full mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-2xl p-8 h-full flex flex-col border border-green-300 relative">
              <h2 className="text-3xl font-bold text-green-700 mb-4 border-b pb-2 text-center">Newly Generated Proposal:</h2>
              {isGenerating && !generatedProposal ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                  <Spinner size="lg" color="text-green-600" />
                  <p className="mt-4 text-lg text-gray-700">Generating your proposal...</p>
                </div>
              ) : generatedProposal ? (
                <div className="flex-grow overflow-y-auto pr-2">
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-left">{generatedProposal}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-grow text-gray-500 text-lg">
                  <p>Your generated proposal will appear here.</p>
                </div>
              )}
              {generatedProposal && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleCopy(generatedProposal)}
                    className="bg-purple-600 text-white font-medium py-2 px-5 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 flex items-center"
                  >
                    <span className="mr-2">📋</span> {copyFeedback ? copyFeedback : 'Copy Content'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: My Past Proposals (25%) */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-gray-50 rounded-xl shadow-2xl p-8 h-full flex flex-col border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
                <span role="img" aria-label="folder" className="mr-3 text-3xl">🗂️</span> My Past Proposals
              </h2>
              {isLoadingProposals ? (
                <div className="flex flex-col items-center justify-center flex-grow py-10">
                  <Spinner size="lg" color="text-gray-600" />
                  <p className="mt-4 text-center text-lg text-gray-700">Loading your past proposals...</p>
                </div>
              ) : userProposals.length === 0 ? (
                <div className="flex-grow py-10 text-center text-gray-600 border border-dashed border-gray-300 rounded-lg p-6 bg-white">
                  <p className="text-xl mb-4">You haven&apos;t generated any proposals yet.</p>
                  <p className="text-md">Start by crafting your first one in the left column! ✨</p>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 gap-6">
                    {userProposals.map((proposal) => (
                      <div key={proposal.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex flex-col justify-between hover:shadow-lg transition duration-200">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{proposal.title}</h3>
                          <p className="text-xs text-gray-500 mb-3 font-medium">
                            Tone: <span className="text-blue-600">{proposal.tone}</span> &bull; Generated: {new Date(proposal.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed">{proposal.content}</p>
                        </div>
                        <div className="mt-5 flex justify-end space-x-2">
                          <button
                            onClick={() => handleCopy(proposal.content)}
                            className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 text-sm flex items-center"
                          >
                            <span className="mr-2">📋</span> Copy
                          </button>
                          <a
                            href={`/proposals/${proposal.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 text-sm flex items-center"
                          >
                            <span className="mr-2">📄</span> View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
