
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden">
        <div className="lg:w-1/2 bg-primary p-12 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Join HyperFlow</h1>
          <p className="mb-6">Create an account to start managing your workflow with AI-powered insights and automation.</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span>Intelligent workflow optimization</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span>Real-time performance tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span>Unified communication across platforms</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span>AI-powered insights and suggestions</span>
            </li>
          </ul>
          <div className="mt-auto">
            <p className="text-sm opacity-80">Powered by HyperFlow AI</p>
          </div>
        </div>
        
        <div className="lg:w-1/2 p-12 bg-card flex items-center justify-center">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
