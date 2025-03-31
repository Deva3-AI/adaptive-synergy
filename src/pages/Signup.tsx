
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/auth/AuthForm';
import { toast } from 'sonner';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (email: string, password: string, name = '') => {
    try {
      setIsLoading(true);
      await signup(email, password, name);
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="signup"
      onSubmit={handleSignup}
      isLoading={isLoading}
      title="Create an Account"
      description="Enter your details to create a new account"
      submitText="Sign Up"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkUrl="/login"
    />
  );
};

export default Signup;
