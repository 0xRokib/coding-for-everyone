import React, { useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { LandingPage } from './components/common/LandingPage';
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { Dashboard } from './features/dashboard/Dashboard';
import { Onboarding } from './features/onboarding/Onboarding';
import { LearningStudio } from './features/studio/LearningStudio';
import { Layout } from './layout/Layout';
import { UserProfile } from './types';

// Home page component
function HomePage() {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <LandingPage onStart={() => navigate('/onboarding')} />
    </Layout>
  );
}

// Onboarding page component
function OnboardingPage() {
  const navigate = useNavigate();
  
  const handleOnboardingComplete = (profile: any) => {
    // Generate unique course ID based on timestamp and persona
    const courseId = profile.courseId ? String(profile.courseId) : `${profile.persona.toLowerCase()}-${Date.now()}`;
    
    // Store profile in sessionStorage for this course
    sessionStorage.setItem(`course-${courseId}`, JSON.stringify(profile));
    
    // Navigate to unique course URL
    navigate(`/course/${courseId}`);
  };

  return (
    <Layout>
      <Onboarding onComplete={handleOnboardingComplete} />
    </Layout>
  );
}

// Course/Studio page component with unique URL
function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  React.useEffect(() => {
    // Load profile from sessionStorage
    const storedProfile = sessionStorage.getItem(`course-${courseId}`);
    
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      // If no profile found, redirect to onboarding
      navigate('/onboarding');
    }
  }, [courseId, navigate]);

  if (!userProfile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your course...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <LearningStudio user={userProfile} />
    </Layout>
  );
}

// Main App with routing
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/course/:courseId" element={<CoursePage />} />
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
