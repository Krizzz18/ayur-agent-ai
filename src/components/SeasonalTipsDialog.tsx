import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, Snowflake, Flower, Leaf, Droplets } from 'lucide-react';

interface SeasonalTipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userDosha: string;
}

const SeasonalTipsDialog: React.FC<SeasonalTipsDialogProps> = ({ open, onOpenChange, userDosha }) => {
  const currentMonth = new Date().getMonth();
  
  const getSeason = () => {
    if (currentMonth >= 2 && currentMonth <= 4) return 'Spring';
    if (currentMonth >= 5 && currentMonth <= 7) return 'Summer';
    if (currentMonth >= 8 && currentMonth <= 10) return 'Autumn';
    return 'Winter';
  };

  const season = getSeason();

  const seasonalTips: Record<string, { icon: any; color: string; tips: Record<string, string[]> }> = {
    Spring: {
      icon: Flower,
      color: 'text-pink-500',
      tips: {
        Vata: [
          'Continue with warm, grounding foods',
          'Practice gentle yoga and breathing',
          'Maintain regular sleep schedule',
          'Use warming spices like ginger and cinnamon'
        ],
        Pitta: [
          'Favor cooling foods and herbs',
          'Avoid excessive heat and sun exposure',
          'Practice meditation and calming activities',
          'Include cucumber, mint, and coconut'
        ],
        Kapha: [
          'Increase physical activity and exercise',
          'Favor light, warm, spiced foods',
          'Reduce heavy, oily, and cold foods',
          'Wake up early and stay active'
        ]
      }
    },
    Summer: {
      icon: Sun,
      color: 'text-yellow-500',
      tips: {
        Vata: [
          'Stay hydrated with room temperature water',
          'Eat sweet, ripe, juicy fruits',
          'Avoid too much sun exposure',
          'Practice cooling breathing (Sheetali)'
        ],
        Pitta: [
          'Favor cooling, sweet foods',
          'Avoid spicy, sour, and salty tastes',
          'Spend time near water',
          'Practice moonlight walks',
          'Use coconut oil for massage'
        ],
        Kapha: [
          'Stay active despite the heat',
          'Favor light, dry foods',
          'Drink warm ginger water',
          'Wake up before sunrise'
        ]
      }
    },
    Autumn: {
      icon: Leaf,
      color: 'text-orange-500',
      tips: {
        Vata: [
          'Establish routine and consistency',
          'Favor warm, cooked, oily foods',
          'Self-massage with sesame oil',
          'Practice grounding yoga',
          'Stay warm and avoid drafts'
        ],
        Pitta: [
          'Balance cooling and warming foods',
          'Avoid excessive dryness',
          'Practice moderate exercise',
          'Include sweet and bitter tastes'
        ],
        Kapha: [
          'Maintain physical activity',
          'Favor warm, light foods',
          'Use stimulating spices',
          'Avoid afternoon naps'
        ]
      }
    },
    Winter: {
      icon: Snowflake,
      color: 'text-blue-500',
      tips: {
        Vata: [
          'Eat warm, nourishing, oily foods',
          'Stay warm and cozy',
          'Practice oil massage daily',
          'Drink warm herbal teas',
          'Maintain regular routine'
        ],
        Pitta: [
          'Balance warming and cooling foods',
          'Stay moderately active',
          'Avoid excessive heating',
          'Include warming spices in moderation'
        ],
        Kapha: [
          'Increase exercise and activity',
          'Favor warm, light, spiced foods',
          'Reduce heavy, cold, oily foods',
          'Wake up early (before 6 AM)',
          'Use dry brushing massage'
        ]
      }
    }
  };

  const currentSeasonData = seasonalTips[season];
  const Icon = currentSeasonData.icon;
  const doshaKey = userDosha || 'Vata';
  const tips = currentSeasonData.tips[doshaKey] || currentSeasonData.tips.Vata;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Icon className={`w-8 h-8 ${currentSeasonData.color}`} />
            {season} Season Tips for {doshaKey}
          </DialogTitle>
          <DialogDescription>
            Personalized Ayurvedic recommendations for the current season
          </DialogDescription>
        </DialogHeader>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              Current Season: {season}
            </Badge>
            <Badge className="gradient-healing text-white text-lg px-4 py-1">
              Your Dosha: {doshaKey}
            </Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Seasonal Recommendations:</h4>
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>

          <Card className="p-4 bg-accent/10 border-accent">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              General Seasonal Wisdom
            </h5>
            <p className="text-sm text-muted-foreground">
              {season === 'Spring' && 'Spring is the time for renewal and cleansing. Focus on lightening your diet and increasing physical activity.'}
              {season === 'Summer' && 'Summer brings heat and intensity. Stay cool, hydrated, and maintain a balanced routine to prevent Pitta aggravation.'}
              {season === 'Autumn' && 'Autumn is Vata season with dry, windy qualities. Establish routine, stay grounded, and nourish your body.'}
              {season === 'Winter' && 'Winter calls for warmth and nourishment. Build strength with warming foods and maintain regular self-care practices.'}
            </p>
          </Card>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonalTipsDialog;
