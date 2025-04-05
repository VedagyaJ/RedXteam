import React from "react";
import { User } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface LeaderboardUser extends Omit<User, "password"> {
  reportsCount: number;
  earnings: number;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardUser[];
  isLoading: boolean;
  error: Error | null;
}

export default function LeaderboardTable({ leaderboard, isLoading, error }: LeaderboardTableProps) {
  // Helper function to render rating stars
  const renderRating = (reputation: number) => {
    // Convert reputation (0-100) to stars (0-5)
    const stars = (reputation / 100) * 5;
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 >= 0.5;
    
    return (
      <div className="flex">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={i} className="text-yellow-400 fill-current" size={16} />
        ))}
        {hasHalfStar && (
          <StarHalf className="text-yellow-400 fill-current" size={16} />
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={i} className="text-yellow-400" size={16} />
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        <p>Error loading leaderboard data.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Researcher</TableHead>
            <TableHead className="text-center">Reports</TableHead>
            <TableHead className="text-center">Reputation</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(10).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-20 mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : leaderboard.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                No leaderboard data available
              </TableCell>
            </TableRow>
          ) : (
            leaderboard.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {user.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-secondary">{user.fullName}</div>
                      <div className="text-sm text-neutral-500">@{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{user.reportsCount}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {renderRating(user.reputation)}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(user.earnings)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
