
import React from "react";
import { Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-12 w-12 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h1 className="mt-6 text-3xl font-display font-bold tracking-tight text-foreground">
            <span className="text-gradient">Hive</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create your account on the AI-powered workflow platform
          </p>
        </div>
        
        <div className="mt-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <AuthForm type="signup" />
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "300ms" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:text-accent/80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
