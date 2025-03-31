import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  DollarSign,
  BarChart3,
  Settings,
  Briefcase,
  Building,
  ClipboardList,
  UserCircle,
  Clock,
  Calendar,
  GraduationCap,
  Receipt,
  PieChart,
  TrendingUp,
  LineChart,
  Target,
  BarChart,
  Megaphone,
  UserPlus,
  LayoutGrid,
  ChartPie,
  Gauge,
  MessageSquare,
  BookOpen,
  ArrowRightCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { LucideIcon } from '@/types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  expanded: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  active,
  expanded,
  onClick,
}) => {
  if (expanded) {
    return (
      <Link to={to} onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            active
              ? 'bg-muted hover:bg-muted font-medium text-foreground'
              : 'hover:bg-transparent hover:text-foreground'
          )}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </Button>
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link to={to} onClick={onClick}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                active
                  ? 'bg-muted hover:bg-muted text-foreground'
                  : 'hover:bg-transparent hover:text-foreground'
              )}
            >
              {icon}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-normal">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarSectionProps {
  title: string;
  expanded: boolean;
  icon: React.ReactNode;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    to: string;
  }>;
  defaultOpen?: boolean;
  currentPath: string;
  onNavigate?: () => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  expanded,
  icon,
  items,
  defaultOpen = false,
  currentPath,
  onNavigate,
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  if (!expanded) {
    return (
      <div className="px-2 py-1">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9"
                onClick={() => setOpen(!open)}
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {open && (
          <div className="mt-1 space-y-1">
            {items.map((item, i) => (
              <SidebarItem
                key={i}
                expanded={expanded}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={currentPath === item.to}
                onClick={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={setOpen}
      className="space-y-1"
    >
      <div className="px-3 py-1">
        <CollapsibleTrigger className="flex items-center text-sm w-full hover:text-foreground">
          {title}
          <ArrowRightCircle
            className={`ml-auto h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-1">
        {items.map((item, i) => (
          <SidebarItem
            key={i}
            expanded={expanded}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={currentPath === item.to}
            onClick={onNavigate}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface SidebarProps {
  expanded: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, onMobileClose }) => {
  const location = useLocation();
  const { isAdmin, isHR, isFinance, isMarketing } = useAuth();

  return (
    <div className="h-full border-r bg-background p-2 pt-3">
      <div className="flex flex-col space-y-2">
        <SidebarItem
          expanded={expanded}
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Dashboard"
          to="/dashboard"
          active={location.pathname === '/dashboard'}
          onClick={onMobileClose}
        />
        
        <div className="h-px bg-muted my-2"></div>
        
        <SidebarSection
          title="Employee"
          expanded={expanded}
          icon={<Briefcase className="h-4 w-4" />}
          items={[
            {
              icon: <LayoutDashboard className="h-4 w-4" />,
              label: 'Dashboard',
              to: '/employee/dashboard',
            },
            {
              icon: <UserCircle className="h-4 w-4" />,
              label: 'Profile',
              to: '/employee/profile',
            },
            {
              icon: <ClipboardList className="h-4 w-4" />,
              label: 'Tasks',
              to: '/employee/tasks',
            },
            {
              icon: <Clock className="h-4 w-4" />,
              label: 'Time Tracking',
              to: '/employee/time',
            },
          ]}
          defaultOpen={location.pathname.startsWith('/employee')}
          currentPath={location.pathname}
          onNavigate={onMobileClose}
        />

        {isHR && (
          <SidebarSection
            title="HR"
            expanded={expanded}
            icon={<Users className="h-4 w-4" />}
            items={[
              {
                icon: <LayoutDashboard className="h-4 w-4" />,
                label: 'Dashboard',
                to: '/hr/dashboard',
              },
              {
                icon: <Calendar className="h-4 w-4" />,
                label: 'Attendance',
                to: '/hr/attendance',
              },
              {
                icon: <Calendar className="h-4 w-4" />,
                label: 'Leave Management',
                to: '/hr/leave-management',
              },
              {
                icon: <GraduationCap className="h-4 w-4" />,
                label: 'Recruitment',
                to: '/hr/recruitment',
              },
              {
                icon: <FileSpreadsheet className="h-4 w-4" />,
                label: 'Payroll',
                to: '/hr/payroll',
              },
            ]}
            defaultOpen={location.pathname.startsWith('/hr')}
            currentPath={location.pathname}
            onNavigate={onMobileClose}
          />
        )}

        {isFinance && (
          <SidebarSection
            title="Finance"
            expanded={expanded}
            icon={<DollarSign className="h-4 w-4" />}
            items={[
              {
                icon: <LayoutDashboard className="h-4 w-4" />,
                label: 'Dashboard',
                to: '/finance/dashboard',
              },
              {
                icon: <Receipt className="h-4 w-4" />,
                label: 'Invoices',
                to: '/finance/invoices',
              },
              {
                icon: <FileSpreadsheet className="h-4 w-4" />,
                label: 'Expenses',
                to: '/finance/expenses',
              },
              {
                icon: <TrendingUp className="h-4 w-4" />,
                label: 'Sales',
                to: '/finance/sales',
              },
              {
                icon: <BarChart className="h-4 w-4" />,
                label: 'Reports',
                to: '/finance/reports',
              },
              {
                icon: <LineChart className="h-4 w-4" />,
                label: 'Performance',
                to: '/finance/performance',
              },
            ]}
            defaultOpen={location.pathname.startsWith('/finance')}
            currentPath={location.pathname}
            onNavigate={onMobileClose}
          />
        )}

        {isMarketing && (
          <SidebarSection
            title="Marketing"
            expanded={expanded}
            icon={<Megaphone className="h-4 w-4" />}
            items={[
              {
                icon: <LayoutDashboard className="h-4 w-4" />,
                label: 'Dashboard',
                to: '/marketing/dashboard',
              },
              {
                icon: <Target className="h-4 w-4" />,
                label: 'Campaigns',
                to: '/marketing/campaigns',
              },
              {
                icon: <UserPlus className="h-4 w-4" />,
                label: 'Leads',
                to: '/marketing/leads',
              },
              {
                icon: <ChartPie className="h-4 w-4" />,
                label: 'Analytics',
                to: '/marketing/analytics',
              },
              {
                icon: <MessageSquare className="h-4 w-4" />,
                label: 'Meetings',
                to: '/marketing/meetings',
              },
              {
                icon: <BookOpen className="h-4 w-4" />,
                label: 'Plans',
                to: '/marketing/plans',
              },
            ]}
            defaultOpen={location.pathname.startsWith('/marketing')}
            currentPath={location.pathname}
            onNavigate={onMobileClose}
          />
        )}

        <SidebarSection
          title="Client"
          expanded={expanded}
          icon={<Building className="h-4 w-4" />}
          items={[
            {
              icon: <LayoutDashboard className="h-4 w-4" />,
              label: 'Dashboard',
              to: '/client/dashboard',
            },
            {
              icon: <LayoutGrid className="h-4 w-4" />,
              label: 'Brands',
              to: '/client/brands',
            },
            {
              icon: <ClipboardList className="h-4 w-4" />,
              label: 'Tasks',
              to: '/client/tasks',
            },
            {
              icon: <BarChart3 className="h-4 w-4" />,
              label: 'Reports',
              to: '/client/reports',
            },
          ]}
          defaultOpen={location.pathname.startsWith('/client')}
          currentPath={location.pathname}
          onNavigate={onMobileClose}
        />

        <div className="h-px bg-muted my-2"></div>

        <SidebarItem
          expanded={expanded}
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          to="/settings"
          active={location.pathname === '/settings'}
          onClick={onMobileClose}
        />
      </div>
    </div>
  );
};

export default Sidebar;
