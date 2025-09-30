import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  BarChart3,
  Star,
  Flame,
  Heart,
  Zap,
  CheckCircle,
  Circle,
  Leaf,
  Sunrise,
  Moon,
  Droplets
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  task: string;
  category: 'diet' | 'herbs' | 'routine' | 'lifestyle';
  completed: boolean;
  time?: string;
  points: number;
}

interface EnhancedProgressTrackerProps {
  userDosha?: string;
  recommendations?: any;
}

const EnhancedProgressTracker: React.FC<EnhancedProgressTrackerProps> = ({ 
  userDosha = 'Vata',
  recommendations
}) => {
  const { toast } = useToast();
  
  // Interactive tasks from recommendations or defaults
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', task: 'Morning oil massage (Abhyanga)', category: 'routine', completed: false, time: '6:00 AM', points: 15 },
    { id: '2', task: 'Drink warm lemon water', category: 'diet', completed: true, time: '6:30 AM', points: 10 },
    { id: '3', task: 'Take Ashwagandha (500mg)', category: 'herbs', completed: false, time: '8:00 AM', points: 20 },
    { id: '4', task: 'Eat warm, cooked breakfast', category: 'diet', completed: true, time: '8:30 AM', points: 15 },
    { id: '5', task: '15 minutes meditation', category: 'lifestyle', completed: false, time: '12:00 PM', points: 25 },
    { id: '6', task: 'Lunch with ghee and spices', category: 'diet', completed: false, time: '1:00 PM', points: 15 },
    { id: '7', task: 'Take Triphala before bed', category: 'herbs', completed: false, time: '9:00 PM', points: 20 },
    { id: '8', task: 'Evening yoga or walk', category: 'lifestyle', completed: false, time: '6:00 PM', points: 20 },
  ]);

  const [weeklyStreak, setWeeklyStreak] = useState(12);
  const [totalPoints, setTotalPoints] = useState(1847);

  const achievements = [
    {
      id: 1,
      name: 'Early Riser',
      description: 'Wake up before 6 AM for 7 days',
      progress: 85,
      icon: Sunrise,
      color: 'vata',
      completed: false,
      requiredDays: 7,
      currentDays: 6
    },
    {
      id: 2,
      name: 'Meditation Master',
      description: '21 days of consistent meditation',
      progress: 67,
      icon: Heart,
      color: 'kapha',
      completed: false,
      requiredDays: 21,
      currentDays: 14
    },
    {
      id: 3,
      name: 'Dosha Detective',
      description: 'Complete dosha assessment',
      progress: 100,
      icon: Award,
      color: 'pitta',
      completed: true,
      requiredDays: 1,
      currentDays: 1
    },
    {
      id: 4,
      name: 'Herb Enthusiast',
      description: 'Take herbal supplements for 14 days',
      progress: 43,
      icon: Leaf,
      color: 'healing',
      completed: false,
      requiredDays: 14,
      currentDays: 6
    }
  ];

  const doshaBalance = {
    Vata: 45,
    Pitta: 35,
    Kapha: 20
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTaskPoints = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);

  const toggleTask = (taskId: string) => {
    setTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.id === taskId) {
          const isCompleting = !task.completed;
          if (isCompleting) {
            setTotalPoints(p => p + task.points);
            toast({
              title: `Great job! +${task.points} points 🎉`,
              description: `You completed: ${task.task}`,
            });
          } else {
            setTotalPoints(p => p - task.points);
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return newTasks;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diet': return Droplets;
      case 'herbs': return Leaf;
      case 'routine': return Sunrise;
      case 'lifestyle': return Heart;
      default: return Circle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'diet': return 'bg-blue-500';
      case 'herbs': return 'bg-green-500';
      case 'routine': return 'bg-orange-500';
      case 'lifestyle': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Stats */}
      <Card className="p-6 gradient-healing text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Wellness Journey 🌿</h1>
            <p className="text-white/90">
              {completedTasks}/{tasks.length} tasks completed today
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white">
              <Zap size={16} className="mr-2" />
              {totalPoints} points
            </Badge>
            <p className="text-white/90 mt-1">{weeklyStreak} day streak!</p>
          </div>
        </div>
        <Progress 
          value={(completedTasks / tasks.length) * 100} 
          className="mt-4 h-3 bg-white/20" 
        />
      </Card>

      {/* Today's Interactive Tasks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Today's Ayurvedic Tasks
          <Badge variant="outline">{completedTasks}/{tasks.length}</Badge>
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => {
            const CategoryIcon = getCategoryIcon(task.category);
            const isCompleted = task.completed;
            
            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-ayur cursor-pointer hover:shadow-gentle ${
                  isCompleted ? 'bg-secondary/10 border-secondary' : 'hover:bg-muted/50'
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="w-5 h-5"
                />
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(task.category)}`}>
                  <CategoryIcon size={16} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {task.task}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{task.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    <span className="text-primary font-medium">+{task.points} pts</span>
                  </div>
                </div>
                
                {isCompleted && (
                  <CheckCircle size={20} className="text-secondary" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              toast({
                title: "New tasks added! 📝",
                description: "Additional Ayurvedic practices have been added to your routine",
              });
            }}
          >
            <Target className="w-4 h-4 mr-2" />
            Add Custom Task
          </Button>
          <Button 
            onClick={() => {
              const incompleteTasks = tasks.filter(t => !t.completed);
              if (incompleteTasks.length > 0) {
                const nextTask = incompleteTasks[0];
                toast({
                  title: `Next: ${nextTask.task} ⏰`,
                  description: `Scheduled for ${nextTask.time}`,
                });
              }
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Reminder
          </Button>
        </div>
      </Card>

      {/* Interactive Achievements */}
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
                className={`p-4 transition-ayur cursor-pointer hover:scale-105 ${
                  achievement.completed 
                    ? 'gradient-healing text-white' 
                    : 'hover:shadow-gentle'
                }`}
                onClick={() => {
                  if (!achievement.completed) {
                    toast({
                      title: `Progress: ${achievement.name} 🏆`,
                      description: `${achievement.currentDays}/${achievement.requiredDays} days completed`,
                    });
                  }
                }}
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
                          Completed! 🎉
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
                          <span>{achievement.currentDays}/{achievement.requiredDays} days</span>
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

      {/* Dosha Balance with Interactive Elements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Current Dosha Balance
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "Dosha analysis updated! 🧘‍♀️",
                description: "Based on your recent activities and progress",
              });
            }}
          >
            Refresh
          </Button>
        </h3>
        
        <div className="space-y-4">
          {Object.entries(doshaBalance).map(([dosha, percentage]) => (
            <div 
              key={dosha} 
              className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-ayur"
              onClick={() => {
                toast({
                  title: `${dosha} Constitution 🌿`,
                  description: `Currently at ${percentage}% - ${
                    percentage > 40 ? 'Well balanced!' : 'Needs attention'
                  }`,
                });
              }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center gap-2">
                  {dosha}
                  {dosha === userDosha && <Badge variant="secondary">Primary</Badge>}
                </span>
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
            <strong>Live Analysis:</strong> Your {userDosha} is well-balanced this week. 
            Continue with current routines to maintain harmony. 
            <Button variant="link" className="p-0 h-auto font-normal">
              Learn more about {userDosha} →
            </Button>
          </p>
        </div>
      </Card>

      {/* Quick Action Center */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="vata" 
            className="h-16 flex-col gap-2"
            onClick={() => {
              toast({
                title: "Morning routine started! 🌅",
                description: "Oil massage reminder set for 15 minutes",
              });
            }}
          >
            <Sunrise size={20} />
            <span className="text-xs">Start Morning</span>
          </Button>
          
          <Button 
            variant="pitta" 
            className="h-16 flex-col gap-2"
            onClick={() => {
              const waterTasks = tasks.filter(t => t.task.toLowerCase().includes('water'));
              toast({
                title: "Hydration reminder! 💧",
                description: `You have ${waterTasks.length} water-related tasks today`,
              });
            }}
          >
            <Droplets size={20} />
            <span className="text-xs">Track Water</span>
          </Button>
          
          <Button 
            variant="kapha" 
            className="h-16 flex-col gap-2"
            onClick={() => {
              const herbTasks = tasks.filter(t => t.category === 'herbs' && !t.completed);
              toast({
                title: "Herb reminder! 🌿",
                description: `${herbTasks.length} herbal supplements pending`,
              });
            }}
          >
            <Leaf size={20} />
            <span className="text-xs">Take Herbs</span>
          </Button>
          
          <Button 
            variant="healing" 
            className="h-16 flex-col gap-2"
            onClick={() => {
              toast({
                title: "Evening routine ready! 🌙",
                description: "Time for yoga, herbs, and relaxation",
              });
            }}
          >
            <Moon size={20} />
            <span className="text-xs">Evening Wind-down</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedProgressTracker;