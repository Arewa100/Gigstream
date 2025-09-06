// src/components/Dashboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { Link } from 'react-router-dom';
import { GIGSTREAM_CONSTANTS, NETWORK_CONFIG } from '../utils/gigstreamConstants';

interface JobListing {
  id: string;
  client: string;
  title: string;
  description: string;
  required_skills: string;
  budget: number;
  deadline: number;
  status: string;
  applications: string[];
  assigned_freelancer?: string;
  created_at: number;
}

interface PlatformStats {
  total_freelancers: number;
  total_clients: number;
  total_jobs: number;
}

const Dashboard = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentAccount = useCurrentAccount();

  const client = useMemo(
    () =>
      new SuiClient({
        network: NETWORK_CONFIG.network,
        url: NETWORK_CONFIG.rpcUrl,
      }),
    []
  );

  // Fetch platform statistics
  const fetchPlatformStats = async () => {
    try {
      const platformObject = await client.getObject({
        id: GIGSTREAM_CONSTANTS.GIGSTREAM_OBJECT_ID,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (platformObject?.data?.content && 'fields' in platformObject.data.content) {
        const fields = platformObject.data.content.fields as any;
        setPlatformStats({
          total_freelancers: parseInt(fields.total_freelancers) || 0,
          total_clients: parseInt(fields.total_clients) || 0,
          total_jobs: parseInt(fields.total_jobs) || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch platform stats:', err);
    }
  };

  // Fetch job listings from the blockchain
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching jobs from contract:', GIGSTREAM_CONSTANTS.PACKAGE_ID);
      
      // Get all JobListing objects from the contract
      const jobObjects = await client.getOwnedObjects({
        owner: GIGSTREAM_CONSTANTS.GIGSTREAM_OBJECT_ID,
        filter: {
          StructType: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::JobListing`
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      // Parse job objects
      const parsedJobs: JobListing[] = [];
      for (const jobObj of jobObjects.data) {
        if (jobObj.data?.content && 'fields' in jobObj.data.content) {
          const fields = jobObj.data.content.fields as any;
          
          parsedJobs.push({
            id: jobObj.data.objectId,
            client: fields.client,
            title: fields.title,
            description: fields.description,
            required_skills: fields.required_skills.join(', '), // Convert vector to string
            budget: parseInt(fields.budget),
            deadline: parseInt(fields.deadline),
            status: fields.status,
            applications: fields.applications || [],
            assigned_freelancer: fields.assigned_freelancer?.vec?.[0], // Handle Option<address>
            created_at: parseInt(fields.created_at),
          });
        }
      }

      setJobs(parsedJobs.filter(job => job.status === 'Open')); // Only show open jobs
      setError('');
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load job listings from blockchain');
      
      // Fallback to demo data for development
      const mockJobs: JobListing[] = [
        {
          id: "demo_job_1",
          client: "0x1234...5678",
          title: "DeFi Frontend Developer",
          description: "Build a modern DeFi interface using React and Web3",
          required_skills: "React, TypeScript, Web3.js",
          budget: 5000,
          deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
          status: "Open",
          applications: [],
          created_at: Date.now(),
        },
        {
          id: "demo_job_2", 
          client: "0x9876...4321",
          title: "Smart Contract Audit",
          description: "Security audit for DeFi protocol smart contracts",
          required_skills: "Solidity, Security Auditing, DeFi",
          budget: 8000,
          deadline: Date.now() + 14 * 24 * 60 * 60 * 1000,
          status: "Open",
          applications: [],
          created_at: Date.now(),
        }
      ];
      setJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchPlatformStats();
      fetchJobs();
    }
  }, [currentAccount, client]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysRemaining = (deadline: number) => {
    const days = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : 'Expired';
  };

  return (
    <div className="min-h-screen bg-[#5B3AED] p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white font-[poppins] mb-4">
              Gigstream Dashboard
            </h1>
            <p className="text-white/70 font-[poppins]">
              Manage your Web3 freelance opportunities
            </p>
          </div>

          {/* Platform Statistics */}
          {platformStats && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white font-[poppins] mb-4">
                Platform Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#00D4AA]">{platformStats.total_freelancers}</p>
                  <p className="text-white/70 text-sm">Freelancers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#00D4AA]">{platformStats.total_clients}</p>
                  <p className="text-white/70 text-sm">Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#00D4AA]">{platformStats.total_jobs}</p>
                  <p className="text-white/70 text-sm">Jobs Posted</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/freelancer-profile">
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-[poppins] font-semibold mb-2">
                  Create Freelancer Profile
                </h3>
                <p className="text-white/70 text-sm">
                  Set up your freelancer profile to start applying for jobs
                </p>
              </motion.div>
            </Link>

            <Link to="/client-profile">
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-[poppins] font-semibold mb-2">
                  Create Client Profile
                </h3>
                <p className="text-white/70 text-sm">
                  Set up your client profile to start posting jobs
                </p>
              </motion.div>
            </Link>

            <Link to="/job-listing">
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-[poppins] font-semibold mb-2">
                  Post New Job
                </h3>
                <p className="text-white/70 text-sm">
                  Create a new job listing to find talented freelancers
                </p>
              </motion.div>
            </Link>
          </div>

          {/* Wallet Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-[poppins] font-semibold">
                  Wallet Status
                </h3>
                <p className="text-white/70 text-sm">
                  {currentAccount ? (
                    <>Connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}</>
                  ) : (
                    'No wallet connected'
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">Network</p>
                <p className="text-[#00D4AA] font-semibold">{NETWORK_CONFIG.network}</p>
              </div>
            </div>
          </div>

          {/* Job Listings Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-[poppins]">
                Available Jobs
              </h2>
              <button
                onClick={fetchJobs}
                disabled={isLoading}
                className="bg-[#00D4AA] text-white px-4 py-2 rounded-lg font-[poppins] font-medium hover:bg-[#00B896] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
              >
                {error}
              </motion.div>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
                <p className="text-white/70">Loading job listings...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white font-[poppins] mb-2">
                          {job.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-2">
                          Client: {job.client.slice(0, 6)}...{job.client.slice(-4)}
                        </p>
                        <p className="text-white/90 mb-3">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.required_skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[#00D4AA]/20 text-[#00D4AA] px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                        {job.applications.length > 0 && (
                          <p className="text-white/60 text-sm">
                            {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          {job.status}
                        </div>
                        <p className="text-[#00D4AA] font-bold text-lg">
                          {formatBudget(job.budget)}
                        </p>
                        <p className="text-white/70 text-sm">
                          {getDaysRemaining(job.deadline)}
                        </p>
                        <p className="text-white/50 text-xs">
                          Due: {formatDate(job.deadline)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="bg-white text-[#5B3AED] px-4 py-2 rounded-lg font-[poppins] font-medium hover:bg-[#00D4AA] hover:text-white transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">No job listings available</p>
                <p className="text-white/50 text-sm">
                  Create a client profile and post the first job!
                </p>
              </div>
            )}
          </div>

          {/* Contract Info */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm font-[poppins]">
              Smart Contract: {GIGSTREAM_CONSTANTS.PACKAGE_ID.slice(0, 6)}...{GIGSTREAM_CONSTANTS.PACKAGE_ID.slice(-4)}
            </p>
            <p className="text-white/50 text-xs font-[poppins] mt-1">
              Network: {NETWORK_CONFIG.network} | Module: {GIGSTREAM_CONSTANTS.MODULE_NAME}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;