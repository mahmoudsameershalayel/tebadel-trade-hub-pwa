
import React from 'react';
import RegisterForm from '@/components/Auth/RegisterForm';
import { Card, CardContent } from '@/components/ui/card';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header with Exchange Theme */}
        <div className="text-center">
          <div className="relative max-w-sm mx-auto mb-6">
            <img
              src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=200&fit=crop"
              alt="Join the exchange community"
              className="w-full h-32 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl"></div>
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <h2 className="text-lg font-bold">Join Our Community</h2>
            </div>
          </div>
        </div>

        {/* Register Form Card */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
