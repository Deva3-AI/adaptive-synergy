
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/auth/AuthForm';
import { toast } from 'sonner';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await login(email, password);
      
      // Check if login was successful
      if (result && result.success) {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      } else {
        // Handle error message from response
        const errorMessage = result?.error?.message || 'Invalid credentials';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleLogin}
      isLoading={isLoading}
      title="Sign In"
      description="Enter your details to sign in to your account"
      submitText="Sign In"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkUrl="/signup"
      additionalLinks={[
        <Link to="/reset-password" className="text-sm text-primary hover:underline" key="forgot-password">
          Forgot your password?
        </Link>
      ]}
    />
  );
};

export default Login;
