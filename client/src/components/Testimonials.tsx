import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Community Says</h2>
          <p className="text-neutral-300 max-w-3xl mx-auto">
            Hear from organizations and hackers who have experienced success on our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <Card className="bg-secondary border-neutral-800 relative">
            <CardContent className="p-6">
              <div className="absolute -top-4 -left-4 text-5xl text-primary opacity-30">
                <Quote className="h-10 w-10" />
              </div>
              <div className="relative z-10">
                <p className="text-neutral-200 italic mb-6">
                  RedXteam has transformed our security posture. The quality of vulnerabilities reported has been impressive, and the platform makes it easy to manage our program.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center mr-4">
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full rounded-full"
                    >
                      <rect width="40" height="40" rx="20" fill="#E53935" fillOpacity="0.2" />
                      <path d="M20 12C16.13 12 13 15.13 13 19C13 21.57 14.46 23.78 16.62 24.79C16.5 25.39 16.27 26.28 15.73 27C17.23 26.89 18.47 26.22 19.41 25.21C19.6 25.23 19.8 25.24 20 25.24C23.87 25.24 27 22.11 27 18.24C27 14.37 23.87 12 20 12Z" fill="#E53935" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Michael Rodriguez</h4>
                    <p className="text-neutral-400 text-sm">CISO, TechCorp</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Testimonial 2 */}
          <Card className="bg-secondary border-neutral-800 relative">
            <CardContent className="p-6">
              <div className="absolute -top-4 -left-4 text-5xl text-primary opacity-30">
                <Quote className="h-10 w-10" />
              </div>
              <div className="relative z-10">
                <p className="text-neutral-200 italic mb-6">
                  As a security researcher, RedXteam offers me the best programs with clear scopes and fast payouts. I've built a reputation here that has advanced my career.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center mr-4">
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full rounded-full"
                    >
                      <rect width="40" height="40" rx="20" fill="#E53935" fillOpacity="0.2" />
                      <path d="M20 12C16.13 12 13 15.13 13 19C13 21.57 14.46 23.78 16.62 24.79C16.5 25.39 16.27 26.28 15.73 27C17.23 26.89 18.47 26.22 19.41 25.21C19.6 25.23 19.8 25.24 20 25.24C23.87 25.24 27 22.11 27 18.24C27 14.37 23.87 12 20 12Z" fill="#E53935" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Sarah Chen</h4>
                    <p className="text-neutral-400 text-sm">Security Researcher</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
