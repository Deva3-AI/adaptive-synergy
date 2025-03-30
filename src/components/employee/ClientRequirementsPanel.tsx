
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Pencil, ThumbsDown, ThumbsUp, AlertTriangle, Palette, FileText } from 'lucide-react';
import { clientService } from '@/services/api';
import { ClientPreferences } from '@/services/api/clientService';

interface ClientRequirementsPanelProps {
  clientId: number;
}

const ClientRequirementsPanel: React.FC<ClientRequirementsPanelProps> = ({ clientId }) => {
  const [preferences, setPreferences] = useState<ClientPreferences | null>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientDetails = await clientService.getClientDetails(clientId);
        const clientPreferences = await clientService.getClientPreferences(clientId);
        
        setClient(clientDetails);
        setPreferences(clientPreferences);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-muted rounded w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences || !client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements</CardTitle>
          <CardDescription>No client preferences found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The client profile is still being built. Check back later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Profile & Requirements</CardTitle>
        <CardDescription>
          History and preferences for {client.client_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[380px]">
          <div className="p-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Project History Summary
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {client.description || 'No project history available.'}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                  Design Preferences
                </h3>
              </div>
              <div className="space-y-2">
                {preferences.design_preferences?.style && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Style:</span>
                    <Badge variant="outline">{preferences.design_preferences.style}</Badge>
                  </div>
                )}
                
                {preferences.design_preferences?.colors && preferences.design_preferences.colors.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Color Palette:</span>
                    <div className="flex space-x-1">
                      {preferences.design_preferences.colors.map((color, index) => (
                        <div 
                          key={index} 
                          className="h-5 w-5 rounded-full border" 
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {preferences.design_preferences?.fonts && preferences.design_preferences.fonts.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fonts:</span>
                    <div>
                      {preferences.design_preferences.fonts.map((font, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {font}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Time Estimations & Delivery Preferences
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Communication Frequency:</span>
                  <Badge variant="outline">{preferences.communication_frequency || 'Not specified'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Preferred Contact Method:</span>
                  <Badge variant="outline">{preferences.preferred_contact_method || 'Not specified'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Feedback Frequency:</span>
                  <Badge variant="outline">{preferences.feedback_frequency || 'Not specified'}</Badge>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center mb-2">
                <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium">Client Do's</h3>
              </div>
              <ul className="space-y-1 ml-6 list-disc text-sm text-muted-foreground">
                {preferences.dos && preferences.dos.length > 0 ? (
                  preferences.dos.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No specific requirements noted</li>
                )}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center mb-2">
                <ThumbsDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium">Client Don'ts</h3>
              </div>
              <ul className="space-y-1 ml-6 list-disc text-sm text-muted-foreground">
                {preferences.donts && preferences.donts.length > 0 ? (
                  preferences.donts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No specific restrictions noted</li>
                )}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium">Industry Requirements</h3>
              </div>
              <div className="space-y-2 text-sm">
                {preferences.industry_specific_requirements?.compliance && (
                  <div>
                    <span className="text-sm font-medium">Compliance:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.industry_specific_requirements.compliance.map((item, index) => (
                        <Badge key={index} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {preferences.industry_specific_requirements?.accessibility && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Accessibility:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{preferences.industry_specific_requirements.accessibility}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ClientRequirementsPanel;
