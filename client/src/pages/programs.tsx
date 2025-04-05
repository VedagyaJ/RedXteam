import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProgramCard from "@/components/programs/program-card";
import { Search } from "lucide-react";

interface ProgramWithDetails extends Program {
  tags: string[];
  organizationName: string;
}

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);

  const { data: programs, isLoading, error } = useQuery<ProgramWithDetails[]>({
    queryKey: ["/api/programs"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (programs) {
      // Extract unique industries from programs
      const uniqueIndustries = Array.from(new Set(programs.map(prog => prog.industry)));
      setIndustries(uniqueIndustries);
    }
  }, [programs]);

  const filteredPrograms = programs?.filter(program => {
    // Match by search term in title or description
    const matchesSearch = 
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Match by industry filter (if any)
    const matchesIndustry = !industryFilter || program.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-6">Bug Bounty Programs</h1>
        <p className="text-neutral-600 mb-8 max-w-3xl">
          Explore available bug bounty programs across various industries. Find opportunities that match your skills and start hunting for vulnerabilities.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search programs by name, description, or organization..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={industryFilter || ""}
              onChange={e => setIndustryFilter(e.target.value || null)}
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-neutral-200 rounded-lg shadow-sm p-5">
              <div className="flex items-center mb-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="ml-3 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-12 w-20" />
                  <Skeleton className="h-12 w-20" />
                  <Skeleton className="h-12 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">Failed to load programs. Please try again later.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {filteredPrograms && filteredPrograms.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-secondary mb-2">No Matching Programs</h3>
            <p className="text-neutral-500 text-center max-w-md">
              We couldn't find any programs matching your search criteria. Try adjusting your filters or check back later.
            </p>
            {(searchTerm || industryFilter) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setIndustryFilter(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {filteredPrograms && filteredPrograms.length > 0 && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-neutral-500">{filteredPrograms.length} programs available</p>
            <div className="flex gap-2">
              {industryFilter && (
                <Badge variant="outline" className="flex gap-2 items-center">
                  {industryFilter}
                  <button 
                    onClick={() => setIndustryFilter(null)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
