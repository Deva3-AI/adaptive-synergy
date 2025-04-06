
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Helmet>
        <title>HyperFlow - AI-Powered Workflow Platform</title>
      </Helmet>
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">AI-Powered Workflow Platform</h1>
        <p className="text-xl text-muted-foreground">
          Streamline your business operations with our advanced AI workflow and insights platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
