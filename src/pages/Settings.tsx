
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Bell, Lock, Shield, Smartphone, CreditCard, LogOut } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" value="john@example.com" readOnly className="pl-10" />
                    </div>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="mr-1">Primary</Badge>
                    This is your primary email address
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-reminders">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded about upcoming deadlines</p>
                  </div>
                  <Switch id="task-reminders" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="current-password" type="password" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="new-password" type="password" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="confirm-password" type="password" className="pl-10" />
                </div>
              </div>
              <Button>Change Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an additional verification step
                  </p>
                </div>
                <Switch id="2fa" />
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Authentication Methods</h3>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">Use an authenticator app to get verification codes</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>Set Up</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">Receive verification codes via email</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>Set Up</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing details and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Current Plan</h3>
                <div className="flex items-center space-x-3 bg-muted p-4 rounded-md">
                  <Shield className="h-6 w-6 text-accent" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Professional Plan</p>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">$49/month, billed monthly</p>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-3">
                  <Button variant="outline" size="sm">View Plans</Button>
                  <Button variant="destructive" size="sm">Cancel Plan</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Payment Method</h3>
                <div className="flex items-center space-x-3 bg-muted p-4 rounded-md mb-3">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Visa ending in 4242</p>
                      <Badge variant="secondary">Default</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Expires 12/2023</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-destructive border-dashed">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions here can permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Log out all sessions</h3>
                  <p className="text-sm text-muted-foreground">Log out from all devices</p>
                </div>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" /> Log out all
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-destructive">Delete account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
