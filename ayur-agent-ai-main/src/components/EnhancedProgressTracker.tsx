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
  Droplets,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import AddTaskDialog from './AddTaskDialog';
import DoshaAnalysisChart from './DoshaAnalysisChart';

interface EnhancedProgressTrackerProps {
  userDosha?: string;
  recommendations?: any;
}

const EnhancedProgressTracker: React.FC<EnhancedProgressTrackerProps> = ({ 
  userDosha = 'Vata',
  recommendations
}) => {
  const { toast } = useToast();
  const { 
    tasks, 
    customTasks, 
    totalPoints, 
    currentStreak,
    userProfile,
    toggleTask, 
    addCustomTask 
  } = useAppContext();
  
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [weeklyStreak] = useState(currentStreak);
  const [showDoshaChart, setShowDoshaChart] = useState(false);
  const [doshaScores, setDoshaScores] = useState({ vata: 33, pitta: 33, kapha: 34 });

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

  const allTasks = [...tasks, ...customTasks];
  const completedTasks = allTasks.filter(task => task.completed).length;
  const totalTaskPoints = allTasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);

  const handleToggleTask = (taskId: string) => {
    // Determine which list the task is in
    const taskList = tasks.find(t => t.id === taskId) ? 'tasks' : 'customTasks';
    toggleTask(taskId, taskList);
    
    const task = allTasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: `Great job! +${task.points} points 🎉`,
        description: `You completed: ${task.title}`,
      });
    }
  };

  const handleAddCustomTask = (taskData: any) => {
    const newTask = {
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      frequency: taskData.frequency,
      points: taskData.points || 10,
      completed: false,
      source: 'Custom',
      dateAdded: new Date()
    };
    addCustomTask(newTask);
    setShowAddTaskDialog(false);
    toast({ title: '✅ Custom task added!' });
  };

  const computeDoshaBalance = () => {
    // Base scores from constitution quiz
    let vata = 33, pitta = 33, kapha = 34;
    
    if (userProfile.dosha === 'Vata') {
      vata = 50; pitta = 25; kapha = 25;
    } else if (userProfile.dosha === 'Pitta') {
      vata = 25; pitta = 50; kapha = 25;
    } else if (userProfile.dosha === 'Kapha') {
      vata = 25; pitta = 25; kapha = 50;
    }

    // Adjust based on completed tasks
    const allTasks = [...tasks, ...customTasks];
    const completed = allTasks.filter(t => t.completed);
    
    completed.forEach(task => {
      const cat = task.category?.toLowerCase() || '';
      
      // Morning routine, breath work → balances vata
      if (cat.includes('morning') || cat.includes('routine') || cat.includes('breath')) {
        vata += 2;
      }
      // Herbs, cooling activities → balances pitta
      if (cat.includes('herb') || cat.includes('cooling') || cat.includes('meditation')) {
        pitta += 2;
      }
      // Exercise, movement → balances kapha
      if (cat.includes('exercise') || cat.includes('lifestyle') || cat.includes('movement')) {
        kapha += 2;
      }
      // Diet affects all doshas
      if (cat.includes('diet') || cat.includes('food')) {
        vata += 1;
        pitta += 1;
        kapha += 1;
      }
    });

    // Normalize to percentages
    const total = vata + pitta + kapha;
    return {
      vata: Math.round((vata / total) * 100),
      pitta: Math.round((pitta / total) * 100),
      kapha: Math.round((kapha / total) * 100)
    };
  };

  const handleRefreshDosha = () => {
    const scores = computeDoshaBalance();
    setDoshaScores(scores);
    setShowDoshaChart(true);
    toast({ 
      title: '✨ Dosha balance updated!', 
      description: 'Your current balance is calculated from your activities.'
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
                onClick={() => handleToggleTask(task.id)}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="w-5 h-5"
                />
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(task.category)}`}>
                  <CategoryIcon size={16} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
            onClick={() => setShowAddTaskDialog(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            Add Custom Task
          </Button>
          <Button 
            onClick={() => {
              const incompleteTasks = allTasks.filter(t => !t.completed);
              if (incompleteTasks.length > 0) {
                const nextTask = incompleteTasks[0];
                toast({
                  title: `Next: ${nextTask.title} ⏰`,
                  description: `${nextTask.frequency} - ${nextTask.category}`,
                });
              } else {
                toast({
                  title: "🎉 All tasks completed!",
                  description: "Great job on your wellness journey today!",
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={20} />
            Current Dosha Balance
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshDosha}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
        
        {showDoshaChart && doshaScores ? (
          <DoshaAnalysisChart 
            vataScore={doshaScores.vata}
            pittaScore={doshaScores.pitta}
            kaphaScore={doshaScores.kapha}
            dominantDosha={userProfile.dosha || 'Balanced'}
            imbalances={[]}
            recommendations={[
              'Continue your daily wellness routine',
              'Focus on seasonal adjustments',
              'Maintain balance through mindful practices'
            ]}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Click "Refresh Analysis" to view your current dosha balance based on completed activities
            </p>
          </div>
        )}
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
              const waterTasks = allTasks.filter(t => t.title.toLowerCase().includes('water'));
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
              const herbTasks = allTasks.filter(t => t.category === 'Herbal' && !t.completed);
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
      
      {/* Add Task Dialog */}
      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        onSave={handleAddCustomTask}
      />
    </div>
  );
};

export default EnhancedProgressTracker;