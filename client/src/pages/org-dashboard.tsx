import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Program, Report } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/dashboard/stats-card";
import RecentReports from "@/components/dashboard/recent-reports";
import { PlusCircle, FileText, Shield, Settings } from "lucide-react";

interface ProgramWithTags extends Program {
  tags: string[];
}

interface OrgDashboardProps {
  user: Omit<User, "password"> | null;
}

export default function OrgDashboard({ user }: OrgDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/stats/organization/${user?.id}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });

  const { data: programs, isLoading: programsLoading } = useQuery<ProgramWithTags[]>({
    queryKey: [`/api/programs/organization/${user?.id}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });

  // Get the total number of reports for all programs
  const programIds = programs?.map(p => p.id) || [];
  
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
    staleTime: 1000 * 60 * 5,
    enabled: !!user && programIds.length > 0,
    select: (data) => data.filter(report => programIds.includes(report.programId)),
  });

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p>Please log in to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Organization Dashboard</h1>
          <p className="text-neutral-500">Manage your bug bounty programs and view submissions</p>
        </div>
        <Button asChild>
          <Link href="/create-program">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Program
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="reports">Vulnerability Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              title="Active Programs"
              value={stats?.activePrograms || 0}
              icon={<Shield className="h-5 w-5 text-blue-500" />}
              description="Total active bug bounty programs"
              isLoading={statsLoading}
            />
            <StatsCard 
              title="Total Reports"
              value={stats?.totalReports || 0}
              icon={<FileText className="h-5 w-5 text-primary" />}
              description="Vulnerability reports submitted"
              isLoading={statsLoading}
            />
            <StatsCard 
              title="Resolved Reports"
              value={stats?.resolvedReports || 0}
              icon={<Shield className="h-5 w-5 text-green-500" />}
              description="Vulnerabilities fixed"
              isLoading={statsLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Vulnerability Reports</CardTitle>
                  <CardDescription>
                    View and manage the latest vulnerability reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between p-4 border rounded-md">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-20 rounded-md" />
                            <Skeleton className="h-8 w-20 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : reports && reports.length > 0 ? (
                    <RecentReports reports={reports.slice(0, 5)} />
                  ) : (
                    <div className="text-center py-6 text-neutral-500">
                      No vulnerability reports yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  {programsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-md">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-32 mb-1" />
                          <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : programs && programs.length > 0 ? (
                    <div className="space-y-4">
                      {programs.map((program) => (
                        <div key={program.id} className="p-4 border rounded-md hover:bg-neutral-50 transition-colors">
                          <Link href={`/programs/${program.id}`}>
                            <a className="block">
                              <h3 className="font-medium text-secondary hover:text-primary">{program.title}</h3>
                              <p className="text-sm text-neutral-500 mb-2">
                                {program.isActive ? "Active" : "Inactive"} • ${program.minBounty} - ${program.maxBounty}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {program.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </a>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-neutral-500">
                      No programs created yet.
                      <Button className="mt-4" asChild>
                        <Link href="/create-program">Create Your First Program</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Bug Bounty Programs</CardTitle>
                <Button asChild>
                  <Link href="/create-program">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Program
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {programsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-60 mb-1" />
                          <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-28 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : programs && programs.length > 0 ? (
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div key={program.id} className="p-4 border rounded-md hover:bg-neutral-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg text-secondary">{program.title}</h3>
                          <p className="text-neutral-600 text-sm mb-2">{program.description.substring(0, 120)}...</p>
                          <div className="flex flex-wrap gap-1">
                            {program.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                                {tag}
                              </span>
                            ))}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${program.isActive ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                              {program.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/programs/${program.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary mb-1">No Programs Yet</h3>
                  <p className="text-neutral-500 mb-6">Create your first bug bounty program to start receiving vulnerability reports.</p>
                  <Button asChild>
                    <Link href="/create-program">Create Your First Program</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Reports</CardTitle>
              <CardDescription>
                Manage and respond to vulnerability reports from security researchers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between p-4 border rounded-md">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reports && reports.length > 0 ? (
                <RecentReports reports={reports} showAll />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary mb-1">No Reports Yet</h3>
                  <p className="text-neutral-500">
                    You haven't received any vulnerability reports yet. Make sure your programs are active and properly scoped.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization profile and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Organization Profile</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Organization Name</label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border border-input px-3 py-2" 
                          defaultValue={user.fullName}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full rounded-md border border-input px-3 py-2" 
                          defaultValue={user.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
                      <textarea 
                        className="w-full rounded-md border border-input px-3 py-2" 
                        rows={4}
                        defaultValue={user.bio || ""}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        id="email-notifications" 
                        className="rounded border-neutral-300 text-primary focus:ring-primary mr-2 mt-1" 
                        defaultChecked 
                        disabled
                      />
                      <div>
                        <label htmlFor="email-notifications" className="text-neutral-700 font-medium">Email Notifications</label>
                        <p className="text-sm text-neutral-500">Receive email notifications for new vulnerability reports</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        id="summary-reports" 
                        className="rounded border-neutral-300 text-primary focus:ring-primary mr-2 mt-1" 
                        defaultChecked 
                        disabled
                      />
                      <div>
                        <label htmlFor="summary-reports" className="text-neutral-700 font-medium">Weekly Summary</label>
                        <p className="text-sm text-neutral-500">Receive weekly summaries of your bug bounty program activity</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button disabled>Save Changes</Button>
                <p className="text-sm text-neutral-500">
                  <Settings className="h-4 w-4 inline-block mr-1" />
                  Settings functionality is limited in this demo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
