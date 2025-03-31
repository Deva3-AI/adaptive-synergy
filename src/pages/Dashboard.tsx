import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Bell,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import TasksSummary from '@/components/dashboard/TasksSummary';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import FinancialSummary from '@/components/dashboard/FinancialSummary';
import ClientsOverview from '@/components/dashboard/ClientsOverview';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import UpcomingCalendar from '@/components/dashboard/UpcomingCalendar';
import TeamPerformance from '@/components/dashboard/TeamPerformance';
import MarketingMetrics from '@/components/dashboard/MarketingMetrics';
import RecruitmentMetrics from '@/components/dashboard/RecruitmentMetrics';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/api/userService';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        
        const data = await userService.getDashboardData(Number(userId));
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const renderDashboardCards = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 new since last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              +13% from last week
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}</h1>
      <div className="space-y-6">
        {renderDashboardCards()}
      </div>
    </div>
  );
};

export default Dashboard;
