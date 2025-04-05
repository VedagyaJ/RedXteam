import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Report, Program } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import DashboardStats from '@/components/DashboardStats';
import ReportCard from '@/components/ReportCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, ExternalLink, ChartLine, AlertCircle,
  Trophy, Target
} from 'lucide-react';

const HackerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch all reports by the hacker
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports/hacker'],
  });

  // Get program details for each report's program
  const programIds = reports?.map(r => r.programId) || [];
  const uniqueProgramIds = [...new Set(programIds)];
  
  const { data: programs, isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: ['/api/programs/details', uniqueProgramIds],
    enabled: uniqueProgramIds.length > 0,
    queryFn: async () => {
      const programPromises = uniqueProgramIds.map(id => 
        fetch(`/api/programs/${id}`, { credentials: 'include' })
          .then(res => res.ok ? res.json() : null)
      );
      return (await Promise.all(programPromises)).filter(Boolean);
    }
  });

  // Loading state
  const isLoading = reportsLoading || programsLoading;
  
  // Calculate stats
  const stats = {
    submittedReports: reports?.length || 0,
    acceptedReports: reports?.filter(r => r.status === 'accepted' || r.status === 'fixed').length || 0,
    rewardsEarned: reports?.reduce((sum, r) => sum + (r.rewardAmount || 0), 0) || 0,
    reputation: user?.reputation || 0
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
            <h1 className="text-3xl font-bold text-white">Hacker Dashboard</h1>
            <p className="text-neutral-300">Manage your vulnerability reports and track your rewards</p>
          </div>
          <Button asChild className="bg-primary hover:bg-opacity-90">
            <Link href="/programs">
              <Search className="mr-2 h-4 w-4" />
              Find Programs
            </Link>
          </Button>
        </div>
        
        {/* Stats Cards */}
        <DashboardStats 
          stats={stats}
          type="hacker"
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
              value="reports" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
            >
              My Reports
            </TabsTrigger>
            <TabsTrigger 
              value="reputation" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
            >
              Reputation & Rewards
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Activity Chart */}
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-neutral-300">
                  <ChartLine className="h-12 w-12 mb-3 text-primary mx-auto" />
                  <p>Activity and rewards overview coming soon</p>
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
                    <h3 className="text-lg font-medium text-white">No reports submitted</h3>
                    <p className="text-neutral-400 mb-4">Start hunting for vulnerabilities to submit your first report.</p>
                    <Button asChild className="bg-primary hover:bg-opacity-90">
                      <Link href="/programs">Find Programs</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Programs to Explore */}
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recommended Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-white">Find your next bug bounty</h3>
                  <p className="text-neutral-400 mb-4">Explore active programs matching your skills.</p>
                  <Button asChild className="bg-primary hover:bg-opacity-90">
                    <Link href="/programs">Browse Programs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">All Submitted Reports</CardTitle>
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
                    <h3 className="text-lg font-medium text-white">No reports submitted</h3>
                    <p className="text-neutral-400 mb-4">Start hunting for vulnerabilities to submit your first report.</p>
                    <Button asChild className="bg-primary hover:bg-opacity-90">
                      <Link href="/programs">Find Programs</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reputation" className="mt-6">
            <Card className="bg-secondary border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Reputation & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8 flex flex-col items-center">
                  <div className="mb-4 w-24 h-24 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {user?.reputation || 0} Points
                    </h3>
                    <p className="text-neutral-400">Your current reputation score</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Achievements</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-dark rounded-lg p-4 border border-neutral-800 flex flex-col items-center">
                      <div className="mb-2 w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium text-center">First Blood</h4>
                      <p className="text-xs text-neutral-400 text-center">Submit your first valid bug</p>
                    </div>
                    
                    <div className="bg-dark rounded-lg p-4 border border-neutral-800 flex flex-col items-center opacity-50">
                      <div className="mb-2 w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                        <svg className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium text-center">Critical Hunter</h4>
                      <p className="text-xs text-neutral-400 text-center">Find 5 critical vulnerabilities</p>
                    </div>
                    
                    <div className="bg-dark rounded-lg p-4 border border-neutral-800 flex flex-col items-center opacity-50">
                      <div className="mb-2 w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                        <svg className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium text-center">Team Player</h4>
                      <p className="text-xs text-neutral-400 text-center">Help improve 10 reports</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Reward History</h3>
                  
                  {reports && reports.filter(r => r.rewardAmount).length > 0 ? (
                    <div className="border border-neutral-800 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-neutral-800">
                        <thead className="bg-neutral-800">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                              Program
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                              Severity
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-dark divide-y divide-neutral-800">
                          {reports
                            .filter(r => r.rewardAmount)
                            .map(report => (
                              <tr key={report.id} className="hover:bg-neutral-800">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                                  {new Date(report.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                                  {getProgramTitle(report.programId)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <Badge variant="outline" className={
                                    report.severity === 'critical' ? 'bg-red-500 bg-opacity-20 text-red-500 border-red-500' :
                                    report.severity === 'high' ? 'bg-orange-500 bg-opacity-20 text-orange-500 border-orange-500' :
                                    report.severity === 'medium' ? 'bg-yellow-500 bg-opacity-20 text-yellow-500 border-yellow-500' :
                                    'bg-blue-500 bg-opacity-20 text-blue-500 border-blue-500'
                                  }>
                                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 text-right font-medium">
                                  ${report.rewardAmount}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-dark border border-neutral-800 rounded-lg">
                      <Trophy className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-white">No rewards yet</h3>
                      <p className="text-neutral-400">You'll see your rewards here once you receive them.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HackerDashboard;
