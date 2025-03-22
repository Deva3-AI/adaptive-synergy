
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export interface HeaderProps {
  onMenuClick: () => void;
  appName: string;
}

const Header = ({ onMenuClick, appName }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={24} />
          </Button>
          <div className="text-xl font-bold">{appName}</div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user?.name || 'User'}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
