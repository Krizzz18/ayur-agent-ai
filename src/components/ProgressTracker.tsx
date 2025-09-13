import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  BarChart3,
  Star,
  Flame,
  Heart,
  Zap
} from 'lucide-react';

interface ProgressTrackerProps {
  userDosha?: string;
  recommendations?: any;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userDosha = 'Vata' }) => {
  const achievements = [
    {
      id: 1,
      name: 'Early Riser',
      description: 'Wake up before 6 AM for 7 days',
      progress: 85,
      icon: Star,
      color: 'vata',
      completed: false
    },
    {
      id: 2,
      name: 'Meditation Master',
      description: '21 days of consistent meditation',
      progress: 67,
      icon: Heart,
      color: 'kapha',
      completed: false
    },
    {
      id: 3,
      name: 'Dosha Detective',
      description: 'Complete dosha assessment',
      progress: 100,
      icon: Award,
      color: 'pitta',
      completed: true
    },
    {
      id: 4,
      name: 'Herb Enthusiast',
      description: 'Take herbal supplements for 14 days',
      progress: 43,
      icon: Flame,
      color: 'healing',
      completed: false
    }
  ];

  const weeklyStats = [
    { day: 'Mon', routines: 85, meditation: 20, herbs: 100 },
    { day: 'Tue', routines: 92, meditation: 15, herbs: 100 },
    { day: 'Wed', routines: 78, meditation: 25, herbs: 50 },
    { day: 'Thu', routines: 95, meditation: 30, herbs: 100 },
    { day: 'Fri', routines: 88, meditation: 18, herbs: 100 },
    { day: 'Sat', routines: 90, meditation: 35, herbs: 75 },
    { day: 'Sun', routines: 85, meditation: 40, herbs: 100 }
  ];

  const doshaBalance = {
    Vata: 45,
    Pitta: 35,
    Kapha: 20
  };

  const currentStreak = 12;
  const longestStreak = 18;
  const totalPoints = 1847;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Progress & Achievements</h1>
          <p className="text-muted-foreground">
            Track your Ayurvedic wellness journey
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Zap size={16} className="mr-2" />
          {totalPoints} points
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center gradient-vata text-white">
          <div className="text-3xl font-bold mb-2">{currentStreak}</div>
          <p className="text-white/90">Current Streak</p>
          <p className="text-xs text-white/70 mt-1">days consecutive</p>
        </Card>

        <Card className="p-6 text-center gradient-pitta text-white">
          <div className="text-3xl font-bold mb-2">{longestStreak}</div>
          <p className="text-white/90">Longest Streak</p>
          <p className="text-xs text-white/70 mt-1">personal best</p>
        </Card>

        <Card className="p-6 text-center gradient-kapha text-white">
          <div className="text-3xl font-bold mb-2">87%</div>
          <p className="text-white/90">This Week</p>
          <p className="text-xs text-white/70 mt-1">completion rate</p>
        </Card>

        <Card className="p-6 text-center gradient-healing text-white">
          <div className="text-3xl font-bold mb-2">+12</div>
          <p className="text-white/90">Improvement</p>
          <p className="text-xs text-white/70 mt-1">vs last week</p>
        </Card>
      </div>

      {/* Dosha Balance Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Current Dosha Balance
        </h3>
        
        <div className="space-y-4">
          {Object.entries(doshaBalance).map(([dosha, percentage]) => (
            <div key={dosha} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{dosha}</span>
                <span className="text-sm text-muted-foreground">{percentage}%</span>
              </div>
              <Progress 
                value={percentage} 
                className={`h-3 ${dosha.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Analysis:</strong> Your {userDosha} is well-balanced this week. 
            Continue with current routines to maintain harmony.
          </p>
        </div>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Weekly Activity Overview
        </h3>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weeklyStats.map((day, index) => (
            <div key={day.day} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
              <div className="space-y-1">
                <div 
                  className="w-full bg-muted rounded-sm gradient-vata opacity-80"
                  style={{ height: `${Math.max(day.routines / 2, 20)}px` }}
                  title={`Routines: ${day.routines}%`}
                />
                <div 
                  className="w-full bg-muted rounded-sm gradient-pitta opacity-80"
                  style={{ height: `${Math.max(day.meditation, 10)}px` }}
                  title={`Meditation: ${day.meditation} min`}
                />
                <div 
                  className="w-full bg-muted rounded-sm gradient-kapha opacity-80"
                  style={{ height: `${Math.max(day.herbs / 3, 15)}px` }}
                  title={`Herbs: ${day.herbs}%`}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 gradient-vata rounded-sm"></div>
            <span>Daily Routines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 gradient-pitta rounded-sm"></div>
            <span>Meditation (min)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 gradient-kapha rounded-sm"></div>
            <span>Herbs Taken</span>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award size={20} />
          Achievements & Badges
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card 
                key={achievement.id}
                className={`p-4 transition-ayur ${
                  achievement.completed 
                    ? 'gradient-healing text-white' 
                    : 'hover:shadow-gentle'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full ${
                    achievement.completed 
                      ? 'bg-white/20' 
                      : `gradient-${achievement.color}`
                  } flex items-center justify-center flex-shrink-0`}>
                    <Icon 
                      size={20} 
                      className={achievement.completed ? 'text-white' : 'text-white'} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${
                        achievement.completed ? 'text-white' : 'text-foreground'
                      }`}>
                        {achievement.name}
                      </h4>
                      {achievement.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Completed!
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      achievement.completed ? 'text-white/90' : 'text-muted-foreground'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {!achievement.completed && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Goals */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target size={20} />
          This Month's Goals
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Complete 25 meditation sessions</p>
              <p className="text-sm text-muted-foreground">18/25 completed</p>
            </div>
            <Progress value={72} className="w-24 h-2" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Take herbs consistently for 30 days</p>
              <p className="text-sm text-muted-foreground">12/30 completed</p>
            </div>
            <Progress value={40} className="w-24 h-2" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Follow dosha routine daily</p>
              <p className="text-sm text-muted-foreground">22/30 completed</p>
            </div>
            <Progress value={73} className="w-24 h-2" />
          </div>
        </div>
        
        <Button variant="healing" className="w-full mt-4">
          Set New Goal
        </Button>
      </Card>
    </div>
  );
};

export default ProgressTracker;