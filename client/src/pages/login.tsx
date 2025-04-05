import React, { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { BugIcon } from "lucide-react";
import AuthForm from "@/components/auth/auth-form";

interface LoginProps {
  onLogin: (user: Omit<User, "password">) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid username or password");
      }
      
      const userData = await response.json();
      onLogin(userData);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userData.fullName}!`,
      });
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
              <BugIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Log in to your RedXteam account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            type="login"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-neutral-600">
            Don't have an account?{" "}
            <Link href="/register">
              <a className="text-primary hover:text-primary-dark font-medium">
                Sign up
              </a>
            </Link>
          </div>
          <div className="text-xs text-center text-neutral-500">
            By logging in, you agree to our{" "}
            <a href="#" className="underline hover:text-neutral-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-neutral-800">
              Privacy Policy
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
