
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PasswordRecovery = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setSubmitted(true);
      toast.success('Password recovery email sent');
    } catch (error: any) {
      console.error('Password recovery error:', error);
      toast.error(error.message || 'Failed to send recovery email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Password Recovery</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending Email...' : 'Send Recovery Email'}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700">
              <p>
                If an account exists with this email, you'll receive a password recovery link shortly.
                Please check your inbox and follow the instructions.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={() => window.location.href = '/login'}
            >
              Back to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PasswordRecovery;
