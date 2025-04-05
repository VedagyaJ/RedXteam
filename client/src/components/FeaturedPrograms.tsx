import { useQuery } from '@tanstack/react-query';
import ProgramCard from './ProgramCard';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Program } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedPrograms = () => {
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ['/api/programs'],
  });

  const featuredPrograms = programs 
    ? programs.filter(program => program.status === 'active').slice(0, 3)
    : [];

  return (
    <section className="bg-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white">Featured Programs</h2>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:bg-opacity-10">
            <Link href="/programs">View All Programs</Link>
          </Button>
        </div>
        
        {/* Programs Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
            
            {featuredPrograms.length === 0 && (
              <div className="col-span-3 bg-secondary rounded-lg p-6 shadow-lg text-center">
                <p className="text-neutral-300">No active programs found. Check back later!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPrograms;
