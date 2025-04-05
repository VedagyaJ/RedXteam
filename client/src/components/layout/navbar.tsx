import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BugIcon, 
  BellIcon, 
  MenuIcon, 
  UserIcon, 
  LogOutIcon,
  LayoutDashboardIcon,
  SettingsIcon
} from "lucide-react";
import { getInitials } from "@/lib/utils";

interface NavbarProps {
  user: Omit<User, "password"> | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center cursor-pointer">
                  <BugIcon className="text-white h-5 w-5" />
                </div>
              </Link>
              <Link href="/">
                <span className="ml-3 text-xl font-bold text-secondary cursor-pointer">
                  RedX<span className="text-primary">team</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link href="/">
                <a
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location === "/"
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  Home
                </a>
              </Link>
              <Link href="/programs">
                <a
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location === "/programs" || location.startsWith("/programs/")
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  Programs
                </a>
              </Link>
              <Link href="/leaderboard">
                <a
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location === "/leaderboard"
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  Leaderboard
                </a>
              </Link>
              <Link href="/resources">
                <a
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location === "/resources"
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  Resources
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700">
                    <BellIcon className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {getInitials(user.fullName)}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="flex items-center justify-start p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.fullName}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <div className="flex items-center cursor-pointer w-full">
                            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <div className="flex items-center cursor-pointer">
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild onClick={onLogout}>
                        <div className="flex items-center cursor-pointer text-red-600">
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Open main menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  location === "/"
                    ? "bg-primary-100 text-primary border-primary"
                    : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
                )}
              >
                Home
              </a>
            </Link>
            <Link href="/programs">
              <a
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  location === "/programs" || location.startsWith("/programs/")
                    ? "bg-primary-100 text-primary border-primary"
                    : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
                )}
              >
                Programs
              </a>
            </Link>
            <Link href="/leaderboard">
              <a
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  location === "/leaderboard"
                    ? "bg-primary-100 text-primary border-primary"
                    : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
                )}
              >
                Leaderboard
              </a>
            </Link>
            <Link href="/resources">
              <a
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  location === "/resources"
                    ? "bg-primary-100 text-primary border-primary"
                    : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
                )}
              >
                Resources
              </a>
            </Link>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {getInitials(user.fullName)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-neutral-800">
                    {user.fullName}
                  </div>
                  <div className="text-sm font-medium text-neutral-500">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link href="/dashboard">
                  <a className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100">
                    Dashboard
                  </a>
                </Link>
                <a className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100">
                  Settings
                </a>
                <a
                  onClick={onLogout}
                  className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                >
                  Sign out
                </a>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="flex flex-col space-y-3 px-4">
                <Link href="/login">
                  <a className="block w-full px-4 py-2 text-center text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 border border-neutral-300 rounded-md">
                    Log in
                  </a>
                </Link>
                <Link href="/register">
                  <a className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-primary hover:bg-primary-dark rounded-md">
                    Sign up
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
