import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, CheckCircle2, Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const DailyChallenge = () => {
  const { challenges, addChallenge, updateChallengeProgress, addPoints } = useAppContext();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 30,
    type: 'daily' as 'daily' | 'weekly' | 'special',
    target: 1
  });

  // Safe access to challenges array
  const safeChallenges = challenges || [];

  const completeChallenge = (id: string) => {
    const challenge = safeChallenges.find(ch => ch.id === id);
    if (challenge && !challenge.completed) {
      updateChallengeProgress(id, challenge.target || 1);
      toast({
        title: '🎉 Challenge Complete!',
        description: `You earned ${challenge.points} points for "${challenge.title}"`,
      });
    }
  };

  const updateProgress = (id: string, increment: number) => {
    const challenge = safeChallenges.find(ch => ch.id === id);
    if (challenge && !challenge.completed) {
      const newProgress = Math.min((challenge.progress || 0) + increment, challenge.target || 1);
      updateChallengeProgress(id, newProgress);
      
      if (newProgress === (challenge.target || 1)) {
        toast({
          title: '🎉 Challenge Complete!',
          description: `You earned ${challenge.points} points for "${challenge.title}"`,
        });
      }
    }
  };

  const dailyChallenges = safeChallenges.filter(ch => ch.type === 'daily');
  const weeklyChallenges = safeChallenges.filter(ch => ch.type === 'weekly');
  const completedToday = dailyChallenges.filter(ch => ch.completed).length;

  const handleAddChallenge = () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    
    if (!formData.title.trim()) {
      toast({ title: '⚠️ Error', description: 'Please enter a challenge title', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    
    addChallenge({
      title: formData.title,
      description: formData.description,
      points: formData.points,
      type: formData.type,
      target: formData.target,
    });
    
    setShowAddDialog(false);
    setFormData({
      title: '',
      description: '',
      points: 30,
      type: 'daily',
      target: 1
    });
    toast({ title: '✅ Challenge added!', description: `"${formData.title}" is now in your challenges` });
    
    // Reset submission lock after delay
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Daily Challenges</h3>
          <p className="text-sm text-muted-foreground">
            Complete challenges to earn bonus points
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {completedToday}/{dailyChallenges.length} Complete
          </Badge>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Challenge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Challenge Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Walk 10,000 steps"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                      min={5}
                      max={200}
                    />
                  </div>
                </div>
                <div>
                  <Label>Target (times to complete)</Label>
                  <Input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={100}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={handleAddChallenge}>Add Challenge</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                {challenge.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  challenge.type === 'daily' ? <Star className="w-6 h-6" /> :
                  challenge.type === 'weekly' ? <Trophy className="w-6 h-6" /> :
                  <Zap className="w-6 h-6" />
                )}
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
                      Progress: {challenge.progress || 0}/{challenge.target || 1}
                    </span>
                    <span className="font-medium">
                      {Math.round(((challenge.progress || 0) / (challenge.target || 1)) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={((challenge.progress || 0) / (challenge.target || 1)) * 100} 
                    className="h-2"
                  />
                </div>

                {!challenge.completed && (challenge.progress || 0) < (challenge.target || 1) && (
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateProgress(challenge.id, 1)}
                    >
                      +1 Progress
                    </Button>
                    {(challenge.progress || 0) === (challenge.target || 1) - 1 && (
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
                    {challenge.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      challenge.type === 'daily' ? <Star className="w-6 h-6" /> :
                      challenge.type === 'weekly' ? <Trophy className="w-6 h-6" /> :
                      <Zap className="w-6 h-6" />
                    )}
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
                          Progress: {challenge.progress || 0}/{challenge.target || 1} days
                        </span>
                        <span className="font-medium">
                          {Math.round(((challenge.progress || 0) / (challenge.target || 1)) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={((challenge.progress || 0) / (challenge.target || 1)) * 100} 
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