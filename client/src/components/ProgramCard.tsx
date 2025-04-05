import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Globe, ShoppingCart, Database } from 'lucide-react';
import { Program } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const getIconByIndustry = (industry?: string) => {
    switch (industry?.toLowerCase()) {
      case 'technology':
        return <Globe className="text-primary" />;
      case 'e-commerce':
        return <ShoppingCart className="text-primary" />;
      case 'finance':
        return <Database className="text-primary" />;
      default:
        return <Globe className="text-primary" />;
    }
  };

  const getUpdatedTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Get the highest reward amount
  const getHighestReward = () => {
    if (!program.rewards) return '0';
    
    const rewards = program.rewards as any;
    return rewards.critical || rewards.high || rewards.medium || rewards.low || '0';
  };

  return (
    <div className="bg-secondary rounded-lg p-6 shadow-lg hover:border hover:border-primary hover:border-opacity-30 transition-all">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mr-4">
          {program.logo ? (
            <img src={program.logo} alt={program.title} className="w-full h-full rounded-lg" />
          ) : (
            getIconByIndustry(program.industry)
          )}
        </div>
        <div>
          <h3 className="text-white font-semibold">{program.title}</h3>
          <p className="text-neutral-300 text-sm">{program.industry || 'Technology'}</p>
        </div>
      </div>
      <div className="mb-4 flex gap-2 flex-wrap">
        <Badge variant="outline" className="bg-primary bg-opacity-20 text-primary border-primary">
          Critical: ${getHighestReward()}
        </Badge>
        <Badge variant="outline" className="bg-green-500 bg-opacity-20 text-green-500 border-green-500">
          {program.status === 'active' ? 'Active' : program.status === 'inactive' ? 'Inactive' : 'Draft'}
        </Badge>
      </div>
      <p className="text-neutral-300 text-sm mb-4 line-clamp-2">
        {program.description}
      </p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <CalendarIcon className="text-neutral-300 h-4 w-4 mr-2" />
          <span className="text-neutral-300 text-sm">
            Updated {getUpdatedTime(new Date(program.updatedAt))}
          </span>
        </div>
        <Link 
          href={`/program/${program.id}`} 
          className="text-primary hover:underline text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
