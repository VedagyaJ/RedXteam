import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, FileText, Shield, Terminal, 
  Code, Database, Server, Globe, Video
} from 'lucide-react';

const Resources = () => {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Security Resources</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Improve your security skills with these curated resources for both hackers and organizations.
          </p>
        </div>
        
        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="bg-secondary w-full flex justify-center mb-8">
            <TabsTrigger value="guides" className="data-[state=active]:bg-primary">
              <BookOpen className="mr-2 h-4 w-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-primary">
              <Terminal className="mr-2 h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="best-practices" className="data-[state=active]:bg-primary">
              <Shield className="mr-2 h-4 w-4" />
              Best Practices
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary">
              <Video className="mr-2 h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                title="Web Application Security Testing" 
                description="Learn how to identify and exploit common web vulnerabilities."
                icon={<Globe className="h-8 w-8 text-primary" />}
                tags={["OWASP Top 10", "XSS", "SQL Injection"]}
              />
              <ResourceCard 
                title="API Security Testing Guide" 
                description="Methods and techniques for finding vulnerabilities in RESTful and GraphQL APIs."
                icon={<Code className="h-8 w-8 text-primary" />}
                tags={["REST", "GraphQL", "Authentication"]}
              />
              <ResourceCard 
                title="Mobile Application Security" 
                description="Comprehensive guide for testing Android and iOS applications."
                icon={<FileText className="h-8 w-8 text-primary" />}
                tags={["Android", "iOS", "Client-side"]}
              />
              <ResourceCard 
                title="Cloud Infrastructure Testing" 
                description="Security testing techniques for AWS, Azure, and GCP environments."
                icon={<Server className="h-8 w-8 text-primary" />}
                tags={["AWS", "Azure", "GCP"]}
              />
              <ResourceCard 
                title="Writing Effective Bug Reports" 
                description="How to document vulnerabilities clearly for maximum impact and rewards."
                icon={<FileText className="h-8 w-8 text-primary" />}
                tags={["Documentation", "Communication"]}
              />
              <ResourceCard 
                title="Authentication Bypass Techniques" 
                description="Advanced methods for testing authentication mechanisms."
                icon={<Shield className="h-8 w-8 text-primary" />}
                tags={["Authentication", "Session Management"]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                title="Burp Suite" 
                description="The leading toolkit for web application security testing."
                icon={<Terminal className="h-8 w-8 text-primary" />}
                tags={["Web Testing", "Proxy", "Scanner"]}
              />
              <ResourceCard 
                title="OWASP ZAP" 
                description="Free open-source web app scanner for finding vulnerabilities."
                icon={<Shield className="h-8 w-8 text-primary" />}
                tags={["Open Source", "Automated", "Scanner"]}
              />
              <ResourceCard 
                title="Metasploit Framework" 
                description="Advanced open-source platform for developing, testing, and executing exploits."
                icon={<Terminal className="h-8 w-8 text-primary" />}
                tags={["Exploitation", "Framework", "Penetration Testing"]}
              />
              <ResourceCard 
                title="Amass" 
                description="Tool for network mapping of attack surfaces and external asset discovery."
                icon={<Globe className="h-8 w-8 text-primary" />}
                tags={["Reconnaissance", "OSINT", "Network Mapping"]}
              />
              <ResourceCard 
                title="Nuclei" 
                description="Fast and customizable vulnerability scanner based on simple YAML templates."
                icon={<Database className="h-8 w-8 text-primary" />}
                tags={["Templates", "Fast", "Customizable"]}
              />
              <ResourceCard 
                title="SQLmap" 
                description="Automatic SQL injection detection and exploitation tool."
                icon={<Code className="h-8 w-8 text-primary" />}
                tags={["SQL Injection", "Automation", "Database"]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="best-practices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                title="Secure SDLC Implementation" 
                description="Integrating security into every phase of the software development lifecycle."
                icon={<Shield className="h-8 w-8 text-primary" />}
                tags={["SDLC", "DevSecOps", "Shift Left"]}
              />
              <ResourceCard 
                title="Creating an Effective Bug Bounty Program" 
                description="Best practices for setting up and managing a successful bug bounty program."
                icon={<FileText className="h-8 w-8 text-primary" />}
                tags={["Program Management", "Scope", "Rewards"]}
              />
              <ResourceCard 
                title="Responsible Disclosure" 
                description="Guidelines for ethical security research and vulnerability disclosure."
                icon={<Shield className="h-8 w-8 text-primary" />}
                tags={["Ethics", "Disclosure", "Communication"]}
              />
              <ResourceCard 
                title="Secure Coding Guidelines" 
                description="Language-specific practices for writing secure code from the start."
                icon={<Code className="h-8 w-8 text-primary" />}
                tags={["Coding", "Prevention", "Languages"]}
              />
              <ResourceCard 
                title="Incident Response Planning" 
                description="Preparing your organization to handle security incidents effectively."
                icon={<Shield className="h-8 w-8 text-primary" />}
                tags={["Incident Response", "Planning", "Recovery"]}
              />
              <ResourceCard 
                title="Security Testing Checklists" 
                description="Comprehensive checklists for different security testing scenarios."
                icon={<FileText className="h-8 w-8 text-primary" />}
                tags={["Checklist", "Methodology", "Coverage"]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                title="Web Hacking Fundamentals" 
                description="Video series covering the basics of web application security testing."
                icon={<Video className="h-8 w-8 text-primary" />}
                tags={["Beginner", "Web", "Hands-on"]}
              />
              <ResourceCard 
                title="Advanced Exploitation Techniques" 
                description="Deep dive into sophisticated vulnerability exploitation methods."
                icon={<Video className="h-8 w-8 text-primary" />}
                tags={["Advanced", "Exploitation", "Techniques"]}
              />
              <ResourceCard 
                title="Cloud Security Masterclass" 
                description="Comprehensive guide to securing cloud environments and infrastructure."
                icon={<Video className="h-8 w-8 text-primary" />}
                tags={["Cloud", "AWS", "Azure", "GCP"]}
              />
              <ResourceCard 
                title="Mobile App Pentesting" 
                description="Step-by-step tutorials for testing mobile application security."
                icon={<Video className="h-8 w-8 text-primary" />}
                tags={["Mobile", "Android", "iOS"]}
              />
              <ResourceCard 
                title="Ethical Hacking for Beginners" 
                description="Introduction to ethical hacking and security research for newcomers."
                icon={<Video className="h-8 w-8 text-primary" />}
                tags={["Beginner", "Fundamentals", "Ethics"]}
              />
              <ResourceCard 
                title="Bug Bounty Hunting Live" 
                description="Real-time demonstrations of finding and reporting vulnerabilities."
                icon={<Video className="h-8 w-8 text-primary" />}
                tags={["Live", "Demonstrations", "Real-world"]}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 bg-secondary rounded-lg p-8 border border-neutral-800">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">Join Our Security Community</h2>
              <p className="text-neutral-300 mb-6">
                Connect with fellow security researchers and organizations. Share knowledge, ask questions, and stay updated on the latest security trends.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary hover:bg-opacity-90">
                  Join Discord
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:bg-opacity-10">
                  Follow on Twitter
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-1/3">
              <svg
                viewBox="0 0 400 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full rounded-lg bg-dark"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E53935" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#5D4037" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="400" height="200" fill="url(#grad1)" fillOpacity="0.3" />
                <circle cx="200" cy="100" r="60" stroke="#E53935" strokeWidth="4" fillOpacity="0" />
                <g transform="translate(170, 80)">
                  <path d="M30,4 L30,12 L38,12 L38,20 L46,20 L46,28 L0,28 L0,20 L22,20 L22,12 L12,12 L12,4 Z" fill="#E53935" />
                </g>
                <text x="200" y="170" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="12">Security Community</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  title, 
  description, 
  icon,
  tags
}) => {
  return (
    <Card className="bg-secondary border-neutral-800 hover:border-primary hover:border-opacity-50 transition-all">
      <CardHeader>
        <div className="flex items-start">
          <div className="mr-4">
            {icon}
          </div>
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-neutral-300 mb-4">{description}</CardDescription>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <div key={i} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded-full">
              {tag}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Resources;
