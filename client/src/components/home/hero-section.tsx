import React from "react";
import { Link } from "wouter";
import { User, UserType } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  user: Omit<User, "password"> | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative bg-secondary py-16 sm:py-24">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              <span className="gradient-text bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">KnowYourBug,</span>
              <br />
              <span className="text-white">Reward Talent</span>
            </h1>
            <p className="text-neutral-300 text-lg mb-8 max-w-xl">
              Connect with a global community of ethical hackers to detect and mitigate security vulnerabilities. Strengthen your defenses while celebrating expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button asChild className="px-6 py-6 h-auto">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="px-6 py-6 h-auto">
                    <Link href="/register">Join as a Hacker</Link>
                  </Button>
                  <Button asChild variant="outline" className="px-6 py-6 h-auto text-primary border-primary hover:bg-primary/10">
                    <Link href="/register">List Your Program</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center">
                  <span className="text-xs font-medium">AW</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center">
                  <span className="text-xs font-medium">SC</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center">
                  <span className="text-xs font-medium">MJ</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-neutral-300">
                  Joined by <span className="font-medium text-white">5,000+</span> security researchers
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-secondary-light rounded-xl overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-gray-800 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                </div>
                <div className="ml-4 text-xs text-neutral-400 font-mono">
                  vulnerability.report
                </div>
              </div>
              <div className="p-6 text-neutral-300">
                <div className="font-mono text-sm leading-6">
                  <div className="text-primary-light"># Security Vulnerability Report</div>
                  <div className="mt-3">
                    <span className="text-purple-400">class</span> <span className="text-blue-400">VulnerabilityReport</span>:
                  </div>
                  <div className="pl-4">
                    <div><span className="text-primary">def</span> <span className="text-blue-400">__init__</span>(self):</div>
                    <div className="pl-4">
                      <div>self.title = <span className="text-green-400">"Authentication Bypass"</span></div>
                      <div>self.severity = <span className="text-green-400">"High"</span></div>
                      <div>self.reward = <span className="text-yellow-400">5000</span></div>
                      <div>self.status = <span className="text-green-400">"Verified"</span></div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-primary">def</span> <span className="text-blue-400">reproduce</span>(self):
                  </div>
                  <div className="pl-4">
                    <div><span className="text-neutral-400"># Steps to reproduce...</span></div>
                    <div>steps = [<span className="text-green-400">"Intercept request"</span>,</div>
                    <div className="pl-10"><span className="text-green-400">"Modify auth header"</span>,</div>
                    <div className="pl-10"><span className="text-green-400">"Access restricted area"</span>]</div>
                  </div>
                </div>
                <div className="mt-6 bg-primary/10 border border-primary/30 rounded p-3">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary h-5 w-5"
                    >
                      <path d="M12 2v6m0 0v10m0-10h5a5 5 0 0 1 0 10h-5"></path>
                    </svg>
                    <div className="ml-3">
                      <div className="text-sm text-neutral-200">Bounty Awarded</div>
                      <div className="text-lg font-semibold text-white">$5,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full filter blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full filter blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
