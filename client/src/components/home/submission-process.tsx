import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "1",
    title: "Find a Program",
    description: "Browse available programs and select one that matches your skills."
  },
  {
    number: "2",
    title: "Discover a Vulnerability",
    description: "Test the target within scope and identify security issues."
  },
  {
    number: "3",
    title: "Submit Report",
    description: "Create a detailed report with clear reproduction steps."
  },
  {
    number: "4",
    title: "Get Rewarded",
    description: "Receive bounties and recognition for valid findings."
  }
];

export default function SubmissionProcess() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">How to Submit a Bug</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our streamlined process makes it easy to report vulnerabilities and get rewarded
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/programs">Start Hunting</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
