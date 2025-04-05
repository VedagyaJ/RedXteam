import { Link } from 'wouter';
import { 
  Network, Search, Trophy 
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How RedXteam Works</h2>
          <p className="text-neutral-300 max-w-3xl mx-auto">
            Our platform connects organizations with ethical hackers to identify vulnerabilities before malicious actors can exploit them.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-secondary rounded-lg p-6 shadow-lg border border-neutral-800">
            <div className="rounded-full bg-primary bg-opacity-10 w-14 h-14 flex items-center justify-center mb-5">
              <Network className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Create a Program</h3>
            <p className="text-neutral-300 mb-4">
              Define your scope, set attractive bounties, and specify what vulnerabilities you're looking for.
            </p>
            <div className="mt-auto pt-4">
              <Link href="/register?role=organization" className="text-primary hover:text-opacity-90 font-medium flex items-center">
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-secondary rounded-lg p-6 shadow-lg border border-neutral-800">
            <div className="rounded-full bg-primary bg-opacity-10 w-14 h-14 flex items-center justify-center mb-5">
              <Search className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Bug Discovery</h3>
            <p className="text-neutral-300 mb-4">
              Skilled ethical hackers test your systems and report vulnerabilities through our secure platform.
            </p>
            <div className="mt-auto pt-4">
              <Link href="/programs" className="text-primary hover:text-opacity-90 font-medium flex items-center">
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-secondary rounded-lg p-6 shadow-lg border border-neutral-800">
            <div className="rounded-full bg-primary bg-opacity-10 w-14 h-14 flex items-center justify-center mb-5">
              <Trophy className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Reward Talent</h3>
            <p className="text-neutral-300 mb-4">
              Review findings, validate issues, and reward researchers based on the severity of their discoveries.
            </p>
            <div className="mt-auto pt-4">
              <Link href="/register?role=hacker" className="text-primary hover:text-opacity-90 font-medium flex items-center">
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
