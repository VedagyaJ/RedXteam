import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, Cog, User, ChartLine,
} from 'lucide-react';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState<'organization' | 'hacker'>('organization');
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="bg-secondary py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-dark opacity-30"></div>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Dashboards for Everyone</h2>
          <p className="text-neutral-300 max-w-3xl mx-auto">
            Dedicated interfaces for both organizations and ethical hackers, providing the tools you need to succeed.
          </p>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="bg-dark inline-flex rounded-lg p-1">
            <Button
              variant={activeTab === 'organization' ? 'default' : 'ghost'}
              className={activeTab === 'organization' ? 'bg-primary text-white' : 'text-neutral-300 hover:text-white'}
              onClick={() => setActiveTab('organization')}
            >
              Organization View
            </Button>
            <Button
              variant={activeTab === 'hacker' ? 'default' : 'ghost'}
              className={activeTab === 'hacker' ? 'bg-primary text-white' : 'text-neutral-300 hover:text-white'}
              onClick={() => setActiveTab('hacker')}
            >
              Hacker View
            </Button>
          </div>
        </div>
        
        {/* Dashboard Preview */}
        <div className="bg-dark rounded-lg shadow-2xl overflow-hidden border border-neutral-800 transition-all">
          {/* Dashboard Header */}
          <div className="bg-neutral-800 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center">
                <Shield className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {activeTab === 'organization' ? 'Organization Dashboard' : 'Hacker Dashboard'}
                </h3>
                <p className="text-neutral-300 text-sm">
                  {activeTab === 'organization' ? 'TechCorp Security Program' : 'Security Hunter Profile'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:bg-opacity-10">
                <Cog className="mr-2 h-4 w-4" /> Settings
              </Button>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-neutral-300" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-secondary rounded-lg p-4 border border-neutral-800">
                <div className="text-neutral-300 text-sm mb-1">
                  {activeTab === 'organization' ? 'Total Reports' : 'Submitted Reports'}
                </div>
                <div className="text-white text-2xl font-bold">124</div>
                <div className="text-primary text-sm mt-1">+12% from last month</div>
              </div>
              <div className="bg-secondary rounded-lg p-4 border border-neutral-800">
                <div className="text-neutral-300 text-sm mb-1">
                  {activeTab === 'organization' ? 'Open Issues' : 'Accepted Reports'}
                </div>
                <div className="text-white text-2xl font-bold">28</div>
                <div className="text-primary text-sm mt-1">-4% from last month</div>
              </div>
              <div className="bg-secondary rounded-lg p-4 border border-neutral-800">
                <div className="text-neutral-300 text-sm mb-1">
                  {activeTab === 'organization' ? 'Rewards Paid' : 'Rewards Earned'}
                </div>
                <div className="text-white text-2xl font-bold">$45,250</div>
                <div className="text-primary text-sm mt-1">+18% from last month</div>
              </div>
              <div className="bg-secondary rounded-lg p-4 border border-neutral-800">
                <div className="text-neutral-300 text-sm mb-1">
                  {activeTab === 'organization' ? 'Active Hunters' : 'Reputation Score'}
                </div>
                <div className="text-white text-2xl font-bold">
                  {activeTab === 'organization' ? '86' : '750'}
                </div>
                <div className="text-primary text-sm mt-1">+7% from last month</div>
              </div>
            </div>
            
            {/* Chart Section */}
            <div className="bg-secondary rounded-lg p-6 border border-neutral-800 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-white">
                  {activeTab === 'organization' ? 'Vulnerability Trends' : 'Activity Overview'}
                </h4>
                <div className="inline-flex rounded-md p-1 bg-dark">
                  <Button variant="default" size="sm" className="bg-primary">Monthly</Button>
                  <Button variant="ghost" size="sm" className="text-neutral-300">Quarterly</Button>
                  <Button variant="ghost" size="sm" className="text-neutral-300">Yearly</Button>
                </div>
              </div>
              <div className="h-64 bg-dark bg-opacity-50 rounded flex items-center justify-center">
                <div className="text-center text-neutral-300">
                  <ChartLine className="h-12 w-12 mb-3 text-primary mx-auto" />
                  <p>{activeTab === 'organization' ? 'Vulnerability trends chart visualization' : 'Activity and rewards overview chart'}</p>
                </div>
              </div>
            </div>
            
            {/* Table Section */}
            <div className="bg-secondary rounded-lg p-6 border border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-white">
                  {activeTab === 'organization' ? 'Recent Vulnerability Reports' : 'Recent Submissions'}
                </h4>
                <Link href={isAuthenticated ? (user?.role === 'organization' ? '/dashboard/organization' : '/dashboard/hacker') : '/login'} className="text-primary text-sm">
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-transparent">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Severity</th>
                      {activeTab === 'organization' && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Reporter</th>
                      )}
                      {activeTab === 'hacker' && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Program</th>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-800 hover:bg-neutral-800">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">#VUL-2843</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-200">SQL Injection in Search API</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 bg-opacity-20 text-red-500">
                          Critical
                        </span>
                      </td>
                      {activeTab === 'organization' && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
                              <User className="h-3 w-3 text-neutral-300" />
                            </div>
                            <span>hunter426</span>
                          </div>
                        </td>
                      )}
                      {activeTab === 'hacker' && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                          TechCorp Security
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
                          Pending Review
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">Aug 28, 2023</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <button className="text-primary hover:text-primary-dark">View Details</button>
                      </td>
                    </tr>
                    
                    <tr className="border-b border-neutral-800 hover:bg-neutral-800">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">#VUL-2842</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-200">Authentication Bypass</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 bg-opacity-20 text-red-500">
                          Critical
                        </span>
                      </td>
                      {activeTab === 'organization' && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
                              <User className="h-3 w-3 text-neutral-300" />
                            </div>
                            <span>securehunter</span>
                          </div>
                        </td>
                      )}
                      {activeTab === 'hacker' && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                          ShopSafe E-commerce
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 bg-opacity-20 text-green-500">
                          Validated
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">Aug 25, 2023</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <button className="text-primary hover:text-primary-dark">View Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
