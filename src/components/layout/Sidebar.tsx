
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart,
  Bell,
  Settings,
  LogOut,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: BarChart, label: "Analytics", path: "/analytics" },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: 3 },
  { icon: CreditCard, label: "Finance", path: "/finance" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile sidebar trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar transition-all duration-300 ease-in-out border-r border-sidebar-border flex flex-col",
          collapsed ? "w-[70px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center flex-1 space-x-2">
              <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">AI</span>
              </div>
              <span className="font-display font-semibold text-lg">HyperFlow</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-full",
              collapsed && "mx-auto"
            )}
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <TooltipProvider key={item.path} delayDuration={collapsed ? 100 : 1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 rounded-md text-sm group transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                          collapsed && "justify-center"
                        )
                      }
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed ? "mr-0" : "mr-3")} />
                      {!collapsed && <span className="flex-1">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <Badge variant="accent" size="sm" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" sideOffset={10}>
                      <p>{item.label}</p>
                      {item.badge && (
                        <Badge variant="accent" size="sm" className="ml-1">
                          {item.badge}
                        </Badge>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        {/* User profile */}
        <div className="border-t border-sidebar-border p-3">
          <TooltipProvider delayDuration={collapsed ? 100 : 1000}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer",
                    collapsed && "justify-center"
                  )}
                >
                  <Avatar className={cn("h-8 w-8", collapsed ? "mr-0" : "mr-2")}>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-xs text-muted-foreground truncate">
                        john.doe@example.com
                      </div>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={10}>
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">
                    john.doe@example.com
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={collapsed ? 100 : 1000}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "mt-2 w-full justify-start text-muted-foreground hover:text-sidebar-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                  {!collapsed && <span>Log out</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={10}>
                  <p>Log out</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
