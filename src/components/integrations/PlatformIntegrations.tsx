import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Link2, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle, 
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PlatformConfig, PlatformType } from '@/types';
import { toast } from 'sonner';

interface PlatformIntegrationsProps {
  // Define any props here
}

const platformTypes: PlatformType[] = [
  {
    id: 'project',
    name: 'Project Management',
    icon: 'project'
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: 'communication'
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'email'
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: 'crm'
  }
];

const compareToType = (platform: string, type: PlatformType) => {
  return platform === type.id;
};

const PlatformIntegrations: React.FC<PlatformIntegrationsProps> = ({ /* props */ }) => {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching platform data from an API
    const fetchPlatforms = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPlatforms(platformData);
      } catch (error) {
        console.error("Failed to fetch platforms", error);
        toast.error("Failed to load platforms.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handleConnect = async (platform: PlatformConfig) => {
    toast.success(`${platform.name} connected!`);
  };

  const handleDisconnect = async (platform: PlatformConfig) => {
    toast.warning(`${platform.name} disconnected.`);
  };

  const handleSync = async (platform: PlatformConfig) => {
    toast.info(`Syncing ${platform.name}...`);
  };

  // Fix platform data format to match the PlatformConfig interface
const platformData: PlatformConfig[] = [
  {
    platform: 'slack',
    name: 'Slack',
    connected: true,
    lastSync: '2023-07-01T10:30:00Z',
    icon: 'slack',
    type: 'communication'
  },
  {
    platform: 'trello',
    name: 'Trello',
    connected: true,
    lastSync: '2023-07-02T14:45:00Z',
    icon: 'trello',
    type: 'project'
  },
  {
    platform: 'asana',
    name: 'Asana',
    connected: false,
    icon: 'asana',
    type: 'project'
  },
  {
    platform: 'discord',
    name: 'Discord',
    connected: true,
    lastSync: '2023-07-03T09:15:00Z',
    icon: 'discord',
    type: 'communication'
  },
  {
    platform: 'gmail',
    name: 'Gmail',
    connected: false,
    icon: 'gmail',
    type: 'email'
  },
  {
    platform: 'zoho',
    name: 'Zoho',
    connected: false,
    icon: 'zoho',
    type: 'crm'
  },
  {
    platform: 'whatsapp',
    name: 'WhatsApp',
    connected: false,
    icon: 'whatsapp',
    type: 'communication'
  }
];

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Platform Integrations</CardTitle>
          <CardDescription>
            Connect your favorite platforms to streamline your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="project" className="w-full">
            <TabsList>
              {platformTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id}>
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {platformTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                {loading ? (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardContent>
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-4 w-3/4 mt-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {platforms
                      .filter((platform) => platform.type && compareToType(platform.type, type))
                      .map((platform) => (
                        <Card key={platform.platform}>
                          <CardContent className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{platform.name}</span>
                                {platform.connected ? (
                                  <Badge variant="secondary">
                                    <Check className="h-3 w-3 mr-1" />
                                    Connected
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Not Connected
                                  </Badge>
                                )}
                              </div>
                              {platform.connected ? (
                                <Button variant="ghost" size="icon" onClick={() => handleDisconnect(platform)}>
                                  <Link2 className="h-4 w-4" />
                                  <span className="sr-only">Disconnect</span>
                                </Button>
                              ) : (
                                <Button size="sm" onClick={() => handleConnect(platform)}>
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Connect
                                </Button>
                              )}
                            </div>
                            {platform.connected && (
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Last Synced: {platform.lastSync ? new Date(platform.lastSync).toLocaleString() : 'Never'}</span>
                                <Button variant="ghost" size="icon" onClick={() => handleSync(platform)}>
                                  <RefreshCw className="h-3 w-3" />
                                  <span className="sr-only">Sync Now</span>
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformIntegrations;
