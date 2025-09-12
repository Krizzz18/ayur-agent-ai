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
