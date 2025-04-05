import React from "react";
import { Link } from "wouter";
import { 
  CheckCircle, 
  ArrowRight, 
  Bell, 
  Settings, 
  UserCircle,
  CheckCircle2,
  InfoIcon,
  Clock,
  ChevronRight
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Powerful Dashboards for Organizations & Hackers
            </h2>
            <p className="text-neutral-600 mb-6">
              Our intuitive dashboards provide all the tools and insights you need to manage your security program or bug hunting activities effectively.
            </p>
            <ul className="space-y-4">
              <li className="flex">
                <CheckCircle className="text-green-500 h-5 w-5 mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary">Real-time Analytics</h3>
                  <p className="text-neutral-600">
                    Monitor program performance and vulnerability metrics at a glance.
                  </p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="text-green-500 h-5 w-5 mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary">Streamlined Communication</h3>
                  <p className="text-neutral-600">
                    Collaborate directly with security teams or researchers through our platform.
                  </p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="text-green-500 h-5 w-5 mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary">Reputation System</h3>
                  <p className="text-neutral-600">
                    Build your profile with verified findings and earn recognition badges.
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/register">
                <a className="text-primary font-medium hover:text-primary-dark inline-flex items-center">
                  Learn more about our dashboards <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-neutral-200">
              <div className="p-4 bg-secondary text-white flex items-center justify-between">
                <div className="font-medium">Hacker Dashboard</div>
                <div className="flex space-x-3">
                  <Bell className="h-5 w-5" />
                  <Settings className="h-5 w-5" />
                  <UserCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-100 rounded-lg p-4">
                    <div className="text-sm text-neutral-500">Active Hunts</div>
                    <div className="text-2xl font-bold text-secondary">12</div>
                  </div>
                  <div className="bg-neutral-100 rounded-lg p-4">
                    <div className="text-sm text-neutral-500">Submissions</div>
                    <div className="text-2xl font-bold text-secondary">48</div>
                  </div>
                  <div className="bg-neutral-100 rounded-lg p-4">
                    <div className="text-sm text-neutral-500">Earnings</div>
                    <div className="text-2xl font-bold text-secondary">$9,750</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-secondary mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border-l-4 border-green-400 p-3 flex">
                      <CheckCircle2 className="text-green-500 h-5 w-5 mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-green-800">Bug #4872 validated</div>
                        <div className="text-xs text-green-700">SecureCloud - $2,500 awarded</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 flex">
                      <InfoIcon className="text-blue-500 h-5 w-5 mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-blue-800">Bug #4891 needs more info</div>
                        <div className="text-xs text-blue-700">FinTech Banking - Awaiting details</div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 flex">
                      <Clock className="text-yellow-500 h-5 w-5 mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-yellow-800">Bug #4902 under review</div>
                        <div className="text-xs text-yellow-700">EcomMart - Submitted 2d ago</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-secondary mb-3">Recommended Programs</h3>
                  <div className="space-y-2">
                    <div className="border border-neutral-200 rounded p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 font-bold text-xs">
                          SC
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-secondary">SecureCloud</div>
                          <div className="text-xs text-neutral-500">Up to $10,000 per bug</div>
                        </div>
                      </div>
                      <ChevronRight className="text-neutral-400 h-5 w-5" />
                    </div>
                    <div className="border border-neutral-200 rounded p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs">
                          FB
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-secondary">FinTech Banking</div>
                          <div className="text-xs text-neutral-500">Up to $7,500 per bug</div>
                        </div>
                      </div>
                      <ChevronRight className="text-neutral-400 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
