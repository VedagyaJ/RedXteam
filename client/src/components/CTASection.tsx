import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Bug } from 'lucide-react';

const CTASection = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <section className="bg-dark py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary opacity-5 z-0"></div>
      <div className="absolute inset-0 z-0 opacity-10">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          className="w-full h-full object-cover"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Strengthen Your Security?</h2>
          <p className="text-xl text-neutral-300 mb-10">
            Join the RedXteam community and connect with ethical hackers who can help protect your organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-primary hover:bg-opacity-90">
                <Link href={user?.role === 'organization' ? '/dashboard/organization' : '/dashboard/hacker'}>
                  {user?.role === 'organization' ? (
                    <>
                      <Shield className="mr-2 h-5 w-5" /> Go to Dashboard
                    </>
                  ) : (
                    <>
                      <Bug className="mr-2 h-5 w-5" /> Find Programs
                    </>
                  )}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-primary hover:bg-opacity-90">
                  <Link href="/register?role=organization">
                    <Shield className="mr-2 h-5 w-5" /> Start a Program
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:bg-opacity-10">
                  <Link href="/register?role=hacker">
                    <Bug className="mr-2 h-5 w-5" /> Join as Hacker
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
