import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wind, Flame, Mountain, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    vata: number;
    pitta: number;
    kapha: number;
  }[];
}

const PrakritiQuizComponent = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0 });
  const [quizComplete, setQuizComplete] = useState(false);

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
        { text: 'Fluctuating, bursts of energy followed by fatigue', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Consistent and strong', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Steady but slow to start', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 7,
      question: 'What is your natural body temperature preference?',
      options: [
        { text: 'Prefer warmth, feel cold easily', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Prefer cool environments, feel hot', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Comfortable in most temperatures', vata: 0, pitta: 0, kapha: 3 }
      ]
    },
    {
      id: 8,
      question: 'How would you describe your mind and thoughts?',
      options: [
        { text: 'Quick, creative, easily distracted', vata: 3, pitta: 0, kapha: 0 },
        { text: 'Sharp, focused, competitive', vata: 0, pitta: 3, kapha: 0 },
        { text: 'Calm, steady, slow to process', vata: 0, pitta: 0, kapha: 3 }
      ]
    }
  ];

  const handleAnswer = (option: { text: string; vata: number; pitta: number; kapha: number }) => {
    setScores({
      vata: scores.vata + option.vata,
      pitta: scores.pitta + option.pitta,
      kapha: scores.kapha + option.kapha
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
      toast({
        title: '🎉 Quiz Complete!',
        description: 'Your Prakriti analysis is ready'
      });
    }
  };

  const getDominantDosha = () => {
    const max = Math.max(scores.vata, scores.pitta, scores.kapha);
    if (scores.vata === max) return { name: 'Vata', icon: Wind, color: 'gradient-vata' };
    if (scores.pitta === max) return { name: 'Pitta', icon: Flame, color: 'gradient-pitta' };
    return { name: 'Kapha', icon: Mountain, color: 'gradient-kapha' };
  };

  const getPercentage = (score: number) => {
    const total = scores.vata + scores.pitta + scores.kapha;
    return Math.round((score / total) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ vata: 0, pitta: 0, kapha: 0 });
    setQuizComplete(false);
  };

  if (quizComplete) {
    const dominant = getDominantDosha();
    const Icon = dominant.icon;

    return (
      <div className="space-y-6">
        <Card className={`p-8 text-center space-y-6 ${dominant.color} text-white`}>
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <Icon className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Your Dominant Dosha: {dominant.name}</h2>
          <p className="text-lg opacity-90">
            Based on your responses, your Prakriti (constitutional type) is primarily {dominant.name}.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Detailed Breakdown</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">Vata (Air + Space)</span>
                </div>
                <span className="text-2xl font-bold">{getPercentage(scores.vata)}%</span>
              </div>
              <Progress value={getPercentage(scores.vata)} className="h-3" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">Pitta (Fire + Water)</span>
                </div>
                <span className="text-2xl font-bold">{getPercentage(scores.pitta)}%</span>
              </div>
              <Progress value={getPercentage(scores.pitta)} className="h-3" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Kapha (Earth + Water)</span>
                </div>
                <span className="text-2xl font-bold">{getPercentage(scores.kapha)}%</span>
              </div>
              <Progress value={getPercentage(scores.kapha)} className="h-3" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={resetQuiz} variant="outline" className="flex-1">
              Retake Quiz
            </Button>
            <Button className="flex-1 gradient-healing text-white">
              View Personalized Plan
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Prakriti Assessment Quiz</h3>
            <Badge variant="secondary">
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
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
    </div>
  );
};

export default PrakritiQuizComponent;