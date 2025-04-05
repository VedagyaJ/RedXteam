import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { Trophy, Award, TrendingUp } from "lucide-react";

interface LeaderboardUser extends Omit<User, "password"> {
  reportsCount: number;
  earnings: number;
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<string>("all-time");
  
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // For a real implementation, we would have different API endpoints for different timeframes
  // Here we're just using the same data for demonstration
  
  const renderTopThreeSection = () => {
    if (isLoading || !leaderboard || leaderboard.length === 0) return null;
    
    const topThree = leaderboard.slice(0, 3);
    
    return (
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* 2nd Place */}
          <div className="order-1 md:order-1">
            <div className="bg-white border border-neutral-200 rounded-lg p-5 text-center h-full shadow-sm">
              <Badge variant="secondary" className="mb-3">2nd Place</Badge>
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-medium">
                  {topThree[1]?.fullName.split(" ").map(n => n[0]).join("").toUpperCase() || ""}
                </span>
              </div>
              <h3 className="text-lg font-medium text-secondary">{topThree[1]?.fullName || ""}</h3>
              <p className="text-neutral-500 mb-3">@{topThree[1]?.username || ""}</p>
              <div className="flex justify-around">
                <div>
                  <p className="text-sm text-neutral-500">Reports</p>
                  <p className="text-xl font-semibold">{topThree[1]?.reportsCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Earnings</p>
                  <p className="text-xl font-semibold">${topThree[1]?.earnings.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="order-0 md:order-0">
            <div className="bg-primary/5 border border-primary/30 rounded-lg p-5 text-center h-full shadow-md transform md:-translate-y-4">
              <Badge variant="primary" className="mb-3">1st Place</Badge>
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-primary/20">
                <span className="text-2xl font-bold text-primary">
                  {topThree[0]?.fullName.split(" ").map(n => n[0]).join("").toUpperCase() || ""}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-secondary">{topThree[0]?.fullName || ""}</h3>
              <p className="text-neutral-500 mb-3">@{topThree[0]?.username || ""}</p>
              <div className="flex justify-around">
                <div>
                  <p className="text-sm text-neutral-500">Reports</p>
                  <p className="text-2xl font-bold">{topThree[0]?.reportsCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Earnings</p>
                  <p className="text-2xl font-bold">${topThree[0]?.earnings.toLocaleString() || 0}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 mt-3">
                <Trophy className="h-3 w-3 mr-1" /> Top Hacker
              </Badge>
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="order-2 md:order-2">
            <div className="bg-white border border-neutral-200 rounded-lg p-5 text-center h-full shadow-sm">
              <Badge variant="secondary" className="mb-3">3rd Place</Badge>
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-medium">
                  {topThree[2]?.fullName.split(" ").map(n => n[0]).join("").toUpperCase() || ""}
                </span>
              </div>
              <h3 className="text-lg font-medium text-secondary">{topThree[2]?.fullName || ""}</h3>
              <p className="text-neutral-500 mb-3">@{topThree[2]?.username || ""}</p>
              <div className="flex justify-around">
                <div>
                  <p className="text-sm text-neutral-500">Reports</p>
                  <p className="text-xl font-semibold">{topThree[2]?.reportsCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Earnings</p>
                  <p className="text-xl font-semibold">${topThree[2]?.earnings.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-3">Bug Hunter Leaderboard</h1>
        <p className="text-neutral-600 max-w-3xl">
          Meet the top security researchers who are making the digital world safer. Rankings are based on the number and quality of valid vulnerabilities reported.
        </p>
      </div>
      
      <Tabs defaultValue="all-time" onValueChange={setTimeframe} className="mb-6">
        <TabsList>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="this-month">This Month</TabsTrigger>
          <TabsTrigger value="this-week">This Week</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Top 3 Podium */}
      {renderTopThreeSection()}
      
      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Full Leaderboard
          </CardTitle>
          <CardDescription>
            {timeframe === 'all-time' && 'All-time top security researchers ranked by reputation and earnings'}
            {timeframe === 'this-month' && 'This month\'s top security researchers ranked by reputation and earnings'}
            {timeframe === 'this-week' && 'This week\'s top security researchers ranked by reputation and earnings'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable 
            leaderboard={leaderboard || []} 
            isLoading={isLoading} 
            error={error as Error} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
