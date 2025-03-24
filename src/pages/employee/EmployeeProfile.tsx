
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Briefcase, Award, Edit, History, ClipboardList } from 'lucide-react';

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  
  // This would normally come from an API call using the employeeId
  const employee = {
    id: employeeId,
    name: "Jane Smith",
    role: "UI/UX Designer",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "June 15, 2022",
    department: "Design",
    imageUrl: "",
    bio: "Jane is an experienced designer with expertise in user research, wireframing, prototyping, and visual design. She has worked on multiple high-profile projects and brings a user-centered approach to all her work."
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">Employee Profile</h1>
        <Button variant="outline" className="gap-1">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={employee.imageUrl} alt={employee.name} />
                <AvatarFallback className="text-xl">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <Badge className="mt-1 mb-2">{employee.role}</Badge>
              <p className="text-sm text-muted-foreground mb-4">{employee.bio}</p>
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {employee.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Department: {employee.department}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">UI Design</Badge>
                    <Badge variant="secondary">UX Research</Badge>
                    <Badge variant="secondary">Wireframing</Badge>
                    <Badge variant="secondary">Prototyping</Badge>
                    <Badge variant="secondary">Figma</Badge>
                    <Badge variant="secondary">Adobe XD</Badge>
                    <Badge variant="secondary">Sketch</Badge>
                    <Badge variant="secondary">User Testing</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Current Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Website Redesign</h3>
                          <p className="text-sm text-muted-foreground">Client: Koala Digital</p>
                        </div>
                        <Badge>In Progress</Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Complete redesign of client's website</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Mobile App UI</h3>
                          <p className="text-sm text-muted-foreground">Client: Muse Digital</p>
                        </div>
                        <Badge variant="outline">Planning</Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Design UI for new mobile application</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">View this employee's task history and current assignments</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">Performance data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">Attendance history and work hours will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
