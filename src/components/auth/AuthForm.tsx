
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export interface AuthFormProps {
  type: 'login' | 'signup' | 'reset-password';
  onSubmit: (email: string, password: string, name?: string) => Promise<void>;
  isLoading: boolean;
  title: string;
  description: string;
  submitText: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkUrl?: string;
  additionalLinks?: React.ReactNode[];
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  title,
  description,
  submitText,
  footerText,
  footerLinkText,
  footerLinkUrl,
  additionalLinks,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'signup') {
      await onSubmit(email, password, name);
    } else {
      await onSubmit(email, password);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {type !== 'reset-password' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              submitText
            )}
          </Button>
        </form>
        {additionalLinks && additionalLinks.length > 0 && (
          <div className="mt-4 flex flex-col space-y-2">
            {additionalLinks.map((link, index) => (
              <div key={index}>{link}</div>
            ))}
          </div>
        )}
      </CardContent>
      {footerText && footerLinkText && footerLinkUrl && (
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {footerText}{' '}
            <Link to={footerLinkUrl} className="text-primary hover:underline">
              {footerLinkText}
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default AuthForm;
