
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Users, CheckCircle, Clock, Filter, Plus, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Sample data for charts
const recruitmentFunnelData = [
  { name: "Applied", value: 210 },
  { name: "Screening", value: 120 },
  { name: "Interview", value: 75 },
  { name: "Technical", value: 45 },
  { name: "Offer", value: 30 },
  { name: "Hired", value: 18 },
];

const HrRecruitment = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Dashboard</h1>
          <p className="text-muted-foreground">
            Track recruitment progress and manage job openings
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 urgent hires needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">23 in final stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">8 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 starting next week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Recruitment Funnel"
          icon={<Users className="h-5 w-5" />}
          className="md:col-span-1"
        >
          <AnalyticsChart 
            data={recruitmentFunnelData} 
            height={300}
            defaultType="bar"
          />
        </DashboardCard>

        <DashboardCard
          title="Priority Openings"
          icon={<Briefcase className="h-5 w-5" />}
          className="md:col-span-2"
        >
          <div className="space-y-4">
            {[
              { 
                title: "Senior Frontend Developer", 
                department: "Engineering", 
                applicants: 28, 
                status: "active", 
                priority: "high", 
                age: "32 days"
              },
              { 
                title: "Product Manager", 
                department: "Product", 
                applicants: 43, 
                status: "active", 
                priority: "high", 
                age: "12 days"
              },
              { 
                title: "UX Designer", 
                department: "Design", 
                applicants: 34, 
                status: "active", 
                priority: "medium", 
                age: "18 days"
              },
              { 
                title: "Marketing Specialist", 
                department: "Marketing", 
                applicants: 22, 
                status: "active", 
                priority: "high", 
                age: "8 days"
              }
            ].map((position, index) => (
              <div key={index} className="border border-border p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{position.title}</h3>
                      {position.priority === "high" && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {position.department} • {position.age} old
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{position.applicants} Applicants</span>
                    <span className="text-muted-foreground">
                      {Math.round(position.applicants * 0.2)} in interview stage
                    </span>
                  </div>
                  <Progress value={60} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Top Candidates"
        icon={<Star className="h-5 w-5" />}
      >
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Candidate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Applied</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { 
                  name: "Jennifer Lee", 
                  image: null, 
                  position: "Senior Frontend Developer", 
                  stage: "Final Interview", 
                  rating: 4.8,
                  applied: "2 weeks ago"
                },
                { 
                  name: "Marcus Johnson", 
                  image: null, 
                  position: "Product Manager", 
                  stage: "Technical Assessment", 
                  rating: 4.6,
                  applied: "1 week ago"
                },
                { 
                  name: "Sarah Williams", 
                  image: null, 
                  position: "UX Designer", 
                  stage: "Second Interview", 
                  rating: 4.5,
                  applied: "3 weeks ago"
                },
                { 
                  name: "Michael Chen", 
                  image: null, 
                  position: "Senior Frontend Developer", 
                  stage: "Technical Assessment", 
                  rating: 4.7,
                  applied: "2 weeks ago"
                },
                { 
                  name: "Emily Davis", 
                  image: null, 
                  position: "Marketing Specialist", 
                  stage: "First Interview", 
                  rating: 4.9,
                  applied: "5 days ago"
                }
              ].map((candidate, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {candidate.position}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {candidate.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-sm">{candidate.rating}</div>
                      <div className="ml-1 flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(candidate.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                    {candidate.applied}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">View Profile</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default HrRecruitment;
