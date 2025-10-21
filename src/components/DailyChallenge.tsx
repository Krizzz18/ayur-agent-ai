import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  target: number;
  completed: boolean;
  icon: React.ReactNode;
}

const DailyChallenge = () => {
  const { addPoints } = useAppContext();
  const { toast } = useToast();

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Early Riser',
      description: 'Complete morning routine before 7 AM',
      points: 50,
      type: 'daily',
      progress: 1,
      target: 1,
      completed: false,
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: '2',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water today',
      points: 30,
      type: 'daily',
      progress: 5,
      target: 8,
      completed: false,
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: '3',
      title: 'Mindful Moments',
      description: 'Complete 3 meditation sessions',
      points: 40,
      type: 'daily',
      progress: 1,
      target: 3,
      completed: false,
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: '4',
      title: 'Weekly Warrior',
      description: 'Complete all daily tasks for 7 days',
      points: 200,
      type: 'weekly',
      progress: 4,
      target: 7,
      completed: false,
      icon: <Trophy className="w-5 h-5" />,
    },
  ]);

  const completeChallenge = (id: string) => {
    setChallenges(challenges.map(ch => {
      if (ch.id === id && !ch.completed) {
        addPoints(ch.points);
        toast({
          title: '🎉 Challenge Complete!',
          description: `You earned ${ch.points} points for "${ch.title}"`,
        });
        return { ...ch, completed: true, progress: ch.target };
      }
      return ch;
    }));
  };

  const updateProgress = (id: string, increment: number) => {
    setChallenges(challenges.map(ch => {
      if (ch.id === id && !ch.completed) {
        const newProgress = Math.min(ch.progress + increment, ch.target);
        if (newProgress === ch.target) {
          addPoints(ch.points);
          toast({
            title: '🎉 Challenge Complete!',
            description: `You earned ${ch.points} points for "${ch.title}"`,
          });
          return { ...ch, completed: true, progress: newProgress };
        }
        return { ...ch, progress: newProgress };
      }
      return ch;
    }));
  };

  const dailyChallenges = challenges.filter(ch => ch.type === 'daily');
  const weeklyChallenges = challenges.filter(ch => ch.type === 'weekly');
  const completedToday = dailyChallenges.filter(ch => ch.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Daily Challenges</h3>
          <p className="text-sm text-muted-foreground">
            Complete challenges to earn bonus points
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {completedToday}/{dailyChallenges.length} Complete
        </Badge>
      </div>

      {/* Daily Challenges */}
      <div className="space-y-3">
        {dailyChallenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            className={`p-4 transition-all ${
              challenge.completed 
                ? 'bg-secondary/20 border-secondary' 
                : 'hover:shadow-gentle'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                challenge.completed 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {challenge.completed ? <CheckCircle2 className="w-6 h-6" /> : challenge.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${
                      challenge.completed ? 'text-muted-foreground line-through' : ''
                    }`}>
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    +{challenge.points}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress: {challenge.progress}/{challenge.target}
                    </span>
                    <span className="font-medium">
                      {Math.round((challenge.progress / challenge.target) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className="h-2"
                  />
                </div>

                {!challenge.completed && challenge.progress < challenge.target && (
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateProgress(challenge.id, 1)}
                    >
                      +1 Progress
                    </Button>
                    {challenge.progress === challenge.target - 1 && (
                      <Button 
                        size="sm"
                        onClick={() => completeChallenge(challenge.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Challenges */}
      {weeklyChallenges.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-6">
            <Trophy className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold">Weekly Challenges</h3>
          </div>
          
          <div className="space-y-3">
            {weeklyChallenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className={`p-4 transition-all ${
                  challenge.completed 
                    ? 'bg-secondary/20 border-secondary' 
                    : 'hover:shadow-gentle'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    challenge.completed 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {challenge.completed ? <CheckCircle2 className="w-6 h-6" /> : challenge.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-semibold ${
                          challenge.completed ? 'text-muted-foreground line-through' : ''
                        }`}>
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {challenge.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        +{challenge.points}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progress: {challenge.progress}/{challenge.target} days
                        </span>
                        <span className="font-medium">
                          {Math.round((challenge.progress / challenge.target) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyChallenge;