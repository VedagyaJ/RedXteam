import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ResourceCard from "@/components/resources/resource-card";
import { Search, BookOpen, FileText, GraduationCap } from "lucide-react";

interface ResourceWithAuthor extends Resource {
  authorName: string;
}

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const { data: resources, isLoading, error } = useQuery<ResourceWithAuthor[]>({
    queryKey: ["/api/resources"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredResources = resources?.filter(resource => {
    // Match by search term in title or description
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Match by category filter (if any)
    const matchesCategory = !categoryFilter || resource.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = resources 
    ? Array.from(new Set(resources.map(r => r.category)))
    : [];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-3">Security Resources</h1>
        <p className="text-neutral-600 max-w-3xl mb-6">
          Expand your knowledge with educational materials, best practices, and guidelines to improve your security posture or hacking skills.
        </p>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search resources by title, description, or author..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Resources</h3>
            <p className="text-red-600">An error occurred while loading resources. Please try again later.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && filteredResources && filteredResources.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <BookOpen className="h-12 w-12 text-neutral-300 mb-4" />
            <h3 className="text-lg font-medium text-secondary mb-1">No Matching Resources</h3>
            <p className="text-neutral-500 text-center max-w-md">
              We couldn't find any resources matching your search criteria. Try adjusting your search terms or category filter.
            </p>
          </CardContent>
        </Card>
      )}

      {filteredResources && filteredResources.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      {/* Featured resources section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-secondary mb-6">Learning Paths</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Web Application Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Learn how to identify and exploit common web vulnerabilities like XSS, CSRF, SQL Injection, and more.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>OWASP Top 10 Vulnerabilities</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Client-Side Security Testing</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span>Authentication & Session Management</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                API Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Discover approaches for testing REST, GraphQL, and SOAP APIs for security vulnerabilities.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>API Authentication Methods</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Authorization Flaws</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Injection in API Contexts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Mobile Application Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Master the techniques for testing Android and iOS applications for security vulnerabilities.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>App Reverse Engineering</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Insecure Data Storage</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Client-Side Injection Flaws</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
