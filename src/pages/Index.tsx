import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import DashboardHome from '@/components/DashboardHome';
import ChatInterface from '@/components/ChatInterface';
import PlansView from '@/components/PlansView';
import ProgressTracker from '@/components/ProgressTracker';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userDosha, setUserDosha] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleDoshaAnalysisComplete = (dosha: string, recs: any) => {
    setUserDosha(dosha);
    setRecommendations(recs);
    // Auto-switch to plans view after analysis
    setTimeout(() => setActiveTab('plans'), 2000);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome userDosha={userDosha || 'Vata'} />;
      case 'chat':
        return <ChatInterface onDoshaAnalysisComplete={handleDoshaAnalysisComplete} />;
      case 'plans':
        return <PlansView userDosha={userDosha || 'Vata'} recommendations={recommendations} />;
      case 'progress':
        return <ProgressTracker userDosha={userDosha || 'Vata'} />;
      default:
        return <DashboardHome userDosha={userDosha || 'Vata'} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
