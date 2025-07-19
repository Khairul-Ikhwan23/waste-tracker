import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import Dashboard from "@/pages/dashboard";
import PickupRequests from "@/pages/pickup-requests";
import RoutePlanner from "@/pages/route-planner";
import RecyclingMetrics from "@/pages/recycling-metrics";
import EnvironmentalReports from "@/pages/environmental-reports";
import UserProfile from "@/pages/user-profile";
import UserSettings from "@/pages/user-settings";
import PickupHistory from "@/pages/pickup-history";
import EcoRewards from "@/pages/eco-rewards";
import Payments from "@/pages/payments";
import NotFound from "@/pages/not-found";
import SplashScreen from "@/components/SplashScreen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pickup-requests" component={PickupRequests} />
      <Route path="/route-planner" component={RoutePlanner} />
      <Route path="/recycling-metrics" component={RecyclingMetrics} />
      <Route path="/environmental-reports" component={EnvironmentalReports} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/settings" component={UserSettings} />
      <Route path="/pickup-history" component={PickupHistory} />
      <Route path="/eco-rewards" component={EcoRewards} />
      <Route path="/payments" component={Payments} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <SplashScreen />
          <Toaster />
          <Router />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
