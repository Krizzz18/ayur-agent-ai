import React from 'react';
import { MessageCircle, Home, User, TrendingUp, BookOpen, ChefHat, Users, Calendar, Database, Stethoscope, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import lotusIcon from '@/assets/lotus-icon.png';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'AI Consultant', icon: MessageCircle },
    { id: 'plans', label: 'Wellness Plans', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'constitution', label: 'Constitution', icon: FileQuestion },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'diet-chart', label: 'Diet Charts', icon: ChefHat },
    { id: 'food-database', label: 'Food Database', icon: Database },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'doctor-panel', label: 'Doctor Panel', icon: Stethoscope },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      className="bg-card border-r border-border h-full w-64 p-4 flex flex-col"
      aria-label="Main navigation"
      role="navigation"
    >
      {/* Logo and Theme Toggle */}
      <div className="mb-8 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img 
              src={lotusIcon} 
              alt="AyurAgent logo - lotus flower" 
              className="w-10 h-10 lotus-bloom"
              role="img"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">AyurAgent</h1>
              <p className="text-sm text-muted-foreground">AI Ayurvedic Wellness</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        {!user && (
          <div 
            className="bg-accent/50 border border-accent-foreground/20 rounded-lg p-3 mt-3"
            role="complementary"
            aria-label="Guest mode notification"
          >
            <p className="text-xs text-muted-foreground text-center">
              🌟 Exploring as Guest
            </p>
            <Button 
              size="sm" 
              className="w-full mt-2" 
              onClick={() => window.location.href = '/auth'}
              aria-label="Sign up for free account"
            >
              Sign Up Free
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div 
        className="space-y-2 flex-1"
        role="menu"
        aria-label="Navigation menu"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? 'healing' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => onTabChange(item.id)}
              role="menuitem"
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              {item.label}
            </Button>
          );
        })}
      </div>

    </nav>
  );
};

export default Navigation;