import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import DashboardHome from '@/components/DashboardHome';
import ChatInterface from '@/components/ChatInterface';
import PlansView from '@/components/PlansView';
import ProgressTracker from '@/components/ProgressTracker';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
<<<<<<< HEAD
  const [userDosha, setUserDosha] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to landing page if not authenticated
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  const handleDoshaAnalysisComplete = (dosha: string, recs: any) => {
    setUserDosha(dosha);
    setRecommendations(recs);
    // Stay on chat so the user can review and export; no auto-switch
  };
=======
>>>>>>> daa0be9 (feat: integrate Gemini API; add frontend + Flask fallbacks; fix models; improve chat error handling)

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome userDosha={'Vata'} />;
      case 'chat':
        return <ChatInterface />;
      case 'plans':
        return <PlansView userDosha={'Vata'} recommendations={null} />;
      case 'progress':
<<<<<<< HEAD
        return <ProgressTracker userDosha={userDosha || 'Vata'} recommendations={recommendations} />;
=======
        return <ProgressTracker userDosha={'Vata'} />;
>>>>>>> daa0be9 (feat: integrate Gemini API; add frontend + Flask fallbacks; fix models; improve chat error handling)
      default:
        return <DashboardHome userDosha={'Vata'} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access your wellness dashboard</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background transition-colors duration-500">
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
