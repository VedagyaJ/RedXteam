import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Programs from "@/pages/Programs";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProgramDetail from "@/pages/ProgramDetail";
import OrgDashboard from "@/pages/OrgDashboard";
import HackerDashboard from "@/pages/HackerDashboard";
import SubmitReport from "@/pages/SubmitReport";
import ReportDetail from "@/pages/ReportDetail";
import Resources from "@/pages/Resources";
import { useAuth } from "./contexts/AuthContext";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/programs" component={Programs} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/program/:id">
        {params => <ProgramDetail id={params.id} />}
      </Route>
      <Route path="/resources" component={Resources} />
      
      {/* Protected routes */}
      {user && user.role === 'organization' && (
        <Route path="/dashboard/organization" component={OrgDashboard} />
      )}
      {user && user.role === 'hacker' && (
        <Route path="/dashboard/hacker" component={HackerDashboard} />
      )}
      {user && user.role === 'hacker' && (
        <Route path="/submit-report/:programId">
          {params => <SubmitReport programId={params.programId} />}
        </Route>
      )}
      {user && (
        <Route path="/report/:id">
          {params => <ReportDetail id={params.id} />}
        </Route>
      )}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
