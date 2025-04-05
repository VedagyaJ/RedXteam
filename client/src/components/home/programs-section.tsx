import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProgramCard from "@/components/programs/program-card";

interface ProgramWithDetails extends Program {
  tags: string[];
  organizationName: string;
}

export default function ProgramsSection() {
  const { data: programs, isLoading, error } = useQuery<ProgramWithDetails[]>({
    queryKey: ["/api/programs/popular"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">Popular Programs</h2>
          <Link href="/programs">
            <a className="text-primary font-medium hover:text-primary-dark inline-flex items-center">
              View all programs <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load programs</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {programs && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
