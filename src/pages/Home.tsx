
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ItemFeed from '@/components/Items/ItemFeed';
import LandingPage from '@/components/Landing/LandingPage';
import Loading from '@/components/ui/loading';

const Home = () => {
  const { state } = useAuth();

  // Show loading state while checking authentication
  if (state.isLoading) {
    return <Loading />;
  }

  // Show landing page for non-authenticated users
  if (!state.isAuthenticated) {
    return <LandingPage />;
  }

  // Show item feed for authenticated users
  return <ItemFeed />;
};

export default Home;
