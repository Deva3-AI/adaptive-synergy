
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface AuthFormProps {
  mode?: 'login' | 'signup' | 'recover';
}

const AuthForm = ({ mode = 'login' }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup, requestPasswordReset } = useAuth();

  // Dynamic schema based on mode
  const getSchema = (mode: 'login' | 'signup' | 'recover') => {
    const emailSchema = z.string().email('Please enter a valid email');
    const passwordSchema = mode === 'recover' 
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters');
    
    const baseSchema = {
      email: emailSchema,
      password: passwordSchema,
    };
    
    if (mode === 'signup') {
      return z.object({
        ...baseSchema,
        name: z.string().min(2, 'Name must be at least 2 characters'),
        confirmPassword: z.string(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
    
    return z.object(baseSchema);
  };

  const schema = getSchema(mode);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' ? { name: '', confirmPassword: '' } : {}),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await signup(values.email, values.password, values.name as string);
        toast.success('Account created! Please verify your email to continue.');
        navigate('/verify-email', { state: { email: values.email } });
      } else if (mode === 'recover') {
        await requestPasswordReset(values.email);
        toast.success('If your email exists in our system, you will receive a reset link shortly.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {mode === 'login' ? 'Sign In' : 
           mode === 'signup' ? 'Create Account' : 
           'Reset Password'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' ? 'Enter your credentials to access your account' : 
           mode === 'signup' ? 'Fill in your details to get started' : 
           'Enter your email to receive a reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {mode !== 'recover' && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 
               mode === 'login' ? 'Sign In' : 
               mode === 'signup' ? 'Create Account' : 
               'Send Reset Link'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2">
        {mode === 'login' && (
          <>
            <Button variant="link" onClick={() => navigate('/password-recovery')}>
              Forgot your password?
            </Button>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </div>
          </>
        )}
        
        {mode === 'signup' && (
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </div>
        )}
        
        {mode === 'recover' && (
          <div className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
