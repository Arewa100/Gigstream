// src/components/Dashboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Determine the page type based on the current route
  const isHirePage = location.pathname.includes('/hire');
  const isFindGigPage = location.pathname.includes('/find-gig');

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
      // Set default stats for demo - this will show when the contract isn't deployed yet
      setPlatformStats({
        total_freelancers: 0,
        total_clients: 0,
        total_jobs: 0,
      });
    }
  };

  // Fetch job listings using events (correct approach for shared objects)
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching jobs from events...');
      
      // Query events for JobListingCreated
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::JobListingCreated`
        },
        limit: 50, // Adjust as needed
        order: 'descending'
      });

      console.log('Found job events:', events.data.length);

      const parsedJobs: JobListing[] = [];
      
      // Get job details for each event
      for (const event of events.data) {
        try {
          if (event.parsedJson && typeof event.parsedJson === 'object') {
            const eventData = event.parsedJson as any;
            const jobId = eventData.job_id;
            
            console.log('Fetching job details for:', jobId);
            
            // Fetch the actual job object
            const jobObject = await client.getObject({
              id: jobId,
              options: {
                showContent: true,
                showType: true,
              },
            });

            if (jobObject?.data?.content && 'fields' in jobObject.data.content) {
              const fields = jobObject.data.content.fields as any;
              
              // Handle required_skills - it could be a vector or already a string
              let skillsString = '';
              if (Array.isArray(fields.required_skills)) {
                skillsString = fields.required_skills.join(', ');
              } else if (typeof fields.required_skills === 'string') {
                skillsString = fields.required_skills;
              } else if (fields.required_skills && fields.required_skills.fields) {
                // Handle Move vector format
                skillsString = Object.values(fields.required_skills.fields || {}).join(', ');
              }
              
              parsedJobs.push({
                id: jobId,
                client: fields.client,
                title: fields.title,
                description: fields.description,
                required_skills: skillsString,
                budget: parseInt(fields.budget) || 0,
                deadline: parseInt(fields.deadline) || Date.now() + 7 * 24 * 60 * 60 * 1000, // Default to 7 days from now
                status: fields.status || 'Open',
                applications: Array.isArray(fields.applications) ? fields.applications : [],
                assigned_freelancer: fields.assigned_freelancer?.vec?.[0], // Handle Option<address>
                created_at: parseInt(fields.created_at) || Date.now(),
              });

              console.log('Successfully parsed job:', fields.title);
            }
          }
        } catch (jobErr) {
          console.error('Error fetching individual job:', jobErr);
          // Continue with next job instead of failing completely
        }
      }

      console.log('Total parsed jobs:', parsedJobs.length);

      // Filter jobs based on page type and current user
      let filteredJobs = parsedJobs;
      
      if (currentAccount) {
        if (isHirePage) {
          // On hire page, show jobs posted by current user
          filteredJobs = parsedJobs.filter(job => 
            job.client.toLowerCase() === currentAccount.address.toLowerCase()
          );
        } else if (isFindGigPage) {
          // On find-gig page, show all open jobs except those posted by current user
          filteredJobs = parsedJobs.filter(job => 
            job.status === 'Open' && 
            job.client.toLowerCase() !== currentAccount.address.toLowerCase()
          );
        } else {
          // Default: show all open jobs
          filteredJobs = parsedJobs.filter(job => job.status === 'Open');
        }
      } else {
        // If no account connected, show all open jobs
        filteredJobs = parsedJobs.filter(job => job.status === 'Open');
      }

      console.log('Filtered jobs:', filteredJobs.length);
      
      setJobs(filteredJobs);
      setError('');
    } catch (err) {
      console.error('Failed to fetch jobs from events:', err);
      setError('Failed to load job listings from blockchain events');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchPlatformStats();
      fetchJobs();
    } else {
      // Even without an account, try to fetch public job listings
      fetchJobs();
    }
  }, [currentAccount, client, location.pathname]); // Added location.pathname to refetch when page changes

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatBudget = (amount: number) => {
    return `${(amount / 1_000_000_000).toLocaleString()} SUI`; // Convert from MIST to SUI
  };

  const getDaysRemaining = (deadline: number) => {
    const days = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : 'Expired';
  };

  const getPageTitle = () => {
    if (isHirePage) return 'Hire Talent';
    if (isFindGigPage) return 'Find Gigs';
    return 'Gigstream Dashboard';
  };

  const getPageSubtitle = () => {
    if (isHirePage) return 'Find and hire the best Web3 freelancers';
    if (isFindGigPage) return 'Discover your next Web3 freelance opportunity';
    return 'Manage your Web3 freelance opportunities';
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
              {getPageTitle()}
            </h1>
            <p className="text-white/70 font-[poppins]">
              {getPageSubtitle()}
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

          {/* Quick Actions - Conditional based on page type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Show different actions based on page type */}
            {isHirePage && (
              <>
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

                <Link to="/post-job">
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
              </>
            )}

            {isFindGigPage && (
              <>
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

                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                >
                  <h3 className="text-white font-[poppins] font-semibold mb-2">
                    Browse Opportunities
                  </h3>
                  <p className="text-white/70 text-sm">
                    Explore available jobs below and apply to the ones that match your skills
                  </p>
                </motion.div>
              </>
            )}

            {/* Default dashboard view (when not hire or find-gig page) */}
            {!isHirePage && !isFindGigPage && (
              <>
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

                <Link to="/post-job">
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
              </>
            )}
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
                {isHirePage ? 'Posted Jobs' : 'Available Jobs'}
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
                        {job.required_skills && (
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
                        )}
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
                      {!isHirePage && (
                        <button className="bg-white text-[#5B3AED] px-4 py-2 rounded-lg font-[poppins] font-medium hover:bg-[#00D4AA] hover:text-white transition-colors">
                          Apply Now
                        </button>
                      )}
                      {isHirePage && (
                        <button className="bg-white text-[#5B3AED] px-4 py-2 rounded-lg font-[poppins] font-medium hover:bg-[#00D4AA] hover:text-white transition-colors">
                          View Applications
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">
                  {isHirePage ? 'No jobs posted yet' : 'No job listings available'}
                </p>
                <p className="text-white/50 text-sm">
                  {isHirePage 
                    ? 'Create a client profile and post your first job!' 
                    : 'Check back later for new opportunities!'
                  }
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