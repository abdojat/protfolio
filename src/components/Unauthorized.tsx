import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, ArrowDown } from './icons';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this page
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This page requires super admin privileges. Please contact your system administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2"
            >
              <ArrowDown className="w-4 h-4" />
              <span>Go to Home</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Try Different Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
