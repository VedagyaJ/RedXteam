import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Bug } from 'lucide-react';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative bg-dark overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-dark to-black opacity-90 z-0"></div>
      <div className="absolute inset-0 z-0 opacity-20">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          className="w-full h-full object-cover"
        >
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="md:flex md:items-center md:space-x-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              <span className="text-primary">KnowYourBug</span>, Reward Talent
            </h1>
            <p className="text-xl text-neutral-200 mb-8">
              Connect with ethical hackers worldwide to find and fix security vulnerabilities before they become threats.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-primary hover:bg-opacity-90">
                  <Link href={user?.role === 'organization' ? '/dashboard/organization' : '/dashboard/hacker'}>
                    <Shield className="mr-2 h-5 w-5" /> Go to Dashboard
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
            <div className="mt-8 flex flex-wrap gap-8">
              <div className="flex items-center">
                <div className="text-primary text-3xl font-bold mr-2">500+</div>
                <div className="text-neutral-300">Active Programs</div>
              </div>
              <div className="flex items-center">
                <div className="text-primary text-3xl font-bold mr-2">10k+</div>
                <div className="text-neutral-300">Ethical Hackers</div>
              </div>
              <div className="flex items-center">
                <div className="text-primary text-3xl font-bold mr-2">$8M+</div>
                <div className="text-neutral-300">Bounties Paid</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <svg 
                viewBox="0 0 800 600" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full rounded-lg bg-gradient-to-r from-gray-900 to-neutral-800"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E53935" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#5D4037" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="800" height="600" fill="url(#grad1)" fillOpacity="0.3" />
                <circle cx="400" cy="300" r="160" stroke="#E53935" strokeWidth="4" fillOpacity="0" />
                <path d="M400,140 L400,460 M240,300 L560,300" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.2" />
                <g transform="translate(310, 260)" fillOpacity="0.9">
                  <path d="M80,8 L80,32 L104,32 L104,56 L128,56 L128,80 L0,80 L0,56 L56,56 L56,32 L24,32 L24,8 Z" fill="#E53935" />
                </g>
                <g transform="translate(400, 300)" strokeWidth="2" stroke="#FFFFFF" strokeOpacity="0.3" fillOpacity="0">
                  <circle r="40" />
                  <circle r="80" />
                  <circle r="120" />
                </g>
                <text x="400" y="520" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="14">Cybersecurity Professional</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
