
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error("Failed to send reset instructions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-12 w-12 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h1 className="mt-6 text-3xl font-display font-bold tracking-tight text-foreground">
            <span className="text-gradient">Reset Password</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive password reset instructions
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto glass-card shadow-subtle animate-blur-in">
          {!isSubmitted ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Forgot your password?</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you instructions to reset your password.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full button-shine"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-rotate-loader mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>
                  We've sent password reset instructions to {email}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center pt-4 pb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-4">
                  Please check your email and follow the instructions to reset your password.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try a different email
                </Button>
              </CardContent>
            </>
          )}
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-accent hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordRecovery;
