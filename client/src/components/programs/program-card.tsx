import React from "react";
import { Link } from "wouter";
import { Program } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, formatCurrency } from "@/lib/utils";

interface ProgramCardProps {
  program: Program & {
    tags: string[];
    organizationName: string;
  };
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const averageBounty = Math.floor((program.minBounty + program.maxBounty) / 2);
  const initials = getInitials(program.organizationName);
  const industry = program.industry || "Technology";
  
  // Get the appropriate background color for the organization initials
  const getBgColor = () => {
    const industries = {
      "Financial Services": "bg-blue-100 text-blue-600",
      "Cloud Infrastructure": "bg-purple-100 text-purple-600",
      "E-commerce": "bg-green-100 text-green-600",
      "Technology": "bg-indigo-100 text-indigo-600",
      "Healthcare": "bg-red-100 text-red-600",
      "Education": "bg-yellow-100 text-yellow-600",
    };
    
    return industries[industry as keyof typeof industries] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded flex items-center justify-center font-bold ${getBgColor()}`}>
            {initials}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-secondary">{program.organizationName}</h3>
            <div className="text-sm text-neutral-500">{program.industry}</div>
          </div>
        </div>
        <Badge variant="success">
          {program.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="p-5">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-sm text-neutral-500">Avg. Bounty</div>
            <div className="text-xl font-semibold text-secondary">{formatCurrency(averageBounty)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-500">Max Bounty</div>
            <div className="text-xl font-semibold text-secondary">{formatCurrency(program.maxBounty)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-500">Response</div>
            <div className="text-xl font-semibold text-secondary">{program.responseTime}h</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {program.tags.map((tag, index) => (
            <Badge key={index} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild className="w-full">
          <Link href={`/programs/${program.id}`}>View Program</Link>
        </Button>
      </div>
    </div>
  );
}
