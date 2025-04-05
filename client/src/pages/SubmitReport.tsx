import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Program, insertReportSchema } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';
import BugReportForm from '@/components/BugReportForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface SubmitReportProps {
  programId: string;
}

const SubmitReport: React.FC<SubmitReportProps> = ({ programId }) => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch program details
  const { data: program, isLoading, error } = useQuery<Program>({
    queryKey: [`/api/programs/${programId}`],
  });

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/reports', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted successfully",
        description: "Your vulnerability report has been sent to the organization.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reports/hacker'] });
      navigate('/dashboard/hacker');
    },
    onError: (error) => {
      toast({
        title: "Failed to submit report",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (formData: any) => {
    createReportMutation.mutate({
      ...formData,
      programId: parseInt(programId),
    });
  };

  // If program is inactive, redirect or show error
  if (program && program.status !== 'active') {
    return (
      <div className="min-h-screen bg-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-secondary border-neutral-800">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <AlertCircle className="text-primary h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Program Not Accepting Reports</h2>
              <p className="text-neutral-300 mb-6">
                This program is currently not accepting new vulnerability reports.
              </p>
              <Link href={`/program/${programId}`} className="flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Program Details
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If program doesn't exist
  if (error) {
    return (
      <div className="min-h-screen bg-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-secondary border-neutral-800">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <AlertCircle className="text-primary h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Program Not Found</h2>
              <p className="text-neutral-300 mb-6">
                The bug bounty program you're looking for doesn't exist or may have been removed.
              </p>
              <Link href="/programs" className="flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse All Programs
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/program/${programId}`} className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Program
          </Link>
        </div>
        
        <Card className="bg-secondary border-neutral-800">
          <CardHeader>
            <CardTitle className="text-2xl">Submit Vulnerability Report</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-64 bg-neutral-800" />
                <Skeleton className="h-12 w-full bg-neutral-800" />
                <Skeleton className="h-36 w-full bg-neutral-800" />
                <Skeleton className="h-24 w-full bg-neutral-800" />
              </div>
            ) : program ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">Submitting to: {program.title}</h3>
                  <p className="text-neutral-400 text-sm">
                    Please provide detailed information about the vulnerability you've discovered.
                    Clear descriptions and steps to reproduce help organizations understand and fix issues faster.
                  </p>
                </div>
                <BugReportForm onSubmit={handleSubmit} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitReport;
