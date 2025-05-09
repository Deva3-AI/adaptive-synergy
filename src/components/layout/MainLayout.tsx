
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "@/components/Navbar";
import EnhancedAIAssistant from "../ai/EnhancedAIAssistant";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 bg-background/50">
          <Outlet />
        </main>
      </div>
      <EnhancedAIAssistant />
    </div>
  );
};

export default MainLayout;
