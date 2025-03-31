
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Sidebar from './Sidebar';
import Header from '../layout/Header';

const RootLayout: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  
  const handleMenuClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar expanded={expanded} />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={handleMenuClick} appName="AI Workflow Platform" />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default RootLayout;
