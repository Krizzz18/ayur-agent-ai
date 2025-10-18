import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Flame, TrendingUp, AlertTriangle, CheckCircle, Coffee, Apple, Droplets, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgniLog {
  date: string;
  time: string;
  hunger: number;
  digestion: number;
  energy: number;
  bloating: number;
  agniScore: number;
  agniType: string;
}

const AgniTracker = () => {
  const { toast } = useToast();
  const [hunger, setHunger] = useState([7]);
  const [digestion, setDigestion] = useState([7]);
  const [energy, setEnergy] = useState([7]);
  const [bloating, setBloating] = useState([3]);
  
  const [logs, setLogs] = useState<AgniLog[]>([
    {
      date: new Date().toLocaleDateString(),
      time: '8:00 AM',
      hunger: 8,
      digestion: 7,
      energy: 8,
      bloating: 2,
      agniScore: 82,
      agniType: 'Sama Agni'
    }
  ]);

  const calculateAgniScore = () => {
    const hungerScore = hunger[0] * 10;
    const digestionScore = digestion[0] * 10;
    const energyScore = energy[0] * 10;
    const bloatingPenalty = bloating[0] * 5;
    
    return Math.max(0, Math.min(100, (hungerScore + digestionScore + energyScore) / 3 - bloatingPenalty));
  };

  const getAgniType = (score: number) => {
    if (score >= 80) return { name: 'Sama Agni', desc: 'Balanced digestive fire', color: 'bg-green-500' };
    if (score >= 60) return { name: 'Vishama Agni', desc: 'Irregular digestion (Vata)', color: 'bg-purple-500' };
    if (score >= 40) return { name: 'Tikshna Agni', desc: 'Sharp, excessive (Pitta)', color: 'bg-orange-500' };
    return { name: 'Manda Agni', desc: 'Slow, weak (Kapha)', color: 'bg-blue-500' };
  };

  const handleLogAgni = () => {
    const score = calculateAgniScore();
    const agniType = getAgniType(score);
    
    const newLog: AgniLog = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hunger: hunger[0],
      digestion: digestion[0],
      energy: energy[0],
      bloating: bloating[0],
      agniScore: Math.round(score),
      agniType: agniType.name
    };

    setLogs([newLog, ...logs]);
    
    toast({
      title: '🔥 Agni Logged Successfully',
      description: `Your digestive fire is ${agniType.name} (${Math.round(score)}%)`
    });
  };

  const currentScore = calculateAgniScore();
  const currentType = getAgniType(currentScore);

  const getRecommendations = () => {
    if (currentScore >= 80) {
      return [
        '✅ Maintain regular meal times',
        '✅ Continue with balanced, warm foods',
        '✅ Stay hydrated with warm water'
      ];
    } else if (currentScore >= 60) {
      return [
        '⚠️ Eat warm, cooked, easily digestible foods',
        '⚠️ Avoid cold, raw, or dry foods',
        '⚠️ Use ginger tea before meals'
      ];
    } else if (currentScore >= 40) {
      return [
        '⚠️ Avoid spicy, fried, acidic foods',
        '⚠️ Eat cooling foods like cucumber, coconut',
        '⚠️ Practice calming breathing exercises'
      ];
    } else {
      return [
        '❌ Avoid heavy, cold, oily foods',
        '❌ Include light, warm, spiced meals',
        '❌ Exercise regularly to stimulate metabolism'
      ];
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold gradient-healing bg-clip-text text-transparent flex items-center gap-2">
        <Flame className="text-orange-500" />
        Agni (Digestive Fire) Tracker
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Assessment */}
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${currentType.color} text-white mb-4 animate-pulse`}>
              <Flame className="w-16 h-16" />
            </div>
            <h3 className="text-2xl font-bold">{currentType.name}</h3>
            <p className="text-muted-foreground">{currentType.desc}</p>
            <div className="mt-4">
              <span className="text-5xl font-bold">{Math.round(currentScore)}%</span>
              <Progress value={currentScore} className="h-3 mt-2" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  Hunger Level
                </label>
                <span className="text-lg font-semibold">{hunger[0]}/10</span>
              </div>
              <Slider value={hunger} onValueChange={setHunger} max={10} step={1} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Digestion Quality
                </label>
                <span className="text-lg font-semibold">{digestion[0]}/10</span>
              </div>
              <Slider value={digestion} onValueChange={setDigestion} max={10} step={1} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Energy Level
                </label>
                <span className="text-lg font-semibold">{energy[0]}/10</span>
              </div>
              <Slider value={energy} onValueChange={setEnergy} max={10} step={1} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Bloating/Discomfort
                </label>
                <span className="text-lg font-semibold">{bloating[0]}/10</span>
              </div>
              <Slider value={bloating} onValueChange={setBloating} max={10} step={1} />
            </div>
          </div>

          <Button onClick={handleLogAgni} className="w-full gradient-healing text-white">
            <Flame className="w-4 h-4 mr-2" />
            Log Agni Status
          </Button>
        </Card>

        {/* Recommendations & History */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
            <ul className="space-y-2">
              {getRecommendations().map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Logs</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <Card key={i} className="p-4 bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{log.time}</span>
                    </div>
                    <Badge className={getAgniType(log.agniScore).color + ' text-white'}>
                      {log.agniScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.agniType}</p>
                  <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                    <div>Hunger: {log.hunger}</div>
                    <div>Digestion: {log.digestion}</div>
                    <div>Energy: {log.energy}</div>
                    <div>Bloating: {log.bloating}</div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgniTracker;