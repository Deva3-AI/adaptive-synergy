
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SlackIcon, MessageSquare, Trello, FileSpreadsheet, Mail, Share2 } from "lucide-react";
import { toast } from 'sonner';
import { 
  platformService, 
  PlatformType, 
  PlatformConfig 
} from '@/utils/platformIntegrations';

interface PlatformIconProps {
  platform: PlatformType;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform }) => {
  switch (platform) {
    case 'slack':
      return <SlackIcon className="h-5 w-5 text-[#4A154B]" />;
    case 'discord':
      return <MessageSquare className="h-5 w-5 text-[#7289DA]" />;
    case 'trello':
      return <Trello className="h-5 w-5 text-[#0079BF]" />;
    case 'asana':
      return <FileSpreadsheet className="h-5 w-5 text-[#FC636B]" />;
    case 'gmail':
    case 'zoho':
      return <Mail className="h-5 w-5 text-[#D14836]" />;
    case 'whatsapp':
      return <MessageSquare className="h-5 w-5 text-[#25D366]" />;
    default:
      return <Share2 className="h-5 w-5" />;
  }
};

const PlatformIntegrations: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [workspace, setWorkspace] = useState('');
  
  // Default platform configurations
  const defaultPlatforms: PlatformConfig[] = [
    { type: 'slack', name: 'Slack', isConnected: false },
    { type: 'discord', name: 'Discord', isConnected: false },
    { type: 'trello', name: 'Trello', isConnected: false },
    { type: 'asana', name: 'Asana', isConnected: false },
    { type: 'gmail', name: 'Gmail', isConnected: false },
    { type: 'zoho', name: 'Zoho Mail', isConnected: false },
    { type: 'whatsapp', name: 'WhatsApp', isConnected: false }
  ];
  
  // Load platforms on mount
  useEffect(() => {
    const savedPlatforms = platformService.getPlatforms();
    
    if (savedPlatforms.length > 0) {
      setPlatforms(savedPlatforms);
    } else {
      setPlatforms(defaultPlatforms);
    }
  }, []);
  
  const handleSelectPlatform = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    setApiKey('');
    setApiSecret('');
    setWorkspace('');
  };
  
  const handleConnect = async () => {
    if (!selectedPlatform) return;
    
    const config = platforms.find(p => p.type === selectedPlatform);
    if (!config) return;
    
    const success = await platformService.configurePlatform({
      ...config,
      credentials: {
        apiKey,
        apiSecret,
        workspace
      }
    });
    
    if (success) {
      const updatedPlatforms = platformService.getPlatforms();
      setPlatforms(updatedPlatforms);
      setSelectedPlatform(null);
      setApiKey('');
      setApiSecret('');
      setWorkspace('');
    }
  };
  
  const handleDisconnect = async (platform: PlatformType) => {
    const success = platformService.disconnectPlatform(platform);
    
    if (success) {
      const updatedPlatforms = platformService.getPlatforms();
      setPlatforms(updatedPlatforms);
    }
  };
  
  const renderConnectForm = () => {
    if (!selectedPlatform) return null;
    
    const platform = platforms.find(p => p.type === selectedPlatform);
    if (!platform) return null;
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-2">
          <PlatformIcon platform={platform.type} />
          <h3 className="text-lg font-medium">{platform.name}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter API Secret"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="workspace">Workspace ID (optional)</Label>
            <Input
              id="workspace"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="Enter Workspace ID if applicable"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSelectedPlatform(null)}>
              Cancel
            </Button>
            <Button onClick={handleConnect}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Integrations</CardTitle>
        <CardDescription>
          Connect to external platforms to analyze client messages and requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="configured">
          <TabsList className="mb-4">
            <TabsTrigger value="configured">Configured</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configured" className="space-y-4">
            {platforms.filter(p => p.isConnected).length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No platforms connected yet. Connect a platform to start analyzing messages.
              </div>
            ) : (
              <div className="space-y-2">
                {platforms
                  .filter(platform => platform.isConnected)
                  .map(platform => (
                    <div
                      key={platform.type}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div className="flex items-center space-x-3">
                        <PlatformIcon platform={platform.type} />
                        <div>
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last synced: {platform.lastSynced 
                              ? new Date(platform.lastSynced).toLocaleString() 
                              : 'Never'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Connected
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDisconnect(platform.type)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            {selectedPlatform ? (
              renderConnectForm()
            ) : (
              <div className="space-y-2">
                {platforms
                  .filter(platform => !platform.isConnected)
                  .map(platform => (
                    <div
                      key={platform.type}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div className="flex items-center space-x-3">
                        <PlatformIcon platform={platform.type} />
                        <div className="font-medium">{platform.name}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectPlatform(platform.type)}
                      >
                        Connect
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlatformIntegrations;
