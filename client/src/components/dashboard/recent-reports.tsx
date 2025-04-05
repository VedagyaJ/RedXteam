import React, { useState } from "react";
import { Report } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSeverityColor, getStatusColor, formatDate } from "@/lib/utils";
import { Link } from "wouter";
import { 
  FileText, 
  AlertTriangle,
  ExternalLink 
} from "lucide-react";

interface RecentReportsProps {
  reports: Report[];
  showAll?: boolean;
}

export default function RecentReports({ reports, showAll = false }: RecentReportsProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const displayReports = showAll ? reports : reports.slice(0, 5);

  return (
    <>
      <div className="space-y-4">
        {displayReports.length === 0 ? (
          <div className="text-center py-6 text-neutral-500">
            No vulnerability reports available.
          </div>
        ) : (
          displayReports.map((report) => (
            <Card key={report.id} className="border-l-4 transition-all hover:shadow-md"
              style={{ borderLeftColor: report.severity === "critical" ? "#ef4444" : 
                                        report.severity === "high" ? "#f97316" : 
                                        report.severity === "medium" ? "#eab308" : 
                                        "#22c55e" }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-secondary">{report.title}</h4>
                    <p className="text-sm text-neutral-500">
                      Report ID: #{report.id} • Submitted: {formatDate(report.createdAt)}
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
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-neutral-500">
                    {report.rewardAmount ? (
                      <span className="text-green-600 font-medium">
                        Reward: ${report.rewardAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span>Pending review</span>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(report)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedReport && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className={`h-5 w-5 mr-2 ${
                  selectedReport.severity === "critical" ? "text-red-500" : 
                  selectedReport.severity === "high" ? "text-orange-500" : 
                  selectedReport.severity === "medium" ? "text-yellow-500" : 
                  "text-green-500"
                }`} />
                {selectedReport.title}
              </DialogTitle>
              <DialogDescription>
                Report ID: #{selectedReport.id} • Submitted: {formatDate(selectedReport.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getSeverityColor(selectedReport.severity)}>
                  {selectedReport.severity}
                </Badge>
                <Badge className={getStatusColor(selectedReport.status)}>
                  {selectedReport.status}
                </Badge>
                {selectedReport.rewardAmount && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Reward: ${selectedReport.rewardAmount.toLocaleString()}
                  </Badge>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-1">Description</h4>
                <p className="text-neutral-600 whitespace-pre-line text-sm">
                  {selectedReport.description}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-1">Steps to Reproduce</h4>
                <p className="text-neutral-600 whitespace-pre-line text-sm">
                  {selectedReport.stepsToReproduce}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-1">Impact</h4>
                <p className="text-neutral-600 whitespace-pre-line text-sm">
                  {selectedReport.impact}
                </p>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href={`/reports/${selectedReport.id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Full Report
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
