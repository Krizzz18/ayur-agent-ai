import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Plus, 
  Target, 
  Calendar,
  TrendingUp,
  Star,
  Leaf,
  Heart,
  Zap,
  Sunrise
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import AddTaskDialog from './AddTaskDialog';

interface TaskSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  tasks: any[];
  category: string;
}

const TaskManager: React.FC = () => {
  const { 
    tasks, 
    customTasks, 
    toggleTask, 
    addCustomTask,
    totalPoints,
    completionCount,
    completionPercentage
  } = useAppContext();
  
  const { toast } = useToast();
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organize tasks by category
  const taskSections: TaskSection[] = [
    {
      id: 'morning-routine',
      title: 'Morning Routine',
      icon: Sunrise,
      color: 'bg-orange-500',
      tasks: tasks.filter(t => t.category === 'Morning Routine'),
      category: 'Morning Routine'
    },
    {
      id: 'daily-challenges',
      title: 'Daily Challenges',
      icon: Target,
      color: 'bg-blue-500',
      tasks: tasks.filter(t => t.category === 'Daily Challenges'),
      category: 'Daily Challenges'
    },
    {
      id: 'exercise',
      title: 'Exercise & Movement',
      icon: Zap,
      color: 'bg-green-500',
      tasks: tasks.filter(t => t.category === 'Exercise'),
      category: 'Exercise'
    },
    {
      id: 'herbal',
      title: 'Herbal Medicine',
      icon: Leaf,
      color: 'bg-emerald-500',
      tasks: tasks.filter(t => t.category === 'Herbal'),
      category: 'Herbal'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness & Meditation',
      icon: Heart,
      color: 'bg-purple-500',
      tasks: tasks.filter(t => t.category === 'Mindfulness'),
      category: 'Mindfulness'
    },
    {
      id: 'custom',
      title: 'Custom Tasks',
      icon: Star,
      color: 'bg-indigo-500',
      tasks: customTasks,
      category: 'Custom'
    }
  ];

  const handleTaskToggle = (taskId: string, category: string) => {
    const taskList = category === 'Custom' ? 'customTasks' : 'tasks';
    toggleTask(taskId, taskList);
    
    const allTasks = [...tasks, ...customTasks];
    const task = allTasks.find(t => t.id === taskId);
    
    if (task && !task.completed) {
      toast({
        title: `+${task.points} XP! 🎯`,
        description: task.title,
      });
      
      // Show floating points animation
      showFloatingPoints(task.points);
      
      // Check for milestones
      const newCompletedCount = allTasks.filter(t => t.completed).length + 1;
      if ([10, 25, 50, 100].includes(newCompletedCount)) {
        triggerConfetti();
      }
    }
  };

  const showFloatingPoints = (points: number) => {
    const el = document.createElement('div');
    el.textContent = `+${points} XP`;
    el.className = 'floating-points';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  const triggerConfetti = () => {
    // Simple confetti effect
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = 'confetti-fall 3s linear forwards';
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
      }, i * 10);
    }
  };

  const handleAddCustomTask = () => {
    setShowAddTaskDialog(true);
  };

  const handleSaveCustomTask = (taskData: any) => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);
    
    const newTask = {
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      frequency: taskData.frequency,
      points: taskData.points || 10,
      completed: false,
      dateAdded: new Date(),
      source: "Custom"
    };
    
    addCustomTask(newTask);
    setShowAddTaskDialog(false);
    toast({ title: "✅ Custom task added!" });
    
    // Reset submission lock after delay
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const getSectionProgress = (sectionTasks: any[]) => {
    const completed = sectionTasks.filter(t => t.completed).length;
    const total = sectionTasks.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getSectionPoints = (sectionTasks: any[]) => {
    return sectionTasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.points, 0);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="gradient-healing text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6" />
              <span>Wellness Progress</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalPoints} XP</div>
              <div className="text-sm opacity-90">{completionCount} tasks completed</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {taskSections.map((section) => {
          const progress = getSectionProgress(section.tasks);
          const points = getSectionPoints(section.tasks);
          const completedCount = section.tasks.filter(t => t.completed).length;
          
          return (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.color} text-white`}>
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div>{section.title}</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {completedCount}/{section.tasks.length} completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{points} XP</div>
                    <div className="text-sm text-muted-foreground">{progress}%</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-2" />
                
                <div className="space-y-3">
                  {section.tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <section.icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No tasks yet</p>
                      <p className="text-sm">Add your first task to get started!</p>
                    </div>
                  ) : (
                    section.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          task.completed 
                            ? "bg-green-50 border-green-200 dark:bg-green-950/20" 
                            : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                        }`}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskToggle(task.id, section.category)}
                          className={task.completed ? "border-green-500" : ""}
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${
                            task.completed && "line-through text-muted-foreground"
                          }`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <Badge variant={task.completed ? "default" : "secondary"}>
                          {task.points} XP
                        </Badge>
                      </div>
                    ))
                  )}
                </div>

                {section.id === 'custom' && (
                  <Button 
                    onClick={handleAddCustomTask}
                    variant="outline" 
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Task
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        onSave={handleSaveCustomTask}
      />

      {/* Floating Points CSS */}
      <style>{`
        .floating-points {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          font-weight: bold;
          color: #10b981;
          animation: floatUp 2s ease-out;
          pointer-events: none;
          z-index: 9999;
        }

        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -150%); }
        }

        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TaskManager;
