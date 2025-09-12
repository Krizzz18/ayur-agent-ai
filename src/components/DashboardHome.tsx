import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sunrise, 
  Moon, 
  Droplets, 
  Wind, 
  Flame, 
  Mountain,
  Calendar,
  Heart,
  Leaf,
  Sun
} from 'lucide-react';

interface DashboardHomeProps {
  userDosha?: string;
  todayProgress?: number;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  userDosha = 'Vata', 
  todayProgress = 65 
}) => {
  const doshaInfo = {
    Vata: {
      element: 'Air & Space',
      icon: Wind,
      description: 'Movement and change',
      color: 'vata',
      characteristics: ['Creative', 'Energetic', 'Quick thinking']
    },
    Pitta: {
      element: 'Fire & Water',
      icon: Flame,
      description: 'Transformation and metabolism',
      color: 'pitta',
      characteristics: ['Focused', 'Determined', 'Sharp intellect']
    },
    Kapha: {
      element: 'Earth & Water',
      icon: Mountain,
      description: 'Structure and stability',
      color: 'kapha',
      characteristics: ['Calm', 'Stable', 'Nurturing']
    }
  };

  const currentDosha = doshaInfo[userDosha as keyof typeof doshaInfo];
  const Icon = currentDosha.icon;

  const todayTasks = [
    { id: 1, task: 'Morning oil massage', completed: true, time: '6:00 AM' },
    { id: 2, task: 'Warm breakfast', completed: true, time: '7:30 AM' },
    { id: 3, task: 'Midday meditation', completed: false, time: '12:00 PM' },
    { id: 4, task: 'Herbal tea', completed: false, time: '3:00 PM' },
    { id: 5, task: 'Evening yoga', completed: false, time: '6:00 PM' },
  ];

  const weatherAdvice = {
    temp: 28,
    condition: 'Sunny',
    advice: 'Perfect day for cooling Pitta practices. Stay hydrated and avoid midday sun.'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 gradient-healing text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back! 🙏</h1>
            <p className="text-white/90">
              Continue your {userDosha} balancing journey today
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{todayProgress}%</div>
            <p className="text-white/90">Today's Progress</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dosha Profile */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full gradient-${currentDosha.color.toLowerCase()} flex items-center justify-center`}>
              <Icon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Your Dosha: {userDosha}</h3>
              <p className="text-muted-foreground text-sm">{currentDosha.element}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {currentDosha.description}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Characteristics:</h4>
            {currentDosha.characteristics.map((char, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                <span className="text-sm">{char}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Weather */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="text-secondary" size={24} />
            <div>
              <h3 className="text-lg font-semibold">Weather Guidance</h3>
              <p className="text-muted-foreground text-sm">{weatherAdvice.temp}°C • {weatherAdvice.condition}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {weatherAdvice.advice}
          </p>
          
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Seasonal Tips
          </Button>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">This Week</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Routines Completed</span>
              <span className="font-semibold">18/21</span>
            </div>
            <Progress value={85} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Meditation Minutes</span>
              <span className="font-semibold">105</span>
            </div>
            <Progress value={70} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Herbs Taken</span>
              <span className="font-semibold">12/14</span>
            </div>
            <Progress value={86} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} />
            Today's Ayurvedic Routine
          </h3>
          <div className="text-sm text-muted-foreground">
            {todayTasks.filter(t => t.completed).length}/{todayTasks.length} completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {todayTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`p-4 transition-ayur cursor-pointer ${
                task.completed ? 'bg-secondary/20 border-secondary' : 'hover:shadow-gentle'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  task.completed 
                    ? 'bg-secondary border-secondary' 
                    : 'border-muted-foreground'
                }`}>
                  {task.completed && (
                    <div className="w-full h-full rounded-full bg-secondary"></div>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}>
                    {task.task}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="vata" className="h-20 flex-col gap-2">
          <Sunrise size={24} />
          <span>Morning Routine</span>
        </Button>
        
        <Button variant="pitta" className="h-20 flex-col gap-2">
          <Droplets size={24} />
          <span>Hydration Tracker</span>
        </Button>
        
        <Button variant="kapha" className="h-20 flex-col gap-2">
          <Leaf size={24} />
          <span>Herb Reminder</span>
        </Button>
        
        <Button variant="healing" className="h-20 flex-col gap-2">
          <Heart size={24} />
          <span>Wellness Check</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHome;