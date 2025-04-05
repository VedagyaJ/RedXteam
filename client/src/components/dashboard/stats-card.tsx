import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  isLoading?: boolean;
  isCurrency?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  isLoading = false,
  isCurrency = false,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            {icon}
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <div className="text-3xl font-bold text-secondary">
            {isCurrency ? formatCurrency(value) : value.toLocaleString()}
          </div>
        )}
        <p className="text-xs text-neutral-500">{description}</p>
      </CardContent>
    </Card>
  );
}
