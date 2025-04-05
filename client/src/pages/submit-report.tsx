import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Program, User, InsertReport, SeverityType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import ReportForm from "@/components/reports/report-form";

interface SubmitReportProps {
  user: Omit<User, "password"> | null;
}

interface ProgramWithDetails extends Program {
  tags: string[];
  organizationName: string;
}

export default function SubmitReport({ user }: SubmitReportProps) {
  const { programId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const parsedProgramId = parseInt(programId);

  useEffect(() => {
    // Redirect if user is not logged in or not a hacker
    if (!user || user.userType !== "hacker") {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: program, isLoading, error } = useQuery<ProgramWithDetails>({
    queryKey: [`/api/programs/${parsedProgramId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user && !isNaN(parsedProgramId),
  });

  const submitReport = useMutation({
    mutationFn: async (reportData: Omit<InsertReport, "hackerId" | "programId">) => {
      if (!user) throw new Error("User not authenticated");
      
      const completeReport: InsertReport = {
        ...reportData,
        hackerId: user.id,
        programId: parsedProgramId,
      };
      
      const response = await apiRequest("POST", "/api/reports", completeReport);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reports/hacker/${user?.id}`] });
      toast({
        title: "Report Submitted Successfully",
        description: "Your vulnerability report has been submitted and is under review.",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit report",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });

  if (isNaN(parsedProgramId)) {
    return (
      <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Invalid program ID provided.</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/programs">Return to Programs</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Program</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load program details."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/programs">Return to Programs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
      <Button variant="outline" className="mb-6" asChild>
        <Link href={`/programs/${programId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Program
        </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a Vulnerability Report</CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : program ? (
              <>Reporting a vulnerability for <span className="font-medium">{program.title}</span></>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : program ? (
            <ReportForm 
              onSubmit={(data) => submitReport.mutate(data)}
              isPending={submitReport.isPending}
            />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold text-secondary">What makes a good report?</h3>
              <p className="text-sm text-neutral-600">
                Good vulnerability reports are clear, concise, and provide enough information for the security team to reproduce and verify the issue.
              </p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-secondary">Include these details:</h3>
              <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                <li>Clear steps to reproduce the vulnerability</li>
                <li>The impact of the vulnerability if exploited</li>
                <li>Screenshots or videos demonstrating the issue (if applicable)</li>
                <li>Suggestions for fixing the vulnerability (optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold text-secondary">Choose the correct severity</h3>
              <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                <li><span className="font-medium">Critical</span>: Issues that allow attackers to take over the entire system or access highly sensitive data</li>
                <li><span className="font-medium">High</span>: Vulnerabilities that allow access to sensitive user data or partial system compromise</li>
                <li><span className="font-medium">Medium</span>: Issues that expose sensitive information or allow limited access</li>
                <li><span className="font-medium">Low</span>: Minor vulnerabilities with limited security impact</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/40 flex flex-col items-start pt-4">
          <p className="text-sm text-neutral-500">
            <span className="font-medium">Note:</span> Reports are reviewed by the security team and rewards are issued based on severity and impact.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
