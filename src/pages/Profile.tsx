
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Building, Calendar } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="col-span-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>This is how others will recognize you</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="" alt="Profile image" />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Upload</Button>
                <Button variant="outline" size="sm" className="text-destructive">Remove</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-6 md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="fullName" placeholder="John Doe" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="displayName" placeholder="johndoe" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" placeholder="john@example.com" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" placeholder="+1 (555) 000-0000" className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us a bit about yourself" className="min-h-[100px]" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
              <CardDescription>Update your work details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="company" placeholder="Acme Inc." className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="jobTitle" placeholder="Product Manager" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workAddress">Work Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="workAddress" placeholder="123 Business St." className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="startDate" placeholder="2022-01-01" className="pl-10" />
                  </div>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
