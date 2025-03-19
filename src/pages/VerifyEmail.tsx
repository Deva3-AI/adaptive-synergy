
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    setIsVerifying(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (token === "invalid") {
        throw new Error("Invalid or expired verification token");
      }
      
      setIsSuccess(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      toast.error("Email verification failed");
    } finally {
      setIsVerifying(false);
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
            <span className="text-gradient">Email Verification</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Verify your email to access your account
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto glass-card shadow-subtle animate-blur-in">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isVerifying ? "Verifying..." : isSuccess ? "Verified!" : "Verify Your Email"}
            </CardTitle>
            <CardDescription>
              {token 
                ? `We're verifying the email address: ${email || "your email"}`
                : "Check your email for a verification link"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center py-6">
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Verifying your email address...</p>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Verified Successfully</h3>
                <p className="text-muted-foreground mb-6">
                  Your email has been verified. You can now log in to your account.
                </p>
                <Button asChild className="w-full button-shine">
                  <Link to="/login">Go to Login</Link>
                </Button>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button variant="outline" className="w-full" onClick={verifyEmail}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                <p className="text-muted-foreground mb-6">
                  We've sent a verification link to your email address. 
                  Please check your inbox and click the link to verify your account.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>
                Back to{" "}
                <Link
                  to="/login"
                  className="text-accent hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
