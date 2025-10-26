import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardHome from '@/components/DashboardHome';
import ChatInterface from '@/components/ChatInterface';
import PlansView from '@/components/PlansView';
import ProgressTracker from '@/components/ProgressTracker';
import DietChartModule from '@/components/DietChartModule';
import PatientManagement from '@/components/PatientManagement';
import EnhancedFoodDatabase from '@/components/EnhancedFoodDatabase';
import DoctorDashboard from '@/components/DoctorDashboard';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import ConstitutionAssessment from '@/components/ConstitutionAssessment';
import InteractiveChatInterface from '@/components/InteractiveChatInterface';
import EnhancedProgressTracker from '@/components/EnhancedProgressTracker';
import ProfileSection from '@/components/ProfileSection';
import { useAuth } from '@/hooks/useAuth';
import { useAppContext } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { userProfile, recommendations, addRecommendationsToTasks, loadSampleData } = useAppContext();
  
  const getActiveTab = () => {
    const path = location.pathname.split('/dashboard/')[1] || 'home';
    return path;
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    const newTab = getActiveTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location]);

  // Load sample data on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('ayuragent-has-visited');
    if (!hasVisited) {
      loadSampleData();
      localStorage.setItem('ayuragent-has-visited', 'true');
    }
  }, [loadSampleData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  const handleRecommendationsUpdate = (recs: any) => {
    addRecommendationsToTasks(recs);
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

  return (
    <div className="flex h-screen bg-background transition-colors duration-500">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardHome userDosha={userProfile.dosha || 'Vata'} />} />
            <Route path="home" element={<DashboardHome userDosha={userProfile.dosha || 'Vata'} />} />
            <Route path="chat" element={<InteractiveChatInterface onRecommendationsUpdate={handleRecommendationsUpdate} />} />
            <Route path="plans" element={<PlansView userDosha={userProfile.dosha || 'Vata'} recommendations={recommendations} />} />
            <Route path="progress" element={<EnhancedProgressTracker userDosha={userProfile.dosha || 'Vata'} recommendations={recommendations} />} />
            <Route path="constitution" element={<ConstitutionAssessment />} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="diet-chart" element={<DietChartModule />} />
            <Route path="food-database" element={<EnhancedFoodDatabase />} />
            <Route path="appointments" element={<AppointmentScheduler />} />
            <Route path="doctor-panel" element={<DoctorDashboard />} />
            <Route path="profile" element={<ProfileSection />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Index;