import { Navigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentAccount = useCurrentAccount();
  
  // If no wallet is connected, redirect to landing page
  if (!currentAccount) {
    return <Navigate to="/" replace />;
  }
  
  // If wallet is connected, render the protected component
  return children;
};

export default ProtectedRoute;