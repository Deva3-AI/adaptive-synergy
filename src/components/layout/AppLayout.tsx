
import React from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  className?: string;
}

const AppLayout = ({ className }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:pl-[240px] transition-all duration-300 ease-in-out">
        <div className={cn("p-4 md:p-6 lg:p-8 min-h-screen", className)}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
