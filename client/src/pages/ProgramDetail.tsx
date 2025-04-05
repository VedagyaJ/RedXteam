import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Program } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, Globe, Database, Shield, AlertCircle, 
  ExternalLink, Terminal, Bug, InfoIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProgramDetailProps {
  id: string;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ id }) => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const { data: program, isLoading, error } = useQuery<Program>({
    queryKey: [`/api/programs/${id}`],
  });

  if (error) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-secondary border-neutral-800">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <AlertCircle className="text-primary h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Program Not Found</h2>
              <p className="text-neutral-300 mb-6">
                The bug bounty program you're looking for doesn't exist or may have been removed.
              </p>
              <Button asChild className="bg-primary hover:bg-opacity-90">
                <Link href="/programs">Browse All Programs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !program) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 bg-neutral-800 mb-2" />
            <Skeleton className="h-4 w-96 bg-neutral-800" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full bg-neutral-800 rounded-lg mb-6" />
            </div>
            <div>
              <Skeleton className="h-64 w-full bg-neutral-800 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if rewards is a string (JSON)
  const rewards = typeof program.rewards === 'string' 
    ? JSON.parse(program.rewards) 
    : program.rewards;

  return (
    <div className="bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <div className="mr-4">
            {program.logo ? (
              <img 
                src={program.logo} 
                alt={program.title} 
                className="w-16 h-16 rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-neutral-800 flex items-center justify-center">
                <Globe className="text-primary h-8 w-8" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-3xl font-bold text-white mr-3">{program.title}</h1>
              <Badge 
                variant="outline" 
                className={
                  program.status === 'active' 
                    ? 'bg-green-500 bg-opacity-20 text-green-500 border-green-500' 
                    : 'bg-red-500 bg-opacity-20 text-red-500 border-red-500'
                }
              >
                {program.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-neutral-300 flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Updated {formatDistanceToNow(new Date(program.updatedAt))} ago</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-secondary border-b border-neutral-800 rounded-t-lg w-full p-0 h-auto">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none rounded-tl-lg data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="scope" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  Scope
                </TabsTrigger>
                <TabsTrigger 
                  value="rules" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  Rules
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <Card className="border-t-0 rounded-t-none bg-secondary border-neutral-800">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-medium text-white mb-3">About This Program</h3>
                      <p className="text-neutral-300 whitespace-pre-line">{program.description}</p>
                    </div>
                    
                    {program.technologies && program.technologies.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-3">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {program.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="bg-neutral-800">
                              <Terminal className="h-3 w-3 mr-1" />
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Organization Information</h3>
                      {program.industry && (
                        <div className="flex items-center mb-2">
                          <Database className="h-4 w-4 text-neutral-400 mr-2" />
                          <span className="text-neutral-300">Industry: {program.industry}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scope" className="mt-0">
                <Card className="border-t-0 rounded-t-none bg-secondary border-neutral-800">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-medium text-white mb-3">In Scope</h3>
                      <div className="bg-dark p-4 rounded-lg border border-neutral-700 mb-4">
                        <p className="text-neutral-300 whitespace-pre-line">{program.scope}</p>
                      </div>
                    </div>
                    
                    {program.outOfScope && (
                      <div>
                        <h3 className="text-xl font-medium text-white mb-3">Out of Scope</h3>
                        <div className="bg-dark p-4 rounded-lg border border-neutral-700">
                          <p className="text-neutral-300 whitespace-pre-line">{program.outOfScope}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="rules" className="mt-0">
                <Card className="border-t-0 rounded-t-none bg-secondary border-neutral-800">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-white mb-3">Program Rules</h3>
                      <div className="bg-dark p-4 rounded-lg border border-neutral-700">
                        <p className="text-neutral-300 whitespace-pre-line">
                          {program.rules || 'No specific rules have been provided for this program.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-neutral-800 bg-opacity-50 rounded-lg p-4 flex items-start">
                      <InfoIcon className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-sm text-neutral-300">
                        Always follow responsible disclosure practices. Do not publicly disclose vulnerabilities before they are fixed.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Reward Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-700 pb-3">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-red-500 bg-opacity-20 text-red-500 border-red-500 mr-2">
                        Critical
                      </Badge>
                    </div>
                    <span className="text-white font-bold">${rewards.critical || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-neutral-700 pb-3">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-orange-500 bg-opacity-20 text-orange-500 border-orange-500 mr-2">
                        High
                      </Badge>
                    </div>
                    <span className="text-white font-bold">${rewards.high || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-neutral-700 pb-3">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-500 bg-opacity-20 text-yellow-500 border-yellow-500 mr-2">
                        Medium
                      </Badge>
                    </div>
                    <span className="text-white font-bold">${rewards.medium || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-blue-500 bg-opacity-20 text-blue-500 border-blue-500 mr-2">
                        Low
                      </Badge>
                    </div>
                    <span className="text-white font-bold">${rewards.low || 0}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  {user ? (
                    user.role === 'hacker' ? (
                      <Button 
                        asChild 
                        className="w-full bg-primary hover:bg-opacity-90"
                        disabled={program.status !== 'active'}
                      >
                        <Link href={`/submit-report/${program.id}`}>
                          <Bug className="mr-2 h-4 w-4" />
                          Submit Vulnerability
                        </Link>
                      </Button>
                    ) : (
                      <div className="text-center p-4 bg-neutral-800 rounded-lg">
                        <Shield className="h-10 w-10 text-neutral-500 mx-auto mb-2" />
                        <p className="text-neutral-400 text-sm">
                          Only hackers can submit vulnerabilities
                        </p>
                      </div>
                    )
                  ) : (
                    <Button asChild className="w-full bg-primary hover:bg-opacity-90">
                      <Link href="/login">
                        <Bug className="mr-2 h-4 w-4" />
                        Login to Submit
                      </Link>
                    </Button>
                  )}
                </div>
                
                {program.status !== 'active' && (
                  <div className="mt-4 bg-neutral-800 p-3 rounded-lg text-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-neutral-300 text-sm">This program is currently not accepting new reports</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
