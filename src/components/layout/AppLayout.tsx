
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      {isDesktop && <Sidebar />}
      
      {/* Mobile sidebar drawer */}
      {!isDesktop && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      
      <div className="flex flex-col flex-1">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          appName="Hive"
        />
        
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
