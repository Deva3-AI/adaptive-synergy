
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';

const AppLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar expanded={sidebarExpanded} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onClose={closeMobileSidebar} 
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          onMenuClick={openMobileSidebar}
          onToggleSidebar={toggleSidebar}
          sidebarExpanded={sidebarExpanded}
          appName="AI Workflow Platform"
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
