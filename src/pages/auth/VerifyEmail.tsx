
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Check, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      
      if (error) {
        throw error;
      }
      
      setVerified(true);
      toast.success('Email verified successfully');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Email verification error:', error);
      setError(error.message || 'Failed to verify email');
      toast.error(error.message || 'Failed to verify email');
    } finally {
      setVerifying(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && !token) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            {!token ? "Check your email for a verification link" : "Verifying your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {token ? (
            verifying ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-center text-muted-foreground">Verifying your email address...</p>
              </div>
            ) : verified ? (
              <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">Email Verified!</h3>
                <p className="text-green-700">
                  Your email has been successfully verified. You'll be redirected to the dashboard shortly.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Verification Failed</h3>
                <p className="text-red-700">
                  {error || 'There was an error verifying your email. The link may have expired or is invalid.'}
                </p>
              </div>
            )
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-6 text-center">
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-800 mb-2">Check Your Email</h3>
              <p className="text-blue-700">
                We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {(!token || error) && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          )}
          {verified && (
            <Button 
              className="w-full" 
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
