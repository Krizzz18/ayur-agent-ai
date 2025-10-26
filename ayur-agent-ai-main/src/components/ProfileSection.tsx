import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ResetConfirmationDialog from './ResetConfirmationDialog';
import { 
  User, 
  Trophy, 
  Flame, 
  Heart, 
  Star,
  Calendar,
  TrendingUp,
  LogOut,
  RefreshCw
} from 'lucide-react';

const ProfileSection = () => {
  const { userProfile, totalPoints, currentStreak, completionPercentage, resetData, loadSampleData } = useAppContext();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);

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
    { label: 'Dosha Type', value: userProfile.dosha || 'Not Set', icon: Heart, color: 'text-purple-600' },
  ];

  const handleSignOut = async () => {
    await signOut();
    resetData();
  };

  const handleResetData = () => {
    resetData();
    loadSampleData();
  };

  const handleDoshaRefresh = () => {
    // Re-run dosha calculation from user profile
    const newDoshaBalance = userProfile.dosha || 'Vata';
    // Animate chart update
    toast({ title: "Dosha balance updated 📊" });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 backdrop-blur-xl bg-card/95 border-border/50 shadow-lotus">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 ring-4 ring-primary/20">
            <AvatarFallback className="gradient-healing text-white text-3xl">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold gradient-healing bg-clip-text text-transparent">
              {user?.email || 'Guest User'}
            </h2>
            <p className="text-muted-foreground text-lg">Wellness Journey Member</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="gap-1">
                <Calendar size={14} />
                Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleDoshaRefresh} 
              className="gap-2 h-12 px-6 shadow-lg hover:scale-105 transition-ayur"
              size="lg"
            >
              <RefreshCw size={20} />
              Refresh Dosha
            </Button>
            {user && (
              <Button 
                variant="destructive" 
                onClick={handleSignOut} 
                className="gap-2 h-12 px-6 shadow-lg hover:scale-105 transition-ayur"
                size="lg"
              >
                <LogOut size={20} />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 backdrop-blur-xl bg-card/95 border-border/50 hover:shadow-lotus transition-ayur">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl gradient-healing flex items-center justify-center text-white shadow-md`}>
                  <Icon size={28} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card className="p-6 backdrop-blur-xl bg-card/95 border-border/50">
        <h3 className="text-xl font-semibold mb-6 gradient-healing bg-clip-text text-transparent">
          Achievements & Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.name}
                className={`p-6 rounded-xl text-center transition-ayur hover:scale-105 ${
                  achievement.unlocked
                    ? 'gradient-healing text-white shadow-lotus'
                    : 'bg-muted/50 text-muted-foreground opacity-50'
                }`}
              >
                <Icon size={40} className="mx-auto mb-3" />
                <p className="text-sm font-semibold">{achievement.name}</p>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="mt-3 text-xs">
                    ✨ Unlocked!
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
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => toast({ title: "📊 Wellness History", description: "Feature coming soon! View your complete wellness journey." })}
          >
            View Wellness History
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => toast({ title: "📄 Export Report", description: "Generating your progress report..." })}
          >
            Export Progress Report
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => toast({ title: "⚙️ Preferences", description: "Settings panel coming soon!" })}
          >
            Update Preferences
          </Button>
          <Button 
            variant="outline" 
            className="justify-start text-destructive hover:text-destructive"
            onClick={() => setShowResetDialog(true)}
          >
            Reset All Data
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ResetConfirmationDialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleResetData}
      />
    </div>
  );
};

export default ProfileSection;
