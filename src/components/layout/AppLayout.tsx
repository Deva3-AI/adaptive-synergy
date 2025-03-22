
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import { useMediaQuery } from '@/hooks/use-media-query';
import AIAssistant from '@/components/ai/AIAssistant';
import { Toaster } from '@/components/ui/sonner';

const AppLayout = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Function to toggle the mobile sidebar
  const handleMenuClick = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - only visible on desktop */}
      {isDesktop ? (
        <Sidebar className="hidden lg:flex" />
      ) : (
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          onMenuClick={handleMenuClick} 
          appName="Hive" 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
      
      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;
