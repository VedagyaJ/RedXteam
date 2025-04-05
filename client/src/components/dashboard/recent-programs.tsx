import React from "react";
import { Link } from "wouter";
import { Program } from "@shared/schema";
import { getInitials } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface RecentProgramsProps {
  programs: Array<Program & { tags: string[], organizationName: string }>;
}

export default function RecentPrograms({ programs }: RecentProgramsProps) {
  // Only show up to 3 programs
  const displayPrograms = programs.slice(0, 3);

  // Get organization initials background color based on industry
  const getOrgBgColor = (industry: string) => {
    switch (industry) {
      case "Financial Services":
        return "bg-blue-100 text-blue-600";
      case "Cloud Infrastructure":
        return "bg-purple-100 text-purple-600";
      case "E-commerce":
        return "bg-green-100 text-green-600";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="space-y-2">
      {displayPrograms.map((program) => (
        <Link key={program.id} href={`/programs/${program.id}`}>
          <a className="border border-neutral-200 rounded p-3 flex justify-between items-center hover:bg-neutral-50 transition-colors">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${getOrgBgColor(program.industry)}`}>
                {getInitials(program.organizationName)}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-secondary">{program.organizationName}</div>
                <div className="text-xs text-neutral-500">Up to ${program.maxBounty.toLocaleString()} per bug</div>
              </div>
            </div>
            <ChevronRight className="text-neutral-400 h-5 w-5" />
          </a>
        </Link>
      ))}
    </div>
  );
}
