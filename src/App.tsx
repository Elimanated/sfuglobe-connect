
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import ClubPage from "./pages/ClubPage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GamesPage from "./pages/GamesPage";
import AttendancePage from "./pages/AttendancePage";
import MarketplacePage from "./pages/MarketplacePage";
import NewsfeedPage from "./pages/NewsfeedPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/study" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudyPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/club" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClubPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <QuizPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeaderboardPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/games" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <GamesPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <AttendancePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MarketplacePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/newsfeed" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewsfeedPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
