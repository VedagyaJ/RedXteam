import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Report, Program, User, ReportComment } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Calendar, AlertTriangle, CheckCircle2, 
  XCircle, MessageSquare, Send, AlertCircle, User as UserIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReportDetailProps {
  id: string;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ id }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  
  // Fetch report details
  const { data: report, isLoading: reportLoading } = useQuery<Report>({
    queryKey: [`/api/reports/${id}`],
  });
  
  // Fetch program details if we have the report
  const { data: program, isLoading: programLoading } = useQuery<Program>({
    queryKey: [`/api/programs/${report?.programId}`],
    enabled: !!report,
  });
  
  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useQuery<ReportComment[]>({
    queryKey: [`/api/reports/${id}/comments`],
    enabled: !!report,
  });

  // Update report status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, triageNotes }: { status: string; triageNotes?: string }) => {
      const response = await apiRequest('PATCH', `/api/reports/${id}/status`, {
        status,
        triageNotes,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The report status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/reports/${id}`] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Assign reward mutation
  const assignRewardMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', `/api/reports/${id}/reward`, {
        amount,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reward assigned",
        description: "The reward has been assigned successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/reports/${id}`] });
      setRewardAmount('');
    },
    onError: (error) => {
      toast({
        title: "Failed to assign reward",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/reports/${id}/comments`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment added",
        description: "Your comment has been added to the report.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/reports/${id}/comments`] });
      setNewComment('');
    },
    onError: (error) => {
      toast({
        title: "Failed to add comment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate({ status });
  };

  const handleRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(rewardAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid reward amount.",
        variant: "destructive",
      });
      return;
    }
    assignRewardMutation.mutate(amount);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }
    addCommentMutation.mutate(newComment);
  };

  // Determine if user is allowed to manage this report
  const isOrgOwner = user?.role === 'organization' && program?.organizationId === user.id;
  const isReportHacker = user?.role === 'hacker' && report?.hackerId === user.id;
  const canManageReport = isOrgOwner;

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 bg-opacity-20 text-red-500 border-red-500';
      case 'high':
        return 'bg-orange-500 bg-opacity-20 text-orange-500 border-orange-500';
      case 'medium':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-500 border-yellow-500';
      case 'low':
        return 'bg-blue-500 bg-opacity-20 text-blue-500 border-blue-500';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-500 border-gray-500';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500 bg-opacity-20 text-green-500 border-green-500';
      case 'pending':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-500 border-yellow-500';
      case 'triaging':
        return 'bg-blue-500 bg-opacity-20 text-blue-500 border-blue-500';
      case 'rejected':
        return 'bg-red-500 bg-opacity-20 text-red-500 border-red-500';
      case 'fixed':
        return 'bg-purple-500 bg-opacity-20 text-purple-500 border-purple-500';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-500 border-gray-500';
    }
  };

  // Loading state
  if (reportLoading || (report && programLoading)) {
    return (
      <div className="min-h-screen bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 bg-neutral-800 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-72 w-full bg-neutral-800 rounded-lg mb-6" />
              <Skeleton className="h-40 w-full bg-neutral-800 rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-64 w-full bg-neutral-800 rounded-lg mb-6" />
              <Skeleton className="h-40 w-full bg-neutral-800 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (!report || !program) {
    return (
      <div className="min-h-screen bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-secondary border-neutral-800">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <AlertCircle className="text-primary h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
              <p className="text-neutral-300 mb-6">
                The vulnerability report you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href={user?.role === 'organization' ? '/dashboard/organization' : '/dashboard/hacker'} className="flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Generate a report ID in format VUL-XXXX
  const reportId = `VUL-${String(report.id).padStart(4, '0')}`;

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={user?.role === 'organization' ? '/dashboard/organization' : '/dashboard/hacker'} className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{reportId}: {report.title}</h1>
              <Badge variant="outline" className={getSeverityColor(report.severity)}>
                {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
              </Badge>
              <Badge variant="outline" className={getStatusColor(report.status)}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
            </div>
            <div className="text-neutral-400 text-sm flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Submitted {formatDistanceToNow(new Date(report.createdAt))} ago</span>
              {report.rewardAmount ? (
                <span className="ml-3 text-green-400 font-medium">Reward: ${report.rewardAmount}</span>
              ) : null}
            </div>
          </div>
          
          {canManageReport && (
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-green-500 text-green-500 hover:bg-green-500 hover:bg-opacity-10"
                onClick={() => handleStatusChange('accepted')}
                disabled={report.status === 'accepted'}
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10"
                onClick={() => handleStatusChange('rejected')}
                disabled={report.status === 'rejected'}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:bg-opacity-10"
                onClick={() => handleStatusChange('triaging')}
                disabled={report.status === 'triaging'}
              >
                <AlertTriangle className="mr-1 h-4 w-4" />
                Triage
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:bg-opacity-10"
                onClick={() => handleStatusChange('fixed')}
                disabled={report.status === 'fixed'}
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Mark Fixed
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-secondary border-neutral-800 mb-6">
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <div className="bg-dark p-4 rounded-lg border border-neutral-700">
                    <p className="text-neutral-300 whitespace-pre-line">{report.description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Steps to Reproduce</h3>
                  <div className="bg-dark p-4 rounded-lg border border-neutral-700">
                    <p className="text-neutral-300 whitespace-pre-line">{report.stepsToReproduce}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Impact</h3>
                  <div className="bg-dark p-4 rounded-lg border border-neutral-700">
                    <p className="text-neutral-300 whitespace-pre-line">{report.impact}</p>
                  </div>
                </div>
                
                {report.attachments && report.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Attachments</h3>
                    <div className="bg-dark p-4 rounded-lg border border-neutral-700">
                      <ul className="text-neutral-300">
                        {report.attachments.map((attachment, index) => (
                          <li key={index} className="mb-2 flex items-center">
                            <a 
                              href={attachment} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              Attachment {index + 1}
                              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-neutral-800">
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                {commentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full bg-neutral-800" />
                    ))}
                  </div>
                ) : comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="bg-dark p-4 rounded-lg border border-neutral-700">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center mr-2">
                            <UserIcon className="h-4 w-4 text-neutral-300" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {comment.userId === report.hackerId ? 'Hacker' : 'Organization'}
                            </div>
                            <div className="text-neutral-400 text-xs">
                              {formatDistanceToNow(new Date(comment.createdAt))} ago
                            </div>
                          </div>
                        </div>
                        <p className="text-neutral-300 whitespace-pre-line">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-neutral-500 mx-auto mb-3" />
                    <p className="text-neutral-400">No comments yet. Be the first to comment.</p>
                  </div>
                )}
                
                <form onSubmit={handleCommentSubmit} className="mt-6">
                  <Textarea
                    placeholder="Add a comment..."
                    className="bg-dark border-neutral-700 resize-none"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-opacity-90"
                      disabled={addCommentMutation.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {addCommentMutation.isPending ? 'Sending...' : 'Send Comment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-secondary border-neutral-800">
              <CardHeader>
                <CardTitle>Program Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mr-3">
                    {program.logo ? (
                      <img 
                        src={program.logo} 
                        alt={program.title} 
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{program.title}</h3>
                    <p className="text-neutral-400 text-sm">{program.industry || 'Technology'}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-neutral-300 mb-1">Rewards</h4>
                  <div className="bg-dark p-3 rounded-lg">
                    {Object.entries(typeof program.rewards === 'string' 
                      ? JSON.parse(program.rewards) 
                      : program.rewards).map(([severity, amount]) => (
                        <div key={severity} className="flex justify-between items-center mb-1 last:mb-0">
                          <span className="text-neutral-300 capitalize">{severity}:</span>
                          <span className="text-white">${amount}</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/program/${program.id}`}>
                    View Program Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {isOrgOwner && (
              <Card className="bg-secondary border-neutral-800">
                <CardHeader>
                  <CardTitle>Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.triageNotes && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-300 mb-1">Triage Notes</h4>
                      <div className="bg-dark p-3 rounded-lg">
                        <p className="text-neutral-300 whitespace-pre-line">{report.triageNotes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-1">Assign Reward</h4>
                    <form onSubmit={handleRewardSubmit} className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Amount in $"
                        className="bg-dark border-neutral-700"
                        value={rewardAmount}
                        onChange={e => setRewardAmount(e.target.value)}
                        min="0"
                      />
                      <Button 
                        type="submit"
                        className="bg-primary hover:bg-opacity-90 whitespace-nowrap"
                        disabled={assignRewardMutation.isPending}
                      >
                        Assign
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="bg-secondary border-neutral-800">
              <CardHeader>
                <CardTitle>Hacker Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                    <UserIcon className="h-6 w-6 text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Hacker #{report.hackerId}</h3>
                    <p className="text-neutral-400 text-sm">Vulnerability Reporter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
