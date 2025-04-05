import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Base schema for common fields
const baseSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username cannot exceed 50 characters' })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password cannot exceed 100 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  bio: z.string().max(500, { message: 'Bio cannot exceed 500 characters' }).optional(),
});

// Organization-specific schema
const organizationSchema = baseSchema.extend({
  role: z.literal('organization'),
  companyName: z.string()
    .min(2, { message: 'Company name must be at least 2 characters' })
    .max(100, { message: 'Company name cannot exceed 100 characters' }),
  companyUrl: z.string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  industry: z.string()
    .min(2, { message: 'Industry must be at least 2 characters' })
    .max(50, { message: 'Industry cannot exceed 50 characters' }),
});

// Hacker-specific schema
const hackerSchema = baseSchema.extend({
  role: z.literal('hacker'),
  skills: z.string().optional(),
});

// Combined schema with discriminated union
const registerSchema = z.discriminatedUnion('role', [
  organizationSchema,
  hackerSchema,
]);

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [location, navigate] = useLocation();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine initial role from URL query param
  const [activeRole, setActiveRole] = useState<'organization' | 'hacker'>('hacker');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    if (role === 'organization' || role === 'hacker') {
      setActiveRole(role);
    }
  }, [location]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      name: '',
      bio: '',
      role: activeRole,
      // Organization fields
      companyName: '',
      companyUrl: '',
      industry: '',
      // Hacker fields
      skills: '',
    },
  });

  // Update form values when role changes
  useEffect(() => {
    form.setValue('role', activeRole);
  }, [activeRole, form]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    // Convert skills string to array if provided
    if (data.role === 'hacker' && data.skills) {
      (data as any).skills = data.skills.split(',').map(skill => skill.trim());
    }
    
    try {
      await register(data);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveRole(value as 'organization' | 'hacker');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl bg-secondary border-neutral-800">
        <CardHeader className="text-center">
          <div className="mx-auto flex justify-center mb-2">
            {activeRole === 'organization' ? (
              <Shield className="h-12 w-12 text-primary" />
            ) : (
              <Bug className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription>
            Join RedXteam and be part of our security community
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeRole} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full bg-dark">
              <TabsTrigger value="organization" className="data-[state=active]:bg-primary">
                <Shield className="mr-2 h-4 w-4" />
                Organization
              </TabsTrigger>
              <TabsTrigger value="hacker" className="data-[state=active]:bg-primary">
                <Bug className="mr-2 h-4 w-4" />
                Hacker
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={activeRole === 'organization' ? "Organization contact name" : "Your full name"} 
                          className="bg-dark border-neutral-800" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a unique username" 
                          className="bg-dark border-neutral-800" 
                          autoComplete="username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="bg-dark border-neutral-800" 
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a secure password" 
                        className="bg-dark border-neutral-800" 
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={activeRole === 'organization' ? "Tell us about your organization..." : "Tell us about yourself..."} 
                        className="bg-dark border-neutral-800 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Organization-specific fields */}
              {activeRole === 'organization' && (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your company's name" 
                            className="bg-dark border-neutral-800" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://www.example.com" 
                              className="bg-dark border-neutral-800" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Technology, Finance, Healthcare" 
                              className="bg-dark border-neutral-800" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              
              {/* Hacker-specific fields */}
              {activeRole === 'hacker' && (
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Web Security, Mobile Security, Network Security" 
                          className="bg-dark border-neutral-800" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-neutral-400 text-xs">
                        Separate skills with commas (e.g. "Web Security, API Testing, Mobile Security")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-opacity-90" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            <span className="text-neutral-400">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
