import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Program, Report, User
} from '@shared/schema';
import DashboardStats from '@/components/DashboardStats';
import ReportCard from '@/components/ReportCard';
import ProgramCard from '@/components/ProgramCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, ChartLine, AlertCircle
} from 'lucide-react';

const OrgDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: programs, isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: [`/api/programs/organization/${user?.id}`],
  });

  // Fetch reports for each program
  const programIds = programs?.map(p => p.id) || [];
  
  // Only fetch reports if we have programs
  const { data: allReports, isLoading: reportsLoading } = useQuery<Report[][]>({
    queryKey: ['/api/reports/programs', programIds],
    enabled: programIds.length > 0,
    queryFn: async () => {
      const reportsPromises = programIds.map(id => 
        fetch(`/api/reports/program/${id}`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : [])
      );
      return Promise.all(reportsPromises);
    }
  });

  // Flatten reports array
  const reports = allReports ? allReports.flat() : [];
  
  // Loading state
  const isLoading = programsLoading || reportsLoading;
  
  // Calculate stats
  const stats = {
    totalReports: reports?.length || 0,
    openIssues: reports?.filter(r => r.status !== 'fixed' && r.status !== 'rejected').length || 0,
    rewards: reports?.reduce((sum, r) => sum + (r.rewardAmount || 0), 0) || 0,
    activeHunters: reports ? new Set(reports.map(r => r.hackerId)).size : 0
  };

  // Get program title for a report
  const getProgramTitle = (programId: number) => {
    const program = programs?.find(p => p.id === programId);
    return program?.title || 'Unknown Program';
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Organization Dashboard</h1>
            <p className="text-neutral-300">Manage your bug bounty programs and vulnerability reports</p>
          </div>
          <Button asChild className="bg-primary hover:bg-opacity-90">
            <Link href="/create-program">
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Link>
          </Button>
        </div>
        
        {/* Stats Cards */}
        <DashboardStats 
          stats={stats}
          type="organization"
          isLoading={isLoading}
        />
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="bg-secondary border-b border-neutral-800 rounded-t-lg w-full p-0 h-auto justify-start">
            <TabsTrigger 
              value="overview" 
              className="rounded-none rounded-tl-lg data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="programs" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
            >
              My Programs
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
            >
              Vulnerability Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Chart Card */}
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Vulnerability Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-neutral-300">
                  <ChartLine className="h-12 w-12 mb-3 text-primary mx-auto" />
                  <p>Vulnerability trends visualization coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Reports */}
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Recent Reports</CardTitle>
                <Button variant="link" asChild className="text-primary p-0">
                  <Link href="#" onClick={() => setActiveTab('reports')}>View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full bg-neutral-800" />
                    ))}
                  </div>
                ) : reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.slice(0, 3).map(report => (
                      <ReportCard 
                        key={report.id} 
                        report={report} 
                        programTitle={getProgramTitle(report.programId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white">No reports yet</h3>
                    <p className="text-neutral-400">Once hackers submit vulnerabilities, they'll appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Programs Summary */}
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Your Programs</CardTitle>
                <Button variant="link" asChild className="text-primary p-0">
                  <Link href="#" onClick={() => setActiveTab('programs')}>View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {programsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full bg-neutral-800" />
                    ))}
                  </div>
                ) : programs && programs.length > 0 ? (
                  <div className="space-y-4">
                    {programs.slice(0, 2).map(program => (
                      <ProgramCard key={program.id} program={program} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white">No programs created</h3>
                    <p className="text-neutral-400 mb-4">Start by creating your first bug bounty program.</p>
                    <Button asChild className="bg-primary hover:bg-opacity-90">
                      <Link href="/create-program">Create Program</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="programs" className="mt-6">
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">All Programs</CardTitle>
                <Button asChild className="bg-primary hover:bg-opacity-90">
                  <Link href="/create-program">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Program
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {programsLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} className="h-48 w-full bg-neutral-800" />
                    ))}
                  </div>
                ) : programs && programs.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {programs.map(program => (
                      <ProgramCard key={program.id} program={program} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white">No programs created</h3>
                    <p className="text-neutral-400 mb-4">Start by creating your first bug bounty program.</p>
                    <Button asChild className="bg-primary hover:bg-opacity-90">
                      <Link href="/create-program">Create Program</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">All Vulnerability Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full bg-neutral-800" />
                    ))}
                  </div>
                ) : reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map(report => (
                      <ReportCard 
                        key={report.id} 
                        report={report} 
                        programTitle={getProgramTitle(report.programId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white">No reports yet</h3>
                    <p className="text-neutral-400">Once hackers submit vulnerabilities, they'll appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrgDashboard;
