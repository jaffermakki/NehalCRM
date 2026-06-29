import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Repairs } from './pages/Repairs';
import { Customers } from './pages/Customers';
import { useStore } from './store/useStore';

export default function App() {
  const setOnlineStatus = useStore(state => state.setOnlineStatus);

  // Global Offline/Online event listeners
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/customers" element={<Customers />} />
          {/* Add future routes here: /inventory, /reports, /settings */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
