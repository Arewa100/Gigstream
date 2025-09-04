// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
import './App.css';

// Import your components
import LandingPage from './component/landingPage';
import Dashboard from './component/dashboard';
import FreelancerProfile from './component/freelancerProfile';
import ClientProfile from './component/clientProfile';
import JobListing from './component/jobListing';
import ProtectedRoute from './component/protectedRoute';

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider 
          autoConnect={true}
        >
          <Router>
            <div className="App">
              <Routes>
                {/* Landing page route */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Protected dashboard route */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected freelancer profile creation */}
                <Route 
                  path="/freelancer-profile" 
                  element={
                    <ProtectedRoute>
                      <FreelancerProfile />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected client profile creation */}
                <Route 
                  path="/client-profile" 
                  element={
                    <ProtectedRoute>
                      <ClientProfile />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected job listing creation */}
                <Route 
                  path="/job-listing" 
                  element={
                    <ProtectedRoute>
                      <JobListing />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Redirecting any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;