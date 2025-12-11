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
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage onStart={() => navigate('/signup')} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/onboarding" 
            element={
                <ProtectedRoute>
                    <Onboarding onComplete={() => navigate('/dashboard')} />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/course/:courseId" 
            element={
                <ProtectedRoute>
                    <LearningStudio />
                </ProtectedRoute>
            } 
        />
        
        {/* Public/Hybrid Routes */}
        <Route path="/community" element={<Community />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/contact" element={<Contact />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
