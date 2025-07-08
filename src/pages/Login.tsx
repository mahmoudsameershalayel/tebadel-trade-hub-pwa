
import React from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
      
        {/* Login Form Card */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
