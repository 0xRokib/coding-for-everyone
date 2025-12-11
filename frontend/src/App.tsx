import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './layout/Layout';

// Pages
import { LandingPage } from './components/common/LandingPage';
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { Community } from './features/community/Community';
import { Contact } from './features/contact/Contact';
import { Dashboard } from './features/dashboard/Dashboard';
import { Onboarding } from './features/onboarding/Onboarding';
import { Roadmap } from './features/roadmap/Roadmap';
import { LearningStudio } from './features/studio/LearningStudio';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
        {/* Auth Routes (No Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<Layout><LandingPage onStart={() => navigate('/signup')} /></Layout>} />
        
        {/* Protected Routes */}
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/onboarding" 
            element={
                <ProtectedRoute>
                    <Layout><Onboarding onComplete={() => navigate('/dashboard')} /></Layout>
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/course/:courseId" 
            element={
                <ProtectedRoute>
                    <Layout><LearningStudio /></Layout>
                </ProtectedRoute>
            } 
        />
        
        {/* Public/Hybrid Routes */}
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/roadmap" element={<Layout><Roadmap /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}
