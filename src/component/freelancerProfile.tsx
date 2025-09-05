// src/components/FreelancerProfile.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { GIGSTREAM_CONSTANTS, CONTRACT_FUNCTIONS } from '../utils/gigstreamConstants';

interface FormData {
  name: string;
  bio: string;
  skills: string;
  portfolio: string;
}

const FreelancerProfile = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    skills: '',
    portfolio: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.name.trim() || !formData.bio.trim() || !formData.skills.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const txb = new Transaction();
      txb.setGasBudget(GIGSTREAM_CONSTANTS.GAS_BUDGET);
      
      // Call the deployed contract function
      txb.moveCall({
        target: CONTRACT_FUNCTIONS.CREATE_FREELANCER_PROFILE,
        arguments: [
          txb.object(GIGSTREAM_CONSTANTS.GIGSTREAM_OBJECT_ID), // Platform object
          txb.pure.string(formData.name.trim()),
          txb.pure.string(formData.bio.trim()),
          txb.pure.string(formData.skills.trim()),
          txb.pure.string(formData.portfolio.trim()),
        ],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('Freelancer profile created:', result);
            setSuccess(`Freelancer profile created successfully! Transaction: ${result.digest}`);
            setFormData({
              name: '',
              bio: '',
              skills: '',
              portfolio: '',
            });
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            setError(`Failed to create profile: ${error.message}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B3AED] via-[#4C2EC7] to-[#3D1FA0] p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20"
        >
          <h1 className="text-3xl font-bold text-white font-[poppins] mb-8 text-center">
            Create Freelancer Profile
          </h1>

          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 backdrop-blur-sm"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 backdrop-blur-sm"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </motion.div>
          )}

          {!currentAccount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200 backdrop-blur-sm"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please connect your Sui wallet to create a freelancer profile
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                className="w-full p-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent disabled:opacity-50 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                rows={4}
                className="w-full p-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent disabled:opacity-50 resize-vertical transition-all duration-300 backdrop-blur-sm"
                placeholder="Tell us about yourself and your experience"
                required
              />
            </div>

            {/* Skills Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Skills *
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                className="w-full p-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent disabled:opacity-50 transition-all duration-300 backdrop-blur-sm"
                placeholder="e.g., React, Node.js, Solidity, UI/UX Design"
                required
              />
              <p className="text-white/60 text-sm mt-1">
                Separate multiple skills with commas
              </p>
            </div>

            {/* Portfolio Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                className="w-full p-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent disabled:opacity-50 transition-all duration-300 backdrop-blur-sm"
                placeholder="https://your-portfolio.com"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!currentAccount || isLoading}
              className="w-full bg-gradient-to-r from-white to-gray-100 text-[#5B3AED] py-4 rounded-xl font-[poppins] font-semibold text-lg transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl"
              whileHover={currentAccount && !isLoading ? { 
                scale: 1.02,
                background: "linear-gradient(to right, #00D4AA, #00B896)"
              } : {}}
              whileTap={currentAccount && !isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5B3AED] mr-3" />
                  Creating Profile...
                </div>
              ) : (
                'Create Freelancer Profile'
              )}
            </motion.button>
          </form>

          {/* Contract Info */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center space-y-2">
              <p className="text-white/60 text-sm font-[poppins]">
                Smart Contract Details
              </p>
              <p className="text-white/50 text-xs font-mono">
                Package: {GIGSTREAM_CONSTANTS.PACKAGE_ID.slice(0, 8)}...{GIGSTREAM_CONSTANTS.PACKAGE_ID.slice(-8)}
              </p>
              <p className="text-white/50 text-xs font-mono">
                Network: Sui Testnet
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreelancerProfile;