import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Program } from '@shared/schema';
import ProgramCard from '@/components/ProgramCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';
import { useLocation } from 'wouter';

const Programs = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  
  // Parse search params from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);

  // Fetch all programs
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ['/api/programs', searchQuery],
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    window.history.pushState({}, '', `/programs?q=${encodeURIComponent(searchQuery)}`);
  };

  // Filter programs based on industry and search query
  const filteredPrograms = programs?.filter(program => {
    const matchesIndustry = industryFilter === 'all' || program.industry === industryFilter;
    const matchesSearch = !searchQuery || 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesIndustry && matchesSearch;
  });

  // Get unique industries for filter
  const industries = programs ? 
    ['all', ...new Set(programs.map(p => p.industry).filter(Boolean) as string[])] :
    ['all'];

  return (
    <div className="bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Bug Bounty Programs</h1>
          <p className="text-neutral-300 max-w-3xl">
            Browse active security programs and find vulnerabilities that match your expertise.
            Each program includes scope details and reward structures.
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-secondary rounded-lg p-6 mb-10 border border-neutral-800">
          <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-12">
            <div className="relative md:col-span-6">
              <Input
                type="text"
                placeholder="Search programs by name, description, technology..."
                className="bg-dark border-neutral-800 text-white pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Search className="h-4 w-4 text-neutral-300" />
              </button>
            </div>
            
            <div className="md:col-span-3">
              <Select 
                value={industryFilter} 
                onValueChange={setIndustryFilter}
              >
                <SelectTrigger className="bg-dark border-neutral-800 text-white">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-opacity-90">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </form>
        </div>

        {/* Programs grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-secondary rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg bg-neutral-800 mr-4" />
                  <div>
                    <Skeleton className="h-5 w-32 bg-neutral-800 mb-1" />
                    <Skeleton className="h-4 w-24 bg-neutral-800" />
                  </div>
                </div>
                <div className="mb-4 flex gap-2">
                  <Skeleton className="h-5 w-24 bg-neutral-800" />
                  <Skeleton className="h-5 w-16 bg-neutral-800" />
                </div>
                <Skeleton className="h-4 w-full bg-neutral-800 mb-2" />
                <Skeleton className="h-4 w-4/5 bg-neutral-800 mb-4" />
                <div className="flex items-center justify-between mt-4">
                  <Skeleton className="h-4 w-32 bg-neutral-800" />
                  <Skeleton className="h-4 w-24 bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredPrograms && filteredPrograms.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map(program => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary rounded-lg border border-neutral-800">
                <div className="mx-auto w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No programs found</h3>
                <p className="text-neutral-400 max-w-md mx-auto">
                  We couldn't find any programs matching your criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Programs;
