import React, { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, InsertUser, UserType } from "@shared/schema";
import { BugIcon } from "lucide-react";
import AuthForm from "@/components/auth/auth-form";

interface RegisterProps {
  onLogin: (user: Omit<User, "password">) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<UserType>(UserType.HACKER);
  const { toast } = useToast();

  const handleSubmit = async (userData: Omit<InsertUser, "userType">) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, userType }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      
      const user = await response.json();
      onLogin(user);
      
      toast({
        title: "Account created successfully",
        description: `Welcome to RedXteam, ${user.fullName}!`,
      });
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
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
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join RedXteam to participate in bug bounty programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hacker" className="mb-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="hacker" onClick={() => setUserType(UserType.HACKER)}>Hacker</TabsTrigger>
              <TabsTrigger value="organization" onClick={() => setUserType(UserType.ORGANIZATION)}>Organization</TabsTrigger>
            </TabsList>
            <TabsContent value="hacker">
              <p className="text-sm text-neutral-600 mb-4">
                Join as a security researcher to hunt bugs and earn rewards.
              </p>
            </TabsContent>
            <TabsContent value="organization">
              <p className="text-sm text-neutral-600 mb-4">
                Join as an organization to create bug bounty programs for your applications.
              </p>
            </TabsContent>
          </Tabs>
          
          <AuthForm
            type="register"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            userType={userType}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-neutral-600">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-primary hover:text-primary-dark font-medium">
                Log in
              </a>
            </Link>
          </div>
          <div className="text-xs text-center text-neutral-500">
            By signing up, you agree to our{" "}
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
