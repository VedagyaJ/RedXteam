import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, change, isLoading = false }: StatCardProps) => {
  if (isLoading) {
    return (
      <Card className="bg-secondary border-neutral-800">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 bg-neutral-800 mb-2" />
          <Skeleton className="h-7 w-16 bg-neutral-800 mb-2" />
          <Skeleton className="h-4 w-20 bg-neutral-800" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary border-neutral-800">
      <CardContent className="p-4">
        <div className="text-neutral-300 text-sm mb-1">{title}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
        {change && <div className="text-primary text-sm mt-1">{change}</div>}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  stats: {
    totalReports?: number;
    openIssues?: number;
    rewards?: number;
    activeHunters?: number;
    // For hackers
    submittedReports?: number;
    acceptedReports?: number;
    rewardsEarned?: number;
    reputation?: number;
  };
  type: 'organization' | 'hacker';
  isLoading?: boolean;
}

const DashboardStats = ({ stats, type, isLoading = false }: DashboardStatsProps) => {
  if (type === 'organization') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Reports"
          value={stats.totalReports || 0}
          change="+12% from last month"
          isLoading={isLoading}
        />
        <StatCard
          title="Open Issues"
          value={stats.openIssues || 0}
          change="-4% from last month"
          isLoading={isLoading}
        />
        <StatCard
          title="Rewards Paid"
          value={`$${stats.rewards || 0}`}
          change="+18% from last month"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Hunters"
          value={stats.activeHunters || 0}
          change="+7% from last month"
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Submitted Reports"
        value={stats.submittedReports || 0}
        change="+8% from last month"
        isLoading={isLoading}
      />
      <StatCard
        title="Accepted Reports"
        value={stats.acceptedReports || 0}
        change="+15% from last month"
        isLoading={isLoading}
      />
      <StatCard
        title="Rewards Earned"
        value={`$${stats.rewardsEarned || 0}`}
        change="+24% from last month"
        isLoading={isLoading}
      />
      <StatCard
        title="Reputation Score"
        value={stats.reputation || 0}
        change="+5% from last month"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardStats;
