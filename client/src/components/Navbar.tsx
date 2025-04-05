import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Search, Menu, Bug, User, LogOut, 
  Shield, ChevronDown, Home, BookOpen 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/programs?q=${encodeURIComponent(searchQuery)}`;
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'organization' 
      ? '/dashboard/organization' 
      : '/dashboard/hacker';
  };

  const isActive = (path: string) => {
    return location === path ? 'active' : '';
  };

  return (
    <nav className="bg-dark border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Bug className="text-primary h-6 w-6 mr-2" />
                <span className="text-white font-bold text-xl">RedXteam</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className={`text-neutral-300 hover:text-white transition-colors px-4 py-2 ${isActive('/') ? 'text-white border-b-2 border-primary' : ''}`}
                >
                  Home
                </Link>
                <Link 
                  href="/programs" 
                  className={`text-neutral-300 hover:text-white transition-colors px-4 py-2 ${isActive('/programs') ? 'text-white border-b-2 border-primary' : ''}`}
                >
                  Programs
                </Link>
                <Link 
                  href="/resources" 
                  className={`text-neutral-300 hover:text-white transition-colors px-4 py-2 ${isActive('/resources') ? 'text-white border-b-2 border-primary' : ''}`}
                >
                  Resources
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search programs..."
                  className="bg-neutral-800 text-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                >
                  <Search className="h-4 w-4 text-neutral-300" />
                </button>
              </form>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-4 flex items-center">
                      <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                        {user?.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <User className="h-4 w-4 text-neutral-300" />
                        )}
                      </div>
                      <ChevronDown className="ml-1 h-4 w-4 text-neutral-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs text-muted-foreground">@{user?.username}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="cursor-pointer w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-4 ml-4">
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:bg-opacity-10">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-opacity-90">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-neutral-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <div className="px-2 mb-6">
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="text"
                        placeholder="Search programs..."
                        className="bg-neutral-800 text-white rounded-lg px-4 py-2 pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <Search className="h-4 w-4 text-neutral-300" />
                      </button>
                    </form>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link href="/" className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-800">
                      <Home className="mr-2 h-5 w-5 text-neutral-300" />
                      <span>Home</span>
                    </Link>
                    <Link href="/programs" className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-800">
                      <Shield className="mr-2 h-5 w-5 text-neutral-300" />
                      <span>Programs</span>
                    </Link>
                    <Link href="/resources" className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-800">
                      <BookOpen className="mr-2 h-5 w-5 text-neutral-300" />
                      <span>Resources</span>
                    </Link>
                    
                    {isAuthenticated ? (
                      <>
                        <div className="h-px bg-neutral-800 my-2"></div>
                        <Link href={getDashboardLink()} className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-800">
                          <User className="mr-2 h-5 w-5 text-neutral-300" />
                          <span>Dashboard</span>
                        </Link>
                        <button 
                          onClick={() => logout()} 
                          className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-800 text-left"
                        >
                          <LogOut className="mr-2 h-5 w-5 text-neutral-300" />
                          <span>Log out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="h-px bg-neutral-800 my-2"></div>
                        <Link href="/login" className="px-2 py-2">
                          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:bg-opacity-10">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/register" className="px-2 py-2">
                          <Button className="w-full bg-primary hover:bg-opacity-90">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
