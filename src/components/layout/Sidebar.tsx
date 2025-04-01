import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Settings, 
  Calendar, 
  CheckSquare, 
  CreditCard, 
  User, 
  PieChart, 
  ClipboardList, 
  Menu, 
  LogOut,
  ChevronLeft,
  Building,
  GraduationCap,
  BellRing,
  Bell,
  BarChart3,
  Search,
  ChevronRight,
  TrendingUp,
  Megaphone,
  Mail
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SidebarProps = {
  expanded: boolean;
  setExpanded?: (expanded: boolean) => void;
};

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  submenu?: Omit<NavItem, "submenu">[];
};

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Announcements",
    href: "/announcements",
    icon: Bell,
  },
  {
    title: "Employee",
    href: "/employee/dashboard",
    icon: User,
    submenu: [
      {
        title: "Dashboard",
        href: "/employee/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Tasks",
        href: "/employee/tasks",
        icon: CheckSquare,
      },
      {
        title: "Profile",
        href: "/employee/profile",
        icon: User,
      },
      {
        title: "Leave Requests",
        href: "/employee/leave-requests",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Briefcase,
    submenu: [
      {
        title: "Clients List",
        href: "/clients",
        icon: Briefcase,
      },
      {
        title: "Dashboard",
        href: "/client/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Tasks",
        href: "/client/tasks",
        icon: CheckSquare,
      },
      {
        title: "Reports",
        href: "/client/reports",
        icon: FileText,
      },
      {
        title: "Brands",
        href: "/client/brands",
        icon: Building,
      },
    ],
  },
  {
    title: "Finance",
    href: "/finance/dashboard",
    icon: CreditCard,
    roles: ["finance", "admin"],
    submenu: [
      {
        title: "Dashboard",
        href: "/finance/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Overview",
        href: "/finance/overview",
        icon: PieChart,
      },
      {
        title: "Sales",
        href: "/finance/sales",
        icon: BarChart3,
      },
      {
        title: "Performance",
        href: "/finance/performance",
        icon: TrendingUp,
      },
      {
        title: "Reports",
        href: "/finance/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "HR",
    href: "/hr/dashboard",
    icon: Users,
    roles: ["hr", "admin"],
    submenu: [
      {
        title: "Dashboard",
        href: "/hr/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Attendance",
        href: "/hr/attendance",
        icon: Calendar,
      },
      {
        title: "Leave Management",
        href: "/hr/leave-management",
        icon: Calendar,
      },
      {
        title: "Recruitment",
        href: "/hr/recruitment",
        icon: GraduationCap,
      },
      {
        title: "Payroll",
        href: "/hr/payroll",
        icon: CreditCard,
      },
      {
        title: "Performance",
        href: "/hr/performance",
        icon: BarChart3,
      },
      {
        title: "Announcements",
        href: "/hr/announcements",
        icon: BellRing,
      },
      {
        title: "Reports",
        href: "/hr/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "Marketing",
    href: "/marketing/dashboard",
    icon: TrendingUp,
    roles: ["marketing", "admin"],
    submenu: [
      {
        title: "Dashboard",
        href: "/marketing/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Campaigns",
        href: "/marketing/campaigns",
        icon: Megaphone,
      },
      {
        title: "Analytics",
        href: "/marketing/analytics",
        icon: BarChart3,
      },
      {
        title: "Leads",
        href: "/marketing/leads",
        icon: Users,
      },
      {
        title: "Meetings",
        href: "/marketing/meetings",
        icon: Calendar,
      },
      {
        title: "Email Templates",
        href: "/marketing/email-templates",
        icon: Mail,
      },
      {
        title: "Plans",
        href: "/marketing/plans",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: <Calendar className="h-5 w-5" />,
    active: pathname === "/calendar",
  },
];

const Sidebar = ({ expanded, setExpanded }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isMenuOpen = (title: string) => openMenus.includes(title);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (setExpanded) {
      setExpanded(!expanded);
    }
  };

  React.useEffect(() => {
    if (isMobile && setExpanded) {
      setExpanded(false);
    }
  }, [isMobile, setExpanded]);

  return (
    <>
      <aside
        className={cn(
          "h-screen bg-background border-r border-border transition-all duration-300 overflow-hidden flex flex-col",
          expanded ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {expanded ? (
            <h2 className="text-lg font-semibold">AI Workflow</h2>
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              AI
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>

        <div className="flex items-center px-4 py-2">
          {expanded ? (
            <div className="w-full relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-input bg-transparent px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="mx-auto">
              <Search size={18} />
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <li key={item.title}>
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={cn(
                          "flex items-center w-full rounded-md p-2 text-sm group transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {expanded && (
                          <span className="flex-1 text-left">{item.title}</span>
                        )}
                        {expanded && (
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isMenuOpen(item.title) && "rotate-90"
                            )}
                          />
                        )}
                      </button>
                      {expanded && isMenuOpen(item.title) && (
                        <ul className="pl-6 space-y-1 mt-1">
                          {item.submenu?.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <li key={subItem.title}>
                                <Link
                                  to={subItem.href}
                                  className={cn(
                                    "flex items-center rounded-md p-2 text-sm transition-colors",
                                    isSubActive
                                      ? "bg-muted font-medium text-foreground"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
                                >
                                  <subItem.icon className="h-4 w-4 mr-2" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center rounded-md p-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {expanded && <span>{item.title}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground",
              !expanded && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {expanded && <span>Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
