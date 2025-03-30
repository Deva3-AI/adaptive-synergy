
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Card, CardContent } from '@/components/ui/card';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden">
        <div className="lg:w-1/2 bg-primary p-12 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="mb-6">Log in to access your dashboard, manage your tasks, and collaborate with your team.</p>
          <div className="mt-auto">
            <p className="text-sm opacity-80">Powered by HyperFlow AI</p>
          </div>
        </div>
        
        <div className="lg:w-1/2 p-12 bg-card flex items-center justify-center">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
