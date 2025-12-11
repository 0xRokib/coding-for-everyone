import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { LearningStudio } from './components/LearningStudio';
import { AppView, UserProfile } from './types';

function App() {
  const [currentView, setView] = useState<AppView>(AppView.LANDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleStartLearning = () => {
    setView(AppView.ONBOARDING);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView(AppView.STUDIO);
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {currentView === AppView.LANDING && (
        <LandingPage onStart={handleStartLearning} />
      )}
      
      {currentView === AppView.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {currentView === AppView.STUDIO && userProfile && (
        <LearningStudio user={userProfile} />
      )}
    </Layout>
  );
}

export default App;