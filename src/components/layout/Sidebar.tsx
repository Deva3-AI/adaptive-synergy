// Import necessary dependencies
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, ChevronRight, 
  LayoutDashboard, Users, Briefcase, FileText, Calendar, 
  BarChart, Settings, Mail, MessageSquare, PieChart, 
  User, ScrollText, ClipboardList, Workflow, Brain, 
  UserCog, CreditCard
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProps } from '@/types';

// Use a type alias to avoid the conflict
import type { LucideIcon as LucideIconType } from '@/types';

interface NavItemProps {
  to: string;
  icon: LucideIconType;
  label: string;
  expanded: boolean;
  active?: boolean;
  subItems?: { to: string; label: string }[];
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, expanded, active, subItems }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
            active && "bg-accent text-accent-foreground"
          )
        }
      >
        <TooltipProvider>
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            <span className={cn(expanded ? "block" : "hidden", "ml-2")}>{label}</span>
          </div>
          {!expanded && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="p-0 ml-auto">
                  {label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {label}
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </NavLink>
      {subItems && expanded && (
        <ul className="ml-4 mt-1 space-y-1">
          {subItems.map((subItem) => (
            <li key={subItem.to}>
              <NavLink
                to={subItem.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                {subItem.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ expanded, className, isMobile }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(expanded);
  const matches = useMediaQuery('(max-width: 768px)');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Conditionally set isExpanded based on the 'expanded' prop
  React.useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Collapse sidebar on mobile when a route is clicked
  React.useEffect(() => {
    if (matches) {
      setIsExpanded(false);
    }
  }, [location.pathname, matches]);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-secondary/50 text-secondary-foreground",
        expanded ? "w-64" : "w-[5rem]",
        className
      )}
    >
      <div className="flex items-center justify-between py-3 px-3">
        <Button variant="ghost" onClick={toggleSidebar}>
          {isExpanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>
        {isExpanded && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border rounded-md shadow-md p-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold">{user?.email}</p>
                  <Button variant="secondary" size="sm" onClick={signOut} className="mt-2">Sign Out</Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <ScrollArea className="flex-1 space-y-4 px-3 py-2">
        <ul className="mt-3 space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Dashboard</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Dashboard
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Dashboard
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Clients</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Clients
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Clients
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/client/brands"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Brands</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Brands
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Brands
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/client/tasks"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Tasks</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Tasks
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Tasks
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/client/reports"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Reports</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Reports
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Reports
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
        </ul>
        {isExpanded && <Separator />}
        <ul className="mt-3 space-y-2">
          <li>
            <NavLink
              to="/employee/dashboard"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Employee Dashboard</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Employee Dashboard
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Employee Dashboard
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employee/tasks"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Employee Tasks</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Employee Tasks
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Employee Tasks
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employee/leave-requests"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Leave Requests</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Leave Requests
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Leave Requests
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employee/profile"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Profile</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Profile
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Profile
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
        </ul>
        {isExpanded && <Separator />}
        <ul className="mt-3 space-y-2">
          <li>
            <NavLink
              to="/finance/dashboard"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Finance</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Finance
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Finance
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hr/dashboard"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>HR</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        HR
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      HR
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/marketing/dashboard"
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <TooltipProvider>
                <div className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  <span className={cn(isExpanded ? "block" : "hidden", "ml-2")}>Marketing</span>
                </div>
                {!isExpanded && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 ml-auto">
                        Marketing
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      Marketing
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </NavLink>
          </li>
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;

