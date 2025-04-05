import React from "react";
import { Report } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { calculateTimeAgo, getSeverityColor, getStatusColor } from "@/lib/utils";
import { 
  CheckCircle2, 
  InfoIcon, 
  Clock, 
  XCircle, 
  Copy
} from "lucide-react";

interface ActivityItemProps {
  report: Report;
}

export default function ActivityItem({ report }: ActivityItemProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <CheckCircle2 className="text-green-500 h-5 w-5 mt-1 flex-shrink-0" />;
      case "rejected":
        return <XCircle className="text-red-500 h-5 w-5 mt-1 flex-shrink-0" />;
      case "pending":
        return <Clock className="text-yellow-500 h-5 w-5 mt-1 flex-shrink-0" />;
      case "duplicate":
        return <Copy className="text-purple-500 h-5 w-5 mt-1 flex-shrink-0" />;
      case "fixed":
        return <CheckCircle2 className="text-blue-500 h-5 w-5 mt-1 flex-shrink-0" />;
      default:
        return <InfoIcon className="text-neutral-500 h-5 w-5 mt-1 flex-shrink-0" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "was accepted";
      case "rejected":
        return "was rejected";
      case "pending":
        return "is under review";
      case "duplicate":
        return "was marked as duplicate";
      case "fixed":
        return "has been fixed";
      default:
        return "status updated";
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-50 border-l-4 border-green-400";
      case "rejected":
        return "bg-red-50 border-l-4 border-red-400";
      case "pending":
        return "bg-yellow-50 border-l-4 border-yellow-400";
      case "duplicate":
        return "bg-purple-50 border-l-4 border-purple-400";
      case "fixed":
        return "bg-blue-50 border-l-4 border-blue-400";
      default:
        return "bg-neutral-50 border-l-4 border-neutral-400";
    }
  };

  return (
    <div className={`p-3 flex ${getStatusBackground(report.status)}`}>
      {getStatusIcon(report.status)}
      <div className="ml-3">
        <div className="flex items-center">
          <span className="font-medium text-secondary">Bug #{report.id}</span>
          <span className="mx-1 text-neutral-500">—</span>
          <span className="text-sm text-neutral-700">{report.title}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className={getStatusColor(report.status).replace('bg-', 'text-').replace('-100', '-700')}>
            {getStatusMessage(report.status)}
          </span>
          <span className="mx-1 text-neutral-500">•</span>
          <span className="text-neutral-500">{calculateTimeAgo(report.updatedAt)}</span>
        </div>
        {report.rewardAmount && report.rewardAmount > 0 && (
          <div className="text-sm font-medium text-green-700 mt-1">
            ${report.rewardAmount.toLocaleString()} awarded
          </div>
        )}
      </div>
      <div className="ml-auto">
        <Badge className={getSeverityColor(report.severity)}>
          {report.severity}
        </Badge>
      </div>
    </div>
  );
}
