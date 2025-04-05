import React from "react";
import { Link } from "wouter";
import { 
  ShieldAlert, 
  Bug, 
  GraduationCap, 
  ArrowRight 
} from "lucide-react";

const features = [
  {
    icon: <ShieldAlert className="text-primary text-xl" />,
    title: "For Organizations",
    description: "Launch bug bounty programs and connect with skilled security researchers to identify vulnerabilities before they're exploited.",
    link: "/register",
  },
  {
    icon: <Bug className="text-primary text-xl" />,
    title: "For Hackers",
    description: "Find bug bounty programs, submit vulnerabilities, and earn rewards while building your reputation in the security community.",
    link: "/register",
  },
  {
    icon: <GraduationCap className="text-primary text-xl" />,
    title: "Resources",
    description: "Access educational materials, best practices, and guidelines to improve your security posture or hacking skills.",
    link: "/resources",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">How RedXteam Works</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our platform brings together organizations and ethical hackers to create a safer digital ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
              <p className="text-neutral-600 mb-4">{feature.description}</p>
              <Link href={feature.link}>
                <a className="text-primary font-medium hover:text-primary-dark inline-flex items-center">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
