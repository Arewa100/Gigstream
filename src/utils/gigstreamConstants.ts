// src/utils/gigstreamConstants.ts

// Smart Contract Constants
export const GIGSTREAM_CONSTANTS = {
  PACKAGE_ID: "YOUR_PACKAGE_ID_HERE", // Replace with deployed package ID
  MODULE_NAME: "gigstream",
  GAS_BUDGET: 10000000, // 0.01 SUI in MIST units
};

// TypeScript Interfaces
export interface FreelancerProfile {
  id: string;
  owner: string;
  name: string;
  bio: string;
  skills: string;
  portfolio: string;
}

export interface ClientProfile {
  id: string;
  owner: string;
  name: string;
  company: string;
  description: string;
  projects_posted: number;
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
}

export interface ContractCallResult {
  success: boolean;
  error?: string;
  transactionDigest?: string;
}

// Network Configuration
export const NETWORK_CONFIG = {
  network: 'testnet' as const,
  rpcUrl: 'https://fullnode.testnet.sui.io:443',
};