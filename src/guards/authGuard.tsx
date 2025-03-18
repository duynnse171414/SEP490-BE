import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
            <p className="mb-4">You need to be logged in to view this page.</p>
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
