import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:px-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to secure your applications?
                </h2>
                <p className="text-white/80 mb-6">
                  Join thousands of organizations and ethical hackers on our platform. Start finding and fixing critical security vulnerabilities today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="secondary" className="bg-white text-primary hover:bg-neutral-100 border-none">
                    <Link href="/register">Start a Program</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/register">Join as a Hacker</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="rounded-lg h-64 bg-primary-dark flex items-center justify-center overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/10">
                    <path d="M9 12l-5 -5v5l5 5z"></path>
                    <path d="M15 12l5 -5v5l-5 5z"></path>
                    <path d="M5 12v-5h5"></path>
                    <path d="M19 12v-5h-5"></path>
                    <path d="M5 12v5h5"></path>
                    <path d="M19 12v5h-5"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
