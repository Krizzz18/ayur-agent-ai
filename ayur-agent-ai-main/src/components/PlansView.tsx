import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Utensils, 
  Leaf, 
  Heart, 
  Download,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';
import TaskManager from './TaskManager';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Plan {
  id: string;
  title: string;
  items: string[];
  completed: number;
  total: number;
  icon: React.ComponentType<any>;
  variant: string;
}

interface PlansViewProps {
  userDosha?: string;
  recommendations?: any;
}

const PlansView: React.FC<PlansViewProps> = ({ 
  userDosha = 'Vata', 
  recommendations 
}) => {
  const [expandedPlans, setExpandedPlans] = useState<string[]>(['routine']);
  const [itemStates, setItemStates] = useState<Record<string, boolean>>({});

  const togglePlan = (planId: string) => {
    setExpandedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const defaultRecommendations = {
    dailyRoutine: [
      "Wake up at 6 AM consistently",
      "Start with warm oil massage (Abhyanga)",
      "Practice gentle yoga or stretching",
      "Eat warm, cooked meals at regular times",
      "Meditation for 15 minutes before sleep"
    ],
    diet: [
      "Warm, moist, and slightly oily foods",
      "Cooked grains like rice and oats",
      "Root vegetables and sweet fruits",
      "Warm milk with spices before bed",
      "Avoid cold, dry, and raw foods"
    ],
    herbs: [
      "Ashwagandha for stress relief",
      "Brahmi for mental clarity",
      "Jatamansi for better sleep",
      "Warm sesame oil for massage"
    ]
  };

  const currentRecommendations = recommendations || defaultRecommendations;

  const plans: Plan[] = [
    {
      id: 'routine',
      title: 'Daily Routine (Dinacharya)',
      items: currentRecommendations.dailyRoutine,
      completed: 3,
      total: currentRecommendations.dailyRoutine.length,
      icon: Clock,
      variant: 'vata'
    },
    {
      id: 'diet',
      title: 'Dietary Guidelines',
      items: currentRecommendations.diet,
      completed: 2,
      total: currentRecommendations.diet.length,
      icon: Utensils,
      variant: 'pitta'
    },
    {
      id: 'herbs',
      title: 'Herbal Medicine',
      items: currentRecommendations.herbs,
      completed: 1,
      total: currentRecommendations.herbs.length,
      icon: Leaf,
      variant: 'kapha'
    }
  ];

  const weeklySchedule = [
    {
      day: 'Monday',
      focus: 'Grounding & Stability',
      activities: ['Oil massage', 'Meditation', 'Warm breakfast', 'Evening walk']
    },
    {
      day: 'Tuesday', 
      focus: 'Energy & Movement',
      activities: ['Yoga practice', 'Herbal tea', 'Light lunch', 'Breathing exercises']
    },
    {
      day: 'Wednesday',
      focus: 'Mental Clarity',
      activities: ['Reading', 'Brahmi supplement', 'Warm meals', 'Early sleep']
    },
    {
      day: 'Thursday',
      focus: 'Digestive Health',
      activities: ['Triphala', 'Ginger tea', 'Light dinner', 'Gentle yoga']
    },
    {
      day: 'Friday',
      focus: 'Emotional Balance',
      activities: ['Meditation', 'Ashwagandha', 'Social time', 'Calming music']
    },
    {
      day: 'Saturday',
      focus: 'Rejuvenation',
      activities: ['Longer massage', 'Nature walk', 'Healthy cooking', 'Rest']
    },
    {
      day: 'Sunday',
      focus: 'Spiritual Practice',
      activities: ['Extended meditation', 'Pranayama', 'Light meals', 'Planning']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your {userDosha} Wellness Plans</h1>
          <p className="text-muted-foreground">
            Personalized Ayurvedic recommendations for optimal health
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={async () => {
          const { exportDietChartToPDF } = await import('@/lib/pdfExport');
          const plans = [
            { id: '1', mealTime: 'Daily Routine', foods: currentRecommendations.dailyRoutine.map((item: string, i: number) => ({
              id: `routine-${i}`, name: item, category: 'Routine', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, dosha: userDosha, serving: '1x'
            })), completed: false },
            { id: '2', mealTime: 'Dietary Guidelines', foods: currentRecommendations.diet.map((item: string, i: number) => ({
              id: `diet-${i}`, name: item, category: 'Diet', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, dosha: userDosha, serving: '1x'
            })), completed: false },
            { id: '3', mealTime: 'Herbal Medicine', foods: currentRecommendations.herbs.map((item: string, i: number) => ({
              id: `herb-${i}`, name: item, category: 'Herbs', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, dosha: userDosha, serving: '1x'
            })), completed: false }
          ];
          exportDietChartToPDF(plans, 'Wellness Plan');
        }}>
          <Download size={16} />
          Export Plans
        </Button>
      </div>

      {/* Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isExpanded = expandedPlans.includes(plan.id);
          const completionRate = Math.round((plan.completed / plan.total) * 100);
          
          return (
            <Card key={plan.id} className="overflow-hidden">
              <Collapsible 
                open={isExpanded} 
                onOpenChange={() => togglePlan(plan.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="p-6 cursor-pointer hover:bg-muted/50 transition-ayur">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full gradient-${plan.variant} flex items-center justify-center`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    <h3 className="font-semibold mb-2">{plan.title}</h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {plan.completed}/{plan.total} completed
                      </span>
                      <Badge variant={completionRate > 50 ? 'default' : 'secondary'}>
                        {completionRate}%
                      </Badge>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`gradient-${plan.variant} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                    <div className="px-6 pb-6 border-t border-border">
                  <div className="space-y-3 mt-4">
                      {plan.items.map((item, index) => {
                        const key = `${plan.id}-${index}`;
                        const itemCompleted = itemStates[key] ?? (index < plan.completed);
                        return (
                          <div key={index} className="flex items-start gap-3 group">
                            <RadioGroup 
                              value={itemCompleted ? 'completed' : 'pending'}
                              className="flex items-center"
                            >
                              <RadioGroupItem 
                                value="completed" 
                                id={key}
                                onClick={() => setItemStates(prev => ({ ...prev, [key]: !itemCompleted }))}
                                className="cursor-pointer"
                              />
                            </RadioGroup>
                            <label 
                              htmlFor={key}
                              className={`text-sm cursor-pointer ${itemCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                            >
                              {typeof item === 'string' ? item : ''}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Weekly Schedule */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks & Goals</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Adjustments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <TaskManager />
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart size={20} />
              Weekly {userDosha} Balance Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weeklySchedule.map((day, index) => (
                <Card 
                  key={day.day} 
                  className={`p-4 transition-ayur hover:shadow-gentle ${
                    index === new Date().getDay() ? 'ring-2 ring-secondary' : ''
                  }`}
                >
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-sm">{day.day}</h4>
                    <p className="text-xs text-muted-foreground">{day.focus}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                        <span className="text-xs">{activity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Seasonal Dosha Adjustments</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Summer (Pitta Season)</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Increase cooling foods and drinks</li>
                  <li>• Avoid hot, spicy, and oily foods</li>
                  <li>• Practice cooling pranayama</li>
                  <li>• Exercise during cooler hours</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Winter (Vata Season)</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Emphasize warm, moist foods</li>
                  <li>• Regular oil massage is crucial</li>
                  <li>• Maintain consistent routines</li>
                  <li>• Stay warm and avoid cold exposure</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlansView;