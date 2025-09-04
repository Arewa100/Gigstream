// src/components/ClientProfile.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { GIGSTREAM_CONSTANTS } from '../utils/gigstreamConstants';

interface ClientFormData {
  name: string;
  company: string;
  description: string;
}

const ClientProfile = () => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    company: '',
    description: '',
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

    if (!formData.name.trim() || !formData.company.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const txb = new Transaction();
      txb.setGasBudget(GIGSTREAM_CONSTANTS.GAS_BUDGET);
      
      txb.moveCall({
        target: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::create_client_profile`,
        arguments: [
          txb.pure.string(formData.name.trim()),
          txb.pure.string(formData.company.trim()),
          txb.pure.string(formData.description.trim()),
        ],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('Client profile created:', result);
            setSuccess('Client profile created successfully!');
            setFormData({
              name: '',
              company: '',
              description: '',
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
    <div className="min-h-screen bg-[#5B3AED] p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-white font-[poppins] mb-8 text-center">
            Create Client Profile
          </h1>

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
              Please connect your Sui wallet to create a client profile
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Company Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50"
                placeholder="Enter your company name"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-white font-[poppins] font-medium mb-2">
                Company Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!currentAccount || isLoading}
                rows={4}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] disabled:opacity-50 resize-vertical"
                placeholder="Describe your company and what type of projects you typically work on"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!currentAccount || isLoading}
              className="w-full bg-white text-[#5B3AED] py-3 rounded-lg font-[poppins] font-medium text-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={currentAccount && !isLoading ? { 
                scale: 1.02,
                backgroundColor: "#00D4AA",
                color: "#ffffff"
              } : {}}
              whileTap={currentAccount && !isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5B3AED] mr-2" />
                  Creating Profile...
                </div>
              ) : (
                'Create Client Profile'
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

export default ClientProfile;