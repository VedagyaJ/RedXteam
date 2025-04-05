import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface LeaderboardUser extends Omit<User, "password"> {
  reportsCount: number;
  earnings: number;
}

export default function LeaderboardSection() {
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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

  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">Top Bug Hunters</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Meet our leading security researchers who are making the digital world safer
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-5 bg-secondary text-white grid grid-cols-12 gap-4">
            <div className="col-span-1 font-medium">#</div>
            <div className="col-span-5 font-medium">Researcher</div>
            <div className="col-span-2 font-medium text-center">Reports</div>
            <div className="col-span-2 font-medium text-center">Reputation</div>
            <div className="col-span-2 font-medium text-center">Earnings</div>
          </div>

          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 border-b border-neutral-200 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 font-semibold text-neutral-500">{i}</div>
                  <div className="col-span-5">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <Skeleton className="h-5 w-12 mx-auto" />
                  </div>
                  <div className="col-span-2 text-center">
                    <Skeleton className="h-5 w-20 mx-auto" />
                  </div>
                  <div className="col-span-2 text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </div>
                </div>
              ))}
            </>
          )}

          {error && (
            <div className="p-5 text-center text-red-500">
              Failed to load leaderboard data
            </div>
          )}

          {leaderboard && leaderboard.slice(0, 3).map((user, index) => (
            <div key={user.id} className="p-5 border-b border-neutral-200 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 font-semibold text-neutral-500">{index + 1}</div>
              <div className="col-span-5">
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
              </div>
              <div className="col-span-2 text-center font-medium">{user.reportsCount}</div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center">
                  {renderRating(user.reputation)}
                </div>
              </div>
              <div className="col-span-2 text-center font-medium">{formatCurrency(user.earnings)}</div>
            </div>
          ))}

          <div className="p-5 text-center">
            <Link href="/leaderboard">
              <a className="text-primary font-medium hover:text-primary-dark">
                View full leaderboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
