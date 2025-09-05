// src/utils/gigstreamConstants.ts

// Smart Contract Constants - Updated with successful deployment
export const GIGSTREAM_CONSTANTS = {
  PACKAGE_ID: "0x98902d9e972cff605d5db7312fa172c55f96d9423bedd859d2588fd316288f93",
  MODULE_NAME: "gigstream",
  GIGSTREAM_OBJECT_ID: "0x481ca139d25da79607784538ca6773efa75efc069ed2b572468d35b8ac1f6c48", // Shared platform object
  UPGRADE_CAP_ID: "0xf85790dcf7c3d41f395387c8f3188e3e8f46c862562c5945e55d363796322ceb",
  GAS_BUDGET: 50000000, // 0.05 SUI in MIST units (increased for reliability)
};

// Network Configuration
export const NETWORK_CONFIG = {
  network: 'testnet' as const,
  rpcUrl: 'https://fullnode.testnet.sui.io:443',
};

// Latest deployment information
export const DEPLOYMENT_INFO = {
  transactionDigest: "7bYkHu6P2Y4mKsY5oiAchsAAvmokowyG2Lwi2kpQN4ph",
  deployedBy: "0x54809dc3660f0e7ee620fe12fd2b8c05dad823beea0c7ceded00f49ba210e450",
  epoch: 848,
  gasUsed: 28780280, // MIST (approximately 0.0288 SUI)
  storageRebate: 978120, // MIST
  computationCost: 1000000, // MIST
};

// TypeScript Interfaces for your contract objects
export interface FreelancerProfile {
  id: string;
  owner: string;
  name: string;
  bio: string;
  skills: string;
  portfolio: string;
  rating: number;
  jobs_completed: number;
  created_at: number;
}

export interface ClientProfile {
  id: string;
  owner: string;
  name: string;
  company: string;
  description: string;
  projects_posted: number;
  rating: number;
  created_at: number;
}

export interface JobListing {
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

export interface JobApplication {
  id: string;
  job_id: string;
  freelancer: string;
  proposal: string;
  quoted_price: number;
  estimated_delivery: number;
  created_at: number;
}

export interface ContractCallResult {
  success: boolean;
  error?: string;
  transactionDigest?: string;
}

// Contract function targets for easy reference
export const CONTRACT_FUNCTIONS = {
  CREATE_FREELANCER_PROFILE: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::create_freelancer_profile`,
  CREATE_CLIENT_PROFILE: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::create_client_profile`,
  CREATE_JOB_LISTING: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::create_job_listing`,
  APPLY_TO_JOB: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::apply_to_job`,
  UPDATE_FREELANCER_PROFILE: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::update_freelancer_profile`,
  UPDATE_CLIENT_PROFILE: `${GIGSTREAM_CONSTANTS.PACKAGE_ID}::${GIGSTREAM_CONSTANTS.MODULE_NAME}::update_client_profile`,
};

// Error codes from your contract
export const CONTRACT_ERRORS = {
  E_JOB_NOT_OPEN: 1,
  E_NOT_JOB_OWNER: 2,
  E_ALREADY_APPLIED: 3,
  E_INVALID_STATUS: 4,
  E_UNAUTHORIZED: 5,
};

// Job status constants matching your contract
export const JOB_STATUS = {
  OPEN: "Open",
  CLOSED: "Closed",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
} as const;

// Explorer URLs for easy access
export const EXPLORER_URLS = {
  PACKAGE: `https://testnet.suivision.xyz/package/${GIGSTREAM_CONSTANTS.PACKAGE_ID}`,
  TRANSACTION: `https://testnet.suivision.xyz/txblock/${DEPLOYMENT_INFO.transactionDigest}`,
  GIGSTREAM_OBJECT: `https://testnet.suivision.xyz/object/${GIGSTREAM_CONSTANTS.GIGSTREAM_OBJECT_ID}`,
};