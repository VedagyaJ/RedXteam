import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Report, Program } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/dashboard/stats-card";
import ActivityItem from "@/components/dashboard/activity-item";
import RecentPrograms from "@/components/dashboard/recent-programs";
import { FileText, DollarSign, Target, Settings } from "lucide-react";

interface HackerDashboardProps {
  user: Omit<User, "password"> | null;
}

interface HackerStats {
  activeHunts: number;
  submissions: number;
  earnings: number;
}

interface ProgramWithDetails extends Program {
  tags: string[];
  organizationName: string;
}

export default function HackerDashboard({ user }: HackerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch hacker stats
  const { data: stats, isLoading: statsLoading } = useQuery<HackerStats>({
    queryKey: [`/api/stats/hacker/${user?.id}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });

  // Fetch reports by this hacker
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: [`/api/reports/hacker/${user?.id}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });

  // Fetch popular programs for recommendations
  const { data: programs, isLoading: programsLoading } = useQuery<ProgramWithDetails[]>({
    queryKey: ['/api/programs/popular'],
    staleTime: 1000 * 60 * 5, // 5 minutes
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
          <h1 className="text-3xl font-bold text-secondary">Hacker Dashboard</h1>
          <p className="text-neutral-500">Track your bug hunting activity and earnings</p>
        </div>
        <Button asChild>
          <Link href="/programs">
            <Target className="mr-2 h-4 w-4" />
            Browse Programs
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Your Reports</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              title="Active Hunts"
              value={stats?.activeHunts || 0}
              icon={<Target className="h-5 w-5 text-blue-500" />}
              description="Programs you're hunting on"
              isLoading={statsLoading}
            />
            <StatsCard 
              title="Submissions"
              value={stats?.submissions || 0}
              icon={<FileText className="h-5 w-5 text-primary" />}
              description="Total vulnerability reports"
              isLoading={statsLoading}
            />
            <StatsCard 
              title="Earnings"
              value={stats?.earnings || 0}
              icon={<DollarSign className="h-5 w-5 text-green-500" />}
              description="Total bounties earned"
              isLoading={statsLoading}
              isCurrency
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest vulnerability reports and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4 pb-4 border-b border-neutral-200">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : reports && reports.length > 0 ? (
                    <div className="space-y-4">
                      {reports.slice(0, 5).map((report) => (
                        <ActivityItem key={report.id} report={report} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-neutral-500">
                      You haven't submitted any reports yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Programs</CardTitle>
                  <CardDescription>
                    Programs that match your skills
                  </CardDescription>
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
                    <RecentPrograms programs={programs} />
                  ) : (
                    <div className="text-center py-6 text-neutral-500">
                      No programs available at the moment.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Vulnerability Reports</CardTitle>
              <CardDescription>
                Track the status of all your submitted vulnerability reports
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
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-secondary">{report.title}</h3>
                          <p className="text-sm text-neutral-500">
                            Submitted {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${report.severity === "critical" ? "bg-red-100 text-red-800" :
                              report.severity === "high" ? "bg-orange-100 text-orange-800" :
                              report.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"}`}
                          >
                            {report.severity}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${report.status === "accepted" ? "bg-green-100 text-green-800" :
                              report.status === "rejected" ? "bg-red-100 text-red-800" :
                              report.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              report.status === "fixed" ? "bg-blue-100 text-blue-800" :
                              "bg-purple-100 text-purple-800"}`}
                          >
                            {report.status}
                          </span>
                        </div>
                      </div>
                      {report.rewardAmount && report.rewardAmount > 0 && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-100 flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-700">Bounty Awarded: ${report.rewardAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary mb-1">No Reports Yet</h3>
                  <p className="text-neutral-500 mb-6">You haven't submitted any vulnerability reports yet.</p>
                  <Button asChild>
                    <Link href="/programs">Browse Programs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Earnings</CardTitle>
              <CardDescription>
                Track your bounty payouts and earnings history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Earnings Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-neutral-500">Total Earnings</div>
                      <div className="text-3xl font-bold text-secondary">${stats?.earnings.toLocaleString() || "0"}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-neutral-500">Paid Bounties</div>
                      <div className="text-3xl font-bold text-secondary">
                        {reports?.filter(r => r.rewardAmount && r.rewardAmount > 0).length || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-neutral-500">Average Bounty</div>
                      <div className="text-3xl font-bold text-secondary">
                        $
                        {reports && reports.length > 0 && reports.some(r => r.rewardAmount && r.rewardAmount > 0)
                          ? Math.round(
                              reports
                                .filter(r => r.rewardAmount && r.rewardAmount > 0)
                                .reduce((sum, r) => sum + (r.rewardAmount || 0), 0) /
                              reports.filter(r => r.rewardAmount && r.rewardAmount > 0).length
                            ).toLocaleString()
                          : "0"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Earnings History</h3>
                {reportsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between p-4 border rounded-md">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                  </div>
                ) : reports && reports.some(r => r.rewardAmount && r.rewardAmount > 0) ? (
                  <div className="space-y-4">
                    {reports
                      .filter(r => r.rewardAmount && r.rewardAmount > 0)
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map((report) => (
                        <div key={report.id} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <h4 className="font-medium text-secondary">{report.title}</h4>
                            <p className="text-sm text-neutral-500">
                              Paid on {new Date(report.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            +${report.rewardAmount?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <DollarSign className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary mb-1">No Earnings Yet</h3>
                    <p className="text-neutral-500">
                      You haven't received any bounty payments yet. Submit high-quality reports to earn rewards.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hacker Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border border-input px-3 py-2" 
                          defaultValue={user.fullName}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border border-input px-3 py-2" 
                          defaultValue={user.username}
                          disabled
                        />
                      </div>
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
                        <p className="text-sm text-neutral-500">Receive email updates about your report status changes</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        id="program-alerts" 
                        className="rounded border-neutral-300 text-primary focus:ring-primary mr-2 mt-1" 
                        defaultChecked 
                        disabled
                      />
                      <div>
                        <label htmlFor="program-alerts" className="text-neutral-700 font-medium">New Program Alerts</label>
                        <p className="text-sm text-neutral-500">Get notified when new bug bounty programs are added</p>
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
