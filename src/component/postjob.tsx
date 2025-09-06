// src/components/PostJob.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { GIGSTREAM_CONSTANTS, CONTRACT_FUNCTIONS, NETWORK_CONFIG } from '../utils/gigstreamConstants';

interface JobFormData {
  title: string;
  description: string;
  required_skills: string;
  budget: number;
  deadline: string; // We'll convert to timestamp
}

interface ClientProfile {
  id: string;
  name: string;
  company: string;
}

const PostJob = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    required_skills: '',
    budget: 0,
    deadline: '',
  });
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const client = new SuiClient({
    network: NETWORK_CONFIG.network,
    url: NETWORK_CONFIG.rpcUrl,
  });

  // Fetch user's client profile
  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!currentAccount) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        // Query for ClientProfileCreated events by this user
        const events = await client.queryEvents({
          query: {
            MoveEventType: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::gigstream::ClientProfileCreated`
          }
        });

        // Find the most recent profile created by current user
        const userProfile = events.data
          .filter(event => event.parsedJson && 
            event.parsedJson && typeof event.parsedJson === 'object' && 'owner' in event.parsedJson &&
            event.parsedJson.owner === currentAccount.address)
          .sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs))[0];

        if (userProfile && userProfile.parsedJson) {
          const profileData = userProfile.parsedJson as any;
          
          // Get the actual profile object
          const profileObj = await client.getObject({
            id: profileData.profile_id,
            options: { showContent: true }
          });

          if (profileObj.data?.content && 'fields' in profileObj.data.content) {
            const fields = profileObj.data.content.fields as any;
            setClientProfile({
              id: profileData.profile_id,
              name: fields.name,
              company: fields.company
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch client profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchClientProfile();
  }, [currentAccount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    if (!clientProfile) {
      setError('You need to create a client profile first before posting jobs');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.required_skills.trim() || formData.budget <= 0 || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    // Convert deadline to timestamp (milliseconds)
    const deadlineTimestamp = new Date(formData.deadline).getTime();
    if (deadlineTimestamp <= Date.now()) {
      setError('Deadline must be in the future');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const txb = new Transaction();
      txb.setGasBudget(GIGSTREAM_CONSTANTS.GAS_BUDGET);
      
      txb.moveCall({
        target: CONTRACT_FUNCTIONS.CREATE_JOB_LISTING,
        arguments: [
          txb.object(GIGSTREAM_CONSTANTS.GIGSTREAM_OBJECT_ID), // platform
          txb.object(clientProfile.id), // client_profile
          txb.pure.string(formData.title.trim()),
          txb.pure.string(formData.description.trim()),
          txb.pure.string(formData.required_skills.trim()),
          txb.pure.u64(Math.floor(formData.budget)), // Convert to integer (SUI units)
          txb.pure.u64(deadlineTimestamp),
        ],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('Job posted successfully:', result);
            setSuccess(`Job posted successfully! Transaction: ${result.digest}`);
            setFormData({
              title: '',
              description: '',
              required_skills: '',
              budget: 0,
              deadline: '',
            });
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            setError(`Failed to post job: ${error.message}`);
          },
          onSettled: () => setIsLoading(false)
        }
      );

    } catch (error) {
      console.error('Error creating transaction:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#5B3AED] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white font-[poppins]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#5B3AED] p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-white font-[poppins] mb-8 text-center">
            Post New Job
          </h1>

          {/* Client Profile Info */}
          {clientProfile && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-white font-[poppins] font-semibold mb-2">Posting as:</h3>
              <p className="text-white/80">{clientProfile.name} - {clientProfile.company}</p>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200"
            >
              {success}
            </motion.div>
          )}

          {!currentAccount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200"
            >
              Please connect your Sui wallet to post a job
            </motion.div>
          )}

          {!clientProfile && currentAccount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200"
            >
              You need to create a client profile first before posting jobs.{' '}
              <a href="/client-profile" className="underline text-yellow-100">
                Create Client Profile
              </a>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={!currentAccount || !clientProfile || isLoading}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50"
                placeholder="e.g., Smart Contract Developer for DeFi Protocol"
                required
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!currentAccount || !clientProfile || isLoading}
                rows={5}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50 resize-vertical"
                placeholder="Describe the project requirements, deliverables, and expectations in detail..."
                required
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Required Skills *
              </label>
              <input
                type="text"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleInputChange}
                disabled={!currentAccount || !clientProfile || isLoading}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50"
                placeholder="e.g., Solidity, React, TypeScript, DeFi Experience"
                required
              />
              <p className="text-white/60 text-sm mt-1">Separate skills with commas</p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Budget (SUI) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                disabled={!currentAccount || !clientProfile || isLoading}
                min="1"
                step="0.1"
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50"
                placeholder="e.g., 1000"
                required
              />
              <p className="text-white/60 text-sm mt-1">Enter the total budget for this project in SUI tokens</p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Project Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                disabled={!currentAccount || !clientProfile || isLoading}
                min={getMinDate()}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!currentAccount || !clientProfile || isLoading}
              className="w-full bg-white text-[#5B3AED] py-3 rounded-lg font-[poppins] font-medium text-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={currentAccount && clientProfile && !isLoading ? { 
                scale: 1.02,
                backgroundColor: "#00D4AA",
                color: "#ffffff"
              } : {}}
              whileTap={currentAccount && clientProfile && !isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5B3AED] mr-2" />
                  Posting Job...
                </div>
              ) : (
                'Post Job'
              )}
            </motion.button>
          </form>

          {/* Contract Info */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm font-[poppins]">
              Contract: {GIGSTREAM_CONSTANTS.PACKAGE_ID.slice(0, 6)}...{GIGSTREAM_CONSTANTS.PACKAGE_ID.slice(-4)}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJob;