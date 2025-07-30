// client/src/App.tsx
import { Router, Switch, Route } from "wouter";
import { useState, useLayoutEffect, useCallback } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";

import Dashboard            from "@/pages/dashboard";
import PickupRequests       from "@/pages/pickup-requests";
import RoutePlanner         from "@/pages/route-planner";
import RecyclingMetrics     from "@/pages/recycling-metrics";
import EnvironmentalReports from "@/pages/environmental-reports";
import UserProfile          from "@/pages/user-profile";
import UserSettings         from "@/pages/user-settings";
import PickupHistory        from "@/pages/pickup-history";
import EcoRewards           from "@/pages/eco-rewards";
import EcoMap               from "@/pages/eco-map";
import Payments             from "@/pages/payments";
import AdminFacilities      from "@/pages/admin-facilities";
import NotFound             from "@/pages/not-found";
import SplashScreen         from "@/components/SplashScreen";

/**
 * A simple hash-based location hook for Wouter.
 * It keeps window.location.hash (minus the leading '#') in sync with Wouter.
 */
function useHashLocation(): [string, (to: string) => void] {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || "/");

  useLayoutEffect(() => {
    const onHashChange = () => {
      setPath(window.location.hash.slice(1) || "/");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [path, navigate];
}

function RouterComponent() {
  return (
    <Router hook={useHashLocation}>
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
        <Route path="/eco-map" component={EcoMap} />
        <Route path="/payments" component={Payments} />
        <Route path="/admin-facilities" component={AdminFacilities} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <SplashScreen />
          <Toaster />
          <RouterComponent />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
