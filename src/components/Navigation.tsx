import React from 'react';
import { MessageCircle, Home, User, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import lotusIcon from '@/assets/lotus-icon.png';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'plans', label: 'My Plans', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav className="bg-card border-r border-border h-full w-64 p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
        <img src={lotusIcon} alt="AyurAgent" className="w-10 h-10 lotus-bloom" />
        <div>
          <h1 className="text-xl font-bold text-foreground">AyurAgent</h1>
          <p className="text-sm text-muted-foreground">AI Ayurvedic Wellness</p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'healing' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={20} />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="pt-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <User size={20} />
          Profile
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;