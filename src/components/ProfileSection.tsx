import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Trophy, 
  Flame, 
  Heart, 
  Star,
  Calendar,
  TrendingUp,
  LogOut
} from 'lucide-react';

const ProfileSection = () => {
  const { userDosha, totalPoints, currentStreak, completionPercentage, resetData } = useAppContext();
  const { user, signOut } = useAuth();

  const achievements = [
    { name: 'Early Bird', icon: Star, unlocked: currentStreak >= 7 },
    { name: 'Wellness Warrior', icon: Trophy, unlocked: totalPoints >= 500 },
    { name: 'Streak Master', icon: Flame, unlocked: currentStreak >= 14 },
    { name: 'Dosha Balance', icon: Heart, unlocked: completionPercentage >= 80 },
  ];

  const stats = [
    { label: 'Total Points', value: totalPoints, icon: Trophy, color: 'text-yellow-600' },
    { label: 'Current Streak', value: `${currentStreak} days`, icon: Flame, color: 'text-orange-600' },
    { label: 'Completion', value: `${completionPercentage}%`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Dosha Type', value: userDosha || 'Not Set', icon: Heart, color: 'text-purple-600' },
  ];

  const handleSignOut = async () => {
    await signOut();
    resetData();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="gradient-healing text-white text-2xl">
              <User size={32} />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.email || 'Guest User'}</h2>
            <p className="text-muted-foreground">Wellness Journey Member</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="gap-1">
                <Calendar size={14} />
                Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Badge>
            </div>
          </div>

          {user && (
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements & Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg text-center transition-ayur ${
                  achievement.unlocked
                    ? 'gradient-healing text-white'
                    : 'bg-muted text-muted-foreground opacity-50'
                }`}
              >
                <Icon size={32} className="mx-auto mb-2" />
                <p className="text-sm font-medium">{achievement.name}</p>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Unlocked!
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start">
            View Wellness History
          </Button>
          <Button variant="outline" className="justify-start">
            Export Progress Report
          </Button>
          <Button variant="outline" className="justify-start">
            Update Preferences
          </Button>
          <Button variant="outline" className="justify-start" onClick={resetData}>
            Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
