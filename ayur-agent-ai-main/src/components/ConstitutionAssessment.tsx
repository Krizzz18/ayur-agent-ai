import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Wind, Flame, Mountain, ArrowRight, CheckCircle, Apple, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; vata: number; pitta: number; kapha: number; }[];
}

const ConstitutionAssessment = () => {
  const { toast } = useToast();
  const { userProfile, setUserProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('prakriti');
  
  // Prakriti Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0 });
  const [quizComplete, setQuizComplete] = useState(false);

  // Agni Tracker State
  const [hunger, setHunger] = useState([7]);
  const [digestion, setDigestion] = useState([7]);
  const [energy, setEnergy] = useState([7]);
  const [bloating, setBloating] = useState([3]);
  const [agniLogs, setAgniLogs] = useState<any[]>([]);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'How would you describe your body frame?',
      options: [
        { text: 'Thin and lean, hard to gain weight', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Medium build, athletic', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Large frame, easy to gain weight', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 2,
      question: 'What is your skin type?',
      options: [
        { text: 'Dry, rough, cold', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Warm, oily, prone to rashes', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Thick, smooth, cool, oily', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 3,
      question: 'How is your digestion?',
      options: [
        { text: 'Irregular, gas and bloating', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Strong, sharp hunger, acidity', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Slow, heavy after meals', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 4,
      question: 'How do you handle stress?',
      options: [
        { text: 'Anxious, worried, restless', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Irritable, angry, critical', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Calm, withdrawn, avoid confrontation', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 5,
      question: 'What is your sleep pattern?',
      options: [
        { text: 'Light sleeper, easily disturbed', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Moderate sleep, wake up refreshed', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Deep sleeper, hard to wake up', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 6,
      question: 'How is your energy level throughout the day?',
      options: [
        { text: 'Fluctuating, bursts followed by fatigue', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Consistent and strong', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Steady but slow to start', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 7,
      question: 'What is your natural temperature preference?',
      options: [
        { text: 'Prefer warmth, feel cold easily', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Prefer cool environments', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Comfortable in most temperatures', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 8,
      question: 'How would you describe your mind?',
      options: [
        { text: 'Quick, creative, easily distracted', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Sharp, focused, competitive', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Calm, steady, slow to process', vata: 0, pitta: 0, kapha: 3 }
      ]
    }
  ];

  const handleAnswer = (option: any) => {
    const newScores = {
      vata: scores.vata + option.vata,
      pitta: scores.pitta + option.pitta,
      kapha: scores.kapha + option.kapha
    };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const dominant = getDominantDosha(newScores);
      setUserProfile({ dosha: dominant.name, prakritiCompleted: true });
      setQuizComplete(true);
      toast({
        title: '🎉 Assessment Complete!',
        description: `Your dominant Dosha is ${dominant.name}`
      });
    }
  };

  const getDominantDosha = (s = scores) => {
    const max = Math.max(s.vata, s.pitta, s.kapha);
    if (s.vata === max) return { name: 'Vata', icon: Wind, color: 'gradient-vata' };
    if (s.pitta === max) return { name: 'Pitta', icon: Flame, color: 'gradient-pitta' };
    return { name: 'Kapha', icon: Mountain, color: 'gradient-kapha' };
  };

  const getPercentage = (score: number) => {
    const total = scores.vata + scores.pitta + scores.kapha;
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ vata: 0, pitta: 0, kapha: 0 });
    setQuizComplete(false);
  };

  // Agni Functions
  const calculateAgniScore = () => {
    const hungerScore = hunger[0] * 10;
    const digestionScore = digestion[0] * 10;
    const energyScore = energy[0] * 10;
    const bloatingPenalty = bloating[0] * 5;
    return Math.max(0, Math.min(100, (hungerScore + digestionScore + energyScore) / 3 - bloatingPenalty));
  };

  const getAgniType = (score: number) => {
    if (score >= 80) return { name: 'Sama Agni', desc: 'Balanced digestive fire', color: 'bg-green-500' };
    if (score >= 60) return { name: 'Vishama Agni', desc: 'Irregular (Vata)', color: 'bg-purple-500' };
    if (score >= 40) return { name: 'Tikshna Agni', desc: 'Sharp (Pitta)', color: 'bg-orange-500' };
    return { name: 'Manda Agni', desc: 'Slow (Kapha)', color: 'bg-blue-500' };
  };

  const handleLogAgni = () => {
    const score = calculateAgniScore();
    const agniType = getAgniType(score);
    
    const newLog = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hunger: hunger[0],
      digestion: digestion[0],
      energy: energy[0],
      bloating: bloating[0],
      agniScore: Math.round(score),
      agniType: agniType.name
    };

    setAgniLogs([newLog, ...agniLogs]);
    toast({
      title: '🔥 Agni Logged',
      description: `${agniType.name} (${Math.round(score)}%)`
    });
  };

  const currentAgniScore = calculateAgniScore();
  const currentAgniType = getAgniType(currentAgniScore);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-3xl font-bold gradient-healing bg-clip-text text-transparent">
          Complete Constitution Assessment
        </h2>
        <p className="text-muted-foreground mt-2">
          Discover your Prakriti (body constitution) and track your Agni (digestive fire) in one comprehensive module
        </p>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prakriti">Prakriti Quiz</TabsTrigger>
          <TabsTrigger value="agni">Agni Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="prakriti" className="space-y-6">
          {quizComplete ? (
            <>
              <Card className={`p-8 text-center space-y-6 ${getDominantDosha().color} text-white`}>
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                    {React.createElement(getDominantDosha().icon, { className: 'w-12 h-12' })}
                  </div>
                </div>
                <h2 className="text-3xl font-bold">Your Dominant Dosha: {getDominantDosha().name}</h2>
                <p className="text-lg opacity-90">
                  Your Prakriti (constitutional type) is primarily {getDominantDosha().name}
                </p>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">Detailed Breakdown</h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Vata', icon: Wind, score: scores.vata, color: 'text-purple-500' },
                    { name: 'Pitta', icon: Flame, score: scores.pitta, color: 'text-orange-500' },
                    { name: 'Kapha', icon: Mountain, score: scores.kapha, color: 'text-green-500' }
                  ].map(({ name, icon: Icon, score, color }) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${color}`} />
                          <span className="font-semibold">{name}</span>
                        </div>
                        <span className="text-2xl font-bold">{getPercentage(score)}%</span>
                      </div>
                      <Progress value={getPercentage(score)} className="h-3" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={resetQuiz} variant="outline" className="flex-1">
                    Retake Quiz
                  </Button>
                  <Button 
                    className="flex-1 gradient-healing text-white"
                    onClick={() => {
                      if (userProfile.prakritiCompleted) {
                        // Navigate to plans view
                        window.location.href = '/dashboard/plans';
                      } else {
                        toast({ title: "Complete your Prakriti assessment first!" });
                      }
                    }}
                  >
                    View Personalized Plan
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Prakriti Assessment Quiz</h3>
                    <Badge variant="secondary">
                      {currentQuestion + 1} / {questions.length}
                    </Badge>
                  </div>
                  <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
                </div>
              </Card>

              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">{questions[currentQuestion].question}</h2>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left p-6 h-auto hover:border-primary hover:shadow-lg transition-all"
                      onClick={() => handleAnswer(option)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option.text}</span>
                      </div>
                      <ArrowRight className="ml-auto w-5 h-5" />
                    </Button>
                  ))}
                </div>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="agni" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${currentAgniType.color} text-white mb-4 animate-pulse`}>
                  <Flame className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold">{currentAgniType.name}</h3>
                <p className="text-muted-foreground">{currentAgniType.desc}</p>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{Math.round(currentAgniScore)}%</span>
                  <Progress value={currentAgniScore} className="h-3 mt-2" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Hunger Level', icon: Apple, value: hunger, setter: setHunger },
                  { label: 'Digestion Quality', icon: CheckCircle, value: digestion, setter: setDigestion },
                  { label: 'Energy Level', icon: TrendingUp, value: energy, setter: setEnergy },
                  { label: 'Bloating/Discomfort', icon: AlertTriangle, value: bloating, setter: setBloating }
                ].map(({ label, icon: Icon, value, setter }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </label>
                      <span className="text-lg font-semibold">{value[0]}/10</span>
                    </div>
                    <Slider value={value} onValueChange={setter} max={10} step={1} />
                  </div>
                ))}
              </div>

              <Button onClick={handleLogAgni} className="w-full gradient-healing text-white">
                <Flame className="w-4 h-4 mr-2" />
                Log Agni Status
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Logs</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {agniLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No logs yet</p>
                ) : (
                  agniLogs.map((log, i) => (
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
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConstitutionAssessment;
