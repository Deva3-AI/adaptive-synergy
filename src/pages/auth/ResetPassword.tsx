
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';

// Form schemas
const requestResetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestResetValues = z.infer<typeof requestResetSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const { resetPassword, setNewPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for requesting password reset
  const requestResetForm = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form for setting new password (when token is provided)
  const resetPasswordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onRequestReset = async (values: RequestResetValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(values.email);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      console.error('Reset request error:', error);
      toast.error('Failed to request password reset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetPassword = async (values: ResetPasswordValues) => {
    if (!token) return;
    
    setIsSubmitting(true);
    try {
      await setNewPassword(token, values.password);
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {token ? 'Reset Your Password' : 'Forgot Password'}
        </CardTitle>
        <CardDescription>
          {token 
            ? 'Enter your new password below'
            : 'Enter your email address and we\'ll send you a link to reset your password'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" className="pl-9" placeholder="********" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" className="pl-9" placeholder="********" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...requestResetForm}>
            <form onSubmit={requestResetForm.handleSubmit(onRequestReset)} className="space-y-4">
              <FormField
                control={requestResetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="m@example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResetPassword;
