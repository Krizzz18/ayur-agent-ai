import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wind, Flame, Mountain, TrendingUp, AlertTriangle } from 'lucide-react';

interface DoshaAnalysisChartProps {
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  dominantDosha: string;
  imbalances?: string[];
  recommendations?: string[];
}

const DoshaAnalysisChart: React.FC<DoshaAnalysisChartProps> = ({
  vataScore,
  pittaScore,
  kaphaScore,
  dominantDosha,
  imbalances = [],
  recommendations = []
}) => {
  const doshas = [
    { name: 'Vata', score: vataScore, icon: Wind, color: 'from-purple-500 to-blue-500', bgClass: 'bg-purple-100 dark:bg-purple-900/20' },
    { name: 'Pitta', score: pittaScore, icon: Flame, color: 'from-orange-500 to-red-500', bgClass: 'bg-orange-100 dark:bg-orange-900/20' },
    { name: 'Kapha', score: kaphaScore, icon: Mountain, color: 'from-green-500 to-teal-500', bgClass: 'bg-green-100 dark:bg-green-900/20' }
  ];

  const maxScore = Math.max(vataScore, pittaScore, kaphaScore);

  return (
    <Card className="p-6 space-y-6 shadow-lotus">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Dosha Constitution Analysis</h3>
        <Badge variant="secondary" className="gradient-healing text-white px-4 py-1">
          Dominant: {dominantDosha}
        </Badge>
      </div>

      {/* Visual Dosha Bars */}
      <div className="space-y-6">
        {doshas.map(({ name, score, icon: Icon, color, bgClass }) => (
          <div key={name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{score}%</span>
                {score === maxScore && (
                  <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
                )}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${bgClass} transition-all hover:scale-[1.02]`}>
              <Progress value={score} className="h-3" />
              <div className={`mt-2 h-2 bg-gradient-to-r ${color} rounded-full`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart Visualization */}
      <div className="flex justify-center my-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
            {/* Vata segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#vata-gradient)"
              strokeWidth="20"
              strokeDasharray={`${vataScore * 2.51} ${251 - vataScore * 2.51}`}
              strokeDashoffset="0"
            />
            {/* Pitta segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#pitta-gradient)"
              strokeWidth="20"
              strokeDasharray={`${pittaScore * 2.51} ${251 - pittaScore * 2.51}`}
              strokeDashoffset={`${-vataScore * 2.51}`}
            />
            {/* Kapha segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#kapha-gradient)"
              strokeWidth="20"
              strokeDasharray={`${kaphaScore * 2.51} ${251 - kaphaScore * 2.51}`}
              strokeDashoffset={`${-(vataScore + pittaScore) * 2.51}`}
            />
            <defs>
              <linearGradient id="vata-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="pitta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="kapha-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Imbalances */}
      {imbalances.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h4 className="font-semibold">Detected Imbalances</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {imbalances.map((imbalance, i) => (
              <Badge key={i} variant="destructive">
                {imbalance}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold">Balancing Recommendations</h4>
          <ul className="space-y-1 text-sm">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default DoshaAnalysisChart;