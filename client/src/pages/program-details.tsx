import React, { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Program, User, Report, UserType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, getInitials, getSeverityColor, getStatusColor } from "@/lib/utils";
import { ShieldAlert, Target, Bug, Clock, FileText, AlertCircle } from "lucide-react";

interface ProgramWithDetails extends Program {
  tags: string[];
  organizationName: string;
}

interface ReportWithDetails extends Report {
  hackerUsername: string;
}

export default function ProgramDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const programId = parseInt(id);
  
  // Get stored user from localStorage
  const [user, setUser] = useState<Omit<User, "password"> | null>(() => {
    const storedUser = localStorage.getItem("redxteam_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isHacker = user?.userType === UserType.HACKER;
  const isOrganization = user?.userType === UserType.ORGANIZATION;
  const isOrganizationOwner = isOrganization && user.id === program?.organizationId;

  const { data: program, isLoading: programLoading, error: programError } = useQuery<ProgramWithDetails>({
    queryKey: [`/api/programs/${programId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !isNaN(programId),
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<ReportWithDetails[]>({
    queryKey: [`/api/reports/program/${programId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !isNaN(programId) && isOrganizationOwner,
  });

  if (isNaN(programId)) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Invalid Program ID</h2>
            </div>
            <p className="text-red-700 mb-4">The program ID provided is not valid.</p>
            <Button variant="outline" asChild>
              <Link href="/programs">Return to Programs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (programError) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Error Loading Program</h2>
            </div>
            <p className="text-red-700 mb-4">
              {programError instanceof Error 
                ? programError.message 
                : "Failed to load program details. The program may not exist or has been removed."}
            </p>
            <Button variant="outline" asChild>
              <Link href="/programs">Return to Programs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {programLoading ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
          </div>
        </div>
      ) : program ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded flex items-center justify-center font-bold 
                  ${program.industry === "Financial Services" ? "bg-blue-100 text-blue-600" : 
                    program.industry === "Cloud Infrastructure" ? "bg-purple-100 text-purple-600" : 
                    program.industry === "E-commerce" ? "bg-green-100 text-green-600" : 
                    "bg-gray-100 text-gray-600"}`}
                >
                  {getInitials(program.organizationName)}
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-secondary">{program.title}</h1>
                  <div className="flex items-center text-neutral-500">
                    <span>{program.organizationName}</span>
                    <span className="mx-2">•</span>
                    <span>{program.industry}</span>
                  </div>
                </div>
              </div>
            </div>
            {isHacker && (
              <Button size="lg" asChild>
                <Link href={`/submit-report/${program.id}`}>Submit a Bug</Link>
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Program Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 whitespace-pre-line">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {program.tags.map((tag, index) => (
                      <Badge key={index} variant="tag">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Scope & Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">In Scope</h3>
                    <p className="text-neutral-700 whitespace-pre-line">{program.scope}</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Rules</h3>
                    <p className="text-neutral-700 whitespace-pre-line">{program.rules}</p>
                  </div>
                </CardContent>
              </Card>

              {isOrganizationOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bug className="mr-2 h-5 w-5 text-primary" />
                      Submitted Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="accepted">Accepted</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-4">
                        {reportsLoading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <Card key={i}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-6 w-16" />
                                  </div>
                                  <Skeleton className="h-4 w-1/2 mt-2" />
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : reports && reports.length > 0 ? (
                          <div className="space-y-4">
                            {reports.map((report) => (
                              <Card key={report.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-secondary">{report.title}</h4>
                                      <p className="text-sm text-neutral-500">
                                        Reported by @{report.hackerUsername} • {new Date(report.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge className={getSeverityColor(report.severity)}>
                                        {report.severity}
                                      </Badge>
                                      <Badge className={getStatusColor(report.status)}>
                                        {report.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-neutral-500 text-center py-6">No reports have been submitted yet.</p>
                        )}
                      </TabsContent>
                      {/* Other tabs content would be similar, but filtered by status */}
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Reward Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-neutral-500">Minimum Bounty</div>
                      <div className="text-2xl font-bold text-secondary">{formatCurrency(program.minBounty)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Maximum Bounty</div>
                      <div className="text-2xl font-bold text-secondary">{formatCurrency(program.maxBounty)}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm text-neutral-500">Average Payout</div>
                      <div className="text-xl font-semibold text-secondary">
                        {formatCurrency((program.minBounty + program.maxBounty) / 2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Program Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <ShieldAlert className="h-5 w-5 text-neutral-400 mr-3" />
                      <div>
                        <div className="text-sm text-neutral-500">Status</div>
                        <div className="font-medium text-secondary">
                          {program.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-neutral-400 mr-3" />
                      <div>
                        <div className="text-sm text-neutral-500">Response Time</div>
                        <div className="font-medium text-secondary">{program.responseTime} hours</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-neutral-400 mr-3" />
                      <div>
                        <div className="text-sm text-neutral-500">Created</div>
                        <div className="font-medium text-secondary">
                          {new Date(program.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isHacker && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-secondary mb-2">Ready to submit a bug?</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Log in as a hacker to submit vulnerability reports for this program.
                    </p>
                    <Button asChild>
                      <Link href="/login">Log In</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
