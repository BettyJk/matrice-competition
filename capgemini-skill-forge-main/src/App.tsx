/**
 * Root Application Component
 * 
 * Provides core application structure including:
 * - Authentication context and route protection
 * - Routing configuration for all pages
 * - Global providers (Query, Tooltip, Toast notifications)
 * - Public vs Protected route logic
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import ActivitySelection from "./pages/ActivitySelection";
import MatrixForm from "./pages/MatrixForm";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Initialize React Query client for server state management
const queryClient = new QueryClient();

/**
 * ProtectedRoute - Ensures only authenticated users can access the route
 * Redirects unauthenticated users to the login page
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  // Show loading state while auth status is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

/**
 * PublicRoute - Allows public access but redirects authenticated users
 * Used for login/signup pages to prevent authenticated users from accessing them
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  
  // Redirect authenticated users to activities page
  if (user) {
    return <Navigate to="/activities" replace />;
  }
  
  return <>{children}</>;
}

/**
 * Application Routes and Configuration
 * 
 * Route Map:
 * /login - Authentication (Public)
 * /activities - Activity selection (Protected)
 * /matrix/:activityId - Competency matrix input (Protected)
 * /dashboard - User dashboard with analytics (Protected)
 * /admin - Admin management panel (Protected)
 * / - Redirects to /login
 * /* - 404 Not Found page
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notification systems */}
      <Toaster />
      <Sonner />
      
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes - accessible to anyone */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            
            {/* Protected routes - require authentication */}
            <Route path="/activities" element={<ProtectedRoute><ActivitySelection /></ProtectedRoute>} />
            <Route path="/matrix/:activityId" element={<ProtectedRoute><MatrixForm /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            
            {/* Default routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
