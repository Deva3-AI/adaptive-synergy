import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart, 
  Settings,
  User,
  Building,
  Mail,
  Calendar,
  TrendingUp,
  MessageSquare,
  ListChecks,
  File,
  BadgeCheck,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  expanded?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: string;
}

const navItems: {
  main: NavItem[];
  employee: NavItem[];
  hr: NavItem[];
  finance: NavItem[];
  marketing: NavItem[];
  adminTools: NavItem[];
} = {
  main: [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
  ],
  employee: [
    {
      href: '/employee/tasks',
      label: 'My Tasks',
      icon: ListChecks,
    },
    {
      href: '/employee/attendance',
      label: 'Attendance',
      icon: Clock,
    },
    {
      href: '/employee/profile',
      label: 'My Profile',
      icon: User,
    },
  ],
  hr: [
    {
      href: '/hr/employees',
      label: 'Employees',
      icon: Users,
    },
    {
      href: '/hr/recruitment',
      label: 'Recruitment',
      icon: Building,
    },
    {
      href: '/hr/leave-requests',
      label: 'Leave Requests',
      icon: Calendar,
    },
    {
      href: '/hr/performance',
      label: 'Performance',
      icon: TrendingUp,
    },
  ],
  finance: [
    {
      href: '/finance/dashboard',
      label: 'Dashboard',
      icon: BarChart,
    },
    {
      href: '/finance/invoices',
      label: 'Invoices',
      icon: FileText,
    },
    {
      href: '/finance/reports',
      label: 'Reports',
      icon: File,
    },
  ],
  marketing: [
    {
      href: '/marketing/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/marketing/campaigns',
      label: 'Campaigns',
      icon: TrendingUp,
    },
    {
      href: '/marketing/analytics',
      label: 'Analytics',
      icon: BarChart,
    },
    {
      href: '/marketing/leads',
      label: 'Leads',
      icon: Users,
    },
    {
      href: '/marketing/meetings',
      label: 'Meetings',
      icon: MessageSquare,
    },
  ],
  adminTools: [
    {
      href: '/admin/users',
      label: 'Manage Users',
      icon: Users,
      permission: 'manage_users',
    },
    {
      href: '/admin/roles',
      label: 'Manage Roles',
      icon: ShieldCheck,
      permission: 'manage_roles',
    },
    {
      href: '/admin/settings',
      label: 'System Settings',
      icon: Settings,
      permission: 'manage_settings',
    },
  ],
};

const Sidebar = ({ expanded = true }: SidebarProps) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();
  
  // Use hasRole instead of isEmployee, etc.
  const showEmployeeSection = hasRole('employee') || hasRole('admin');
  const showMarketingSection = hasRole('marketing') || hasRole('admin');
  const showHRSection = hasRole('hr') || hasRole('admin');
  const showFinanceSection = hasRole('finance') || hasRole('admin');

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div
      className={cn(
        "flex flex-col space-y-4 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-850",
        expanded ? "w-64" : "w-20",
        "transition-width duration-300 ease-in-out"
      )}
    >
      <div className="flex items-center justify-center py-4">
        <span className="font-bold text-xl dark:text-white">
          {expanded ? 'AI Workflow' : 'AI'}
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {/* Main Navigation */}
        {navItems.main.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                  : "text-gray-700 dark:text-gray-400"
              )
            }
          >
            <item.icon className="mr-2.5 h-4 w-4" />
            {expanded && item.label}
          </NavLink>
        ))}

        {/* Employee Section */}
        {showEmployeeSection && (
          <>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
              {expanded && "Employee Tools"}
            </div>
            {navItems.employee.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-400"
                  )
                }
              >
                <item.icon className="mr-2.5 h-4 w-4" />
                {expanded && item.label}
              </NavLink>
            ))}
          </>
        )}

        {/* HR Section */}
        {showHRSection && (
          <>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
              {expanded && "HR Management"}
            </div>
            {navItems.hr.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-400"
                  )
                }
              >
                <item.icon className="mr-2.5 h-4 w-4" />
                {expanded && item.label}
              </NavLink>
            ))}
          </>
        )}

        {/* Finance Section */}
        {showFinanceSection && (
          <>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
              {expanded && "Finance Management"}
            </div>
            {navItems.finance.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-400"
                  )
                }
              >
                <item.icon className="mr-2.5 h-4 w-4" />
                {expanded && item.label}
              </NavLink>
            ))}
          </>
        )}

        {/* Marketing Section */}
        {showMarketingSection && (
          <>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
              {expanded && "Marketing Tools"}
            </div>
            {navItems.marketing.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-400"
                  )
                }
              >
                <item.icon className="mr-2.5 h-4 w-4" />
                {expanded && item.label}
              </NavLink>
            ))}
          </>
        )}

        {/* Admin Tools Section */}
        {hasRole('admin') && (
          <>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
              {expanded && "Admin Tools"}
            </div>
            {navItems.adminTools.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                      : "text-gray-700 dark:text-gray-400"
                  )
                }
              >
                <item.icon className="mr-2.5 h-4 w-4" />
                {expanded && item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
