import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FullPageLayout } from './layout/FullPageLayout';
import { SidebarLayout } from './layout/SidebarLayout';

// Pages
import { LandingPage } from './components/common/LandingPage';
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { Community } from './features/community/Community';
import { Contact } from './features/contact/Contact';
import { CoursePage } from './features/course/CoursePage';
import { Dashboard } from './features/dashboard/Dashboard';

import { Onboarding } from './features/onboarding/Onboarding';
import { Roadmap } from './features/roadmap/Roadmap';
import { LearningStudio } from './features/studio/LearningStudio';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

export default function App() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Routes>
        {/* Auth Routes (No Navbar/Footer) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Main Layout Routes */}
        <Route 
            path="/" 
            element={
                user ? (
                    <FullPageLayout>
                        <LandingPage hideNav={true} onStart={() => navigate('/dashboard')} />
                    </FullPageLayout>
                ) : (
                    <LandingPage onStart={() => navigate('/signup')} />
                )
            } 
        />
        
        {/* Protected Routes */}
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <FullPageLayout><Dashboard /></FullPageLayout>
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/onboarding" 
            element={
                <ProtectedRoute>
                    <SidebarLayout><Onboarding onComplete={() => navigate('/dashboard')} /></SidebarLayout>
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/course/:courseId" 
            element={
                <ProtectedRoute>
                    <FullPageLayout><CoursePage /></FullPageLayout>
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/studio/:courseId" 
            element={
                <ProtectedRoute>
                    <LearningStudio user={user!} />
                </ProtectedRoute>
            } 
        />
        
        {/* Public/Hybrid Routes */}
        <Route path="/community" element={<FullPageLayout><Community /></FullPageLayout>} />
        <Route path="/roadmap" element={<FullPageLayout><Roadmap /></FullPageLayout>} />
        <Route path="/contact" element={<FullPageLayout><Contact /></FullPageLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}
