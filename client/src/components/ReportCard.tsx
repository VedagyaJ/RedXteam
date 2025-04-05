import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Report } from '@shared/schema';
import { Link } from 'wouter';
import { User } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  programTitle?: string;
}

const ReportCard = ({ report, programTitle }: ReportCardProps) => {
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

  const getReportTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Generate a report ID in format VUL-XXXX
  const reportId = `VUL-${String(report.id).padStart(4, '0')}`;

  return (
    <div className="bg-secondary rounded-lg p-6 shadow-lg border border-neutral-800 hover:border-primary hover:border-opacity-30 transition-all">
      <div className="flex justify-between mb-3">
        <div className="font-medium text-white">{reportId}</div>
        <div className="flex space-x-2">
          <Badge variant="outline" className={getSeverityColor(report.severity)}>
            {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
          </Badge>
          <Badge variant="outline" className={getStatusColor(report.status)}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Badge>
        </div>
      </div>
      
      <h3 className="text-white font-semibold mb-2">{report.title}</h3>
      
      {programTitle && (
        <div className="text-neutral-400 text-sm mb-3">
          Program: {programTitle}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-neutral-300 text-sm">
          <User className="h-4 w-4 mr-1" />
          <span>Hacker #{report.hackerId}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-neutral-400 text-sm mr-4">
            {getReportTime(new Date(report.createdAt))}
          </span>
          <Link href={`/report/${report.id}`} className="text-primary hover:underline text-sm">
            View Details
          </Link>
        </div>
      </div>
      
      {report.rewardAmount !== null && (
        <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between">
          <span className="text-neutral-300 text-sm">Reward</span>
          <span className="text-green-400 font-medium">${report.rewardAmount}</span>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
