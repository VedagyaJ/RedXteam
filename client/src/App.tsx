import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";

// Pages
import Home from "@/pages/home";
import Programs from "@/pages/programs";
import Leaderboard from "@/pages/leaderboard";
import Resources from "@/pages/resources";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ProgramDetails from "@/pages/program-details";
import SubmitReport from "@/pages/submit-report";
import OrgDashboard from "@/pages/org-dashboard";
import HackerDashboard from "@/pages/hacker-dashboard";
import NotFound from "@/pages/not-found";

// Components
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Types
import { User } from "@shared/schema";

function Router() {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    // Check local storage for user data
    const storedUser = localStorage.getItem("redxteam_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("redxteam_user");
      }
    }
  }, []);

  const handleLogin = (userData: Omit<User, "password">) => {
    setUser(userData);
    localStorage.setItem("redxteam_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("redxteam_user");
  };

  const isAuthenticated = !!user;
  const isOrganization = user?.userType === "organization";
  const isHacker = user?.userType === "hacker";
  
  // Hide navigation on authentication pages
  const hideNav = location === "/login" || location === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && <Navbar user={user} onLogout={handleLogout} />}
      
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={() => <Home user={user} />} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/:id" component={ProgramDetails} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/resources" component={Resources} />
          
          {/* Authentication routes */}
          <Route path="/login" component={() => <Login onLogin={handleLogin} />} />
          <Route path="/register" component={() => <Register onLogin={handleLogin} />} />
          
          {/* Protected routes */}
          <Route path="/submit-report/:programId" component={() => 
            isHacker ? <SubmitReport user={user} /> : <Login onLogin={handleLogin} />
          } />
          
          <Route path="/dashboard" component={() => {
            if (!isAuthenticated) return <Login onLogin={handleLogin} />;
            return isOrganization ? <OrgDashboard user={user} /> : <HackerDashboard user={user} />;
          }} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {!hideNav && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
