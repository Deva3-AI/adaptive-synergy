
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';

interface AuthFormProps {
  mode: 'login' | 'signup' | 'recovery';
}

const formSchema = z.object({
  name: mode => mode === 'signup' ? z.string().min(3, 'Name must be at least 3 characters') : z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, signup } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await login(data.email, data.password);
        if (result.success) {
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error(result.error || 'Login failed');
        }
      } else if (mode === 'signup') {
        const result = await signup({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        if (result.success) {
          toast.success('Account created successfully!');
          navigate('/login');
        } else {
          toast.error(result.error || 'Signup failed');
        }
      } else if (mode === 'recovery') {
        toast.success('Password recovery email sent!');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'login' ? 'Login' : mode === 'signup' ? 'Create an Account' : 'Password Recovery'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Enter your credentials to access your account.' 
            : mode === 'signup' 
              ? 'Fill in the details to create your account.' 
              : 'Enter your email to receive a password reset link.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
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
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {mode !== 'recovery' && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
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
                      <Input 
                        type="password" 
                        placeholder="Confirm password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? 'Processing...' 
                : mode === 'login' 
                  ? 'Login' 
                  : mode === 'signup' 
                    ? 'Create Account' 
                    : 'Reset Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {mode === 'login' && (
          <>
            <div className="text-sm text-center">
              <Link to="/password-recovery" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </>
        )}
        
        {mode === 'signup' && (
          <div className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        )}
        
        {mode === 'recovery' && (
          <div className="text-sm text-center">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
