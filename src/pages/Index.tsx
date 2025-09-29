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

  // Allow guest access - no redirect needed

  const handleRecommendationsUpdate = (recs: any) => {
    setRecommendations(recs);
    // Extract dosha from recommendations or set a default
    if (recs && recs.dosha) {
      setUserDosha(recs.dosha);
    }
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome userDosha={userDosha || 'Vata'} />;
      case 'chat':
        return <ChatInterface onRecommendationsUpdate={handleRecommendationsUpdate} />;
      case 'plans':
        return <PlansView userDosha={userDosha || 'Vata'} recommendations={recommendations} />;
      case 'progress':
        return <ProgressTracker userDosha={userDosha || 'Vata'} recommendations={recommendations} />;
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

  // Allow both authenticated and guest users to access the dashboard

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