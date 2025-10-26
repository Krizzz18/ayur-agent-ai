import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Sparkles, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { generateGeminiReplyWithMemory } from '@/lib/geminiWithMemory';
import { usePDFExport } from '@/hooks/usePDFExport';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { useAppContext } from '@/contexts/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'widget' | 'text' | 'recommendations';
  widgetData?: any;
}

interface ChatInterfaceProps {
  onRecommendationsUpdate?: (recommendations: any) => void;
}

interface UserInput {
  age?: number;
  gender?: string;
  constitution?: string;
  symptoms?: string[];
  lifestyle?: string[];
  sleep?: number;
  stress?: number;
  exercise?: string;
  diet?: string;
  water?: number;
}

const InteractiveChatInterface: React.FC<ChatInterfaceProps> = ({ onRecommendationsUpdate }) => {
  const { userProfile, setUserProfile } = useAppContext();
  const { user } = useAuth();
  
  // Dynamic storage key based on user authentication
  const STORAGE_KEY = user ? `ayuragent-chat-interactive-v1-${user.id}` : 'ayuragent-chat-interactive-v1-guest';
  
  // Calculate starting step based on stored info
  const getInitialStep = () => {
    if (userProfile.age && userProfile.gender) return 2; // Skip age and gender
    if (userProfile.age) return 1; // Skip only age
    return 0; // Start from beginning
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🙏 Namaste! Welcome to your personalized Ayurvedic wellness journey! I\'m here to create the perfect balance for your unique constitution.\n\nLet\'s start with some fun, interactive questions to understand you better!',
      sender: 'agent',
      timestamp: new Date(),
    }
  ]);

  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [userInputs, setUserInputs] = useState<UserInput>(() => {
    const initial: UserInput = {};
    if (userProfile.age) initial.age = userProfile.age;
    if (userProfile.gender) initial.gender = userProfile.gender as string;
    return initial;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showingRecommendations, setShowingRecommendations] = useState(false);
  const [pendingRecommendations, setPendingRecommendations] = useState<any>(null);
  
  const { exportToPDF, exportConsultationHistory } = usePDFExport();
  const { toast } = useToast();
  const { memory, addSymptom, addInsight, updateDoshaAnalysis, getContextForAI } = useConversationMemory();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastShownStepRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // LocalStorage: load persisted interactive chat on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages)) {
          const loadedMessages = parsed.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
          setMessages(loadedMessages);
          // Find the last widget message to prevent re-asking
          const lastWidget = loadedMessages.slice().reverse().find((m: any) => m.type === 'widget' && m.widgetData?.id);
          if (lastWidget) {
            lastShownStepRef.current = lastWidget.widgetData.id;
          }
        }
        if (typeof parsed.currentStep === 'number') setCurrentStep(parsed.currentStep);
        if (parsed.userInputs) setUserInputs(parsed.userInputs);
        if (parsed.pendingRecommendations) setPendingRecommendations(parsed.pendingRecommendations);
      }
    } catch {}
  }, [STORAGE_KEY]);

  // LocalStorage: persist interactive chat state
  useEffect(() => {
    const payload = { messages, currentStep, userInputs, pendingRecommendations };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [messages, currentStep, userInputs, pendingRecommendations, STORAGE_KEY]);

  const steps = [
    {
      id: 'age',
      title: '🎂 What\'s your age?',
      type: 'slider',
      min: 5,
      max: 100,
      defaultValue: 25,
      emoji: '🧓👨👩🧒'
    },
    {
      id: 'gender',
      title: '👤 How do you identify?',
      type: 'emoji-select',
      options: [
        { value: 'male', emoji: '👨', label: 'Male' },
        { value: 'female', emoji: '👩', label: 'Female' },
        { value: 'other', emoji: '⚧️', label: 'Other' }
      ]
    },
    {
      id: 'constitution',
      title: '🧘‍♀️ Which best describes your body type and personality?',
      type: 'constitution-cards',
      options: [
        {
          value: 'vata',
          title: 'Vata (Air + Space)',
          emoji: '🌪️',
          traits: ['Slim build', 'Quick thinking', 'Creative', 'Sometimes anxious'],
          color: 'gradient-vata'
        },
        {
          value: 'pitta',
          title: 'Pitta (Fire + Water)',
          emoji: '🔥',
          traits: ['Medium build', 'Focused', 'Competitive', 'Strong digestion'],
          color: 'gradient-pitta'
        },
        {
          value: 'kapha',
          title: 'Kapha (Earth + Water)',
          emoji: '🌱',
          traits: ['Sturdy build', 'Calm', 'Steady', 'Loving nature'],
          color: 'gradient-kapha'
        }
      ]
    },
    {
      id: 'symptoms',
      title: '🤒 Which symptoms are you experiencing? (Select all that apply)',
      type: 'multi-emoji-select',
      options: [
        { value: 'headache', emoji: '🤕', label: 'Headaches' },
        { value: 'fatigue', emoji: '😴', label: 'Fatigue' },
        { value: 'digestion', emoji: '🤢', label: 'Digestive Issues' },
        { value: 'anxiety', emoji: '😰', label: 'Anxiety/Stress' },
        { value: 'skin', emoji: '🧴', label: 'Skin Problems' },
        { value: 'sleep', emoji: '🌙', label: 'Sleep Issues' },
        { value: 'weight', emoji: '⚖️', label: 'Weight Concerns' },
        { value: 'joint', emoji: '🦴', label: 'Joint Pain' }
      ]
    },
    {
      id: 'sleep',
      title: '😴 How many hours do you sleep per night?',
      type: 'sleep-slider',
      min: 3,
      max: 12,
      defaultValue: 7
    },
    {
      id: 'stress',
      title: '😰 What\'s your stress level? (1-10)',
      type: 'stress-meter',
      min: 1,
      max: 10,
      defaultValue: 5
    },
    {
      id: 'exercise',
      title: '🏃‍♀️ How often do you exercise?',
      type: 'emoji-select',
      options: [
        { value: 'daily', emoji: '💪', label: 'Daily' },
        { value: 'weekly', emoji: '🏃‍♀️', label: '3-4 times/week' },
        { value: 'rarely', emoji: '🚶‍♀️', label: 'Rarely' },
        { value: 'never', emoji: '🛋️', label: 'Never' }
      ]
    },
    {
      id: 'diet',
      title: '🥗 What\'s your dietary preference?',
      type: 'emoji-select',
      options: [
        { value: 'vegetarian', emoji: '🥬', label: 'Vegetarian' },
        { value: 'vegan', emoji: '🌱', label: 'Vegan' },
        { value: 'non-vegetarian', emoji: '🍖', label: 'Non-Vegetarian' },
        { value: 'mixed', emoji: '🍽️', label: 'Mixed Diet' }
      ]
    },
    {
      id: 'water',
      title: '💧 How many glasses of water do you drink daily?',
      type: 'water-tracker',
      min: 1,
      max: 15,
      defaultValue: 6
    }
  ];

  const handleWidgetResponse = async (stepId: string, value: any) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    // Update user inputs and persist to AppContext
    setUserInputs(prev => ({ ...prev, [stepId]: value }));
    
    // Persist age and gender to global state
    if (stepId === 'age' && typeof value === 'number') {
      setUserProfile({ age: value });
    }
    if (stepId === 'gender' && typeof value === 'string') {
      setUserProfile({ gender: value });
    }

    // Create user message showing their selection
    let displayText = '';
    if (step.type === 'slider' || step.type === 'sleep-slider' || step.type === 'water-tracker') {
      displayText = `${value} ${stepId === 'age' ? 'years old' : stepId === 'sleep' ? 'hours' : stepId === 'water' ? 'glasses' : ''}`;
    } else if (step.type === 'stress-meter') {
      displayText = `Stress level: ${value}/10 ${value <= 3 ? '😌' : value <= 6 ? '😐' : '😰'}`;
    } else if (step.type === 'emoji-select') {
      const option = step.options?.find((opt: any) => opt.value === value);
      displayText = `${option?.emoji} ${(option as any)?.label || (option as any)?.title}`;
    } else if (step.type === 'constitution-cards') {
      const option = step.options?.find((opt: any) => opt.value === value);
      displayText = `${option?.emoji} ${(option as any)?.title || (option as any)?.label}`;
    } else if (step.type === 'multi-emoji-select') {
      const selectedOptions = step.options?.filter((opt: any) => value.includes(opt.value));
      displayText = selectedOptions?.map((opt: any) => `${opt.emoji} ${opt.label}`).join(', ') || 'None selected';
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: displayText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Move to next step or generate recommendations (let useEffect show next question)
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTyping(false);
      }, 1000);
    } else {
      // All questions answered, generate recommendations
      setTimeout(() => {
        generateAyurvedicRecommendations();
      }, 1000);
    }
  };

  // Removed showNextQuestion - now handled by useEffect watching currentStep

  const generateAyurvedicRecommendations = async () => {
    try {
      const contextForAI = `
Patient Profile:
- Age: ${userInputs.age}
- Gender: ${userInputs.gender}
- Constitution: ${userInputs.constitution}
- Symptoms: ${Array.isArray(userInputs.symptoms) ? userInputs.symptoms.join(', ') : 'None'}
- Sleep: ${userInputs.sleep} hours
- Stress Level: ${userInputs.stress}/10
- Exercise: ${userInputs.exercise}
- Diet: ${userInputs.diet}
- Water Intake: ${userInputs.water} glasses/day

Generate COMPACT Ayurvedic recommendations in this format:
• Daily Routine: [2-3 bullet points]
• Diet Plan: [3-4 specific food items with properties]
• Herbal Medicine: [2-3 herbs with dosage]
• Lifestyle: [2-3 practical tips]

Keep each bullet point SHORT (max 10 words). Format as bullet points without ** symbols.
`;

      const response = await generateGeminiReplyWithMemory('Generate my personalized Ayurvedic plan', contextForAI);
      
      // Parse recommendations into actionable tasks
      const recommendations = parseRecommendationsIntoTasks(response);
      
      // Store recommendations but don't auto-update
      setPendingRecommendations(recommendations);

      // Update dosha analysis
      if (userInputs.constitution) {
        updateDoshaAnalysis(userInputs.constitution);
      }

      const recommendationMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `🎉 Your personalized Ayurvedic wellness plan is ready!\n\n${response}\n\n💡 Review these recommendations below and click the button to add them to your Wellness Plan.`,
        sender: 'agent',
        timestamp: new Date(),
        type: 'recommendations'
      };

      setMessages(prev => [...prev, recommendationMessage]);
      
      // Add button after a short delay
      setTimeout(() => {
        const buttonMessage: Message = {
          id: (Date.now() + 3).toString(),
          text: '__ADD_TO_PLAN_BUTTON__',
          sender: 'agent',
          timestamp: new Date(),
          type: 'widget'
        };
        setMessages(prev => [...prev, buttonMessage]);
      }, 500);
      
      setShowingRecommendations(true);
      setIsTyping(false);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      setIsTyping(false);
    }
  };

  const handleChatbotRefresh = () => {
    setMessages([{
      id: '1',
      text: '🙏 Namaste! Welcome to your personalized Ayurvedic wellness journey! I\'m here to create the perfect balance for your unique constitution.\n\nLet\'s start with some fun, interactive questions to understand you better!',
      sender: 'agent',
      timestamp: new Date(),
    }]);
    setCurrentStep(0);
    setUserInputs({});
    setPendingRecommendations(null);
    setShowingRecommendations(false);
    localStorage.removeItem(STORAGE_KEY);
    toast({ title: "Chat history cleared 🗑️" });
  };

  const parseRecommendationsIntoTasks = (response: string) => {
    const tasks: any[] = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('•') || line.includes('-')) {
        const cleanLine = line.replace(/[•-]/g, '').trim();
        if (cleanLine && cleanLine.length > 5) {
          tasks.push({
            id: Date.now() + Math.random(),
            task: cleanLine,
            category: line.toLowerCase().includes('diet') ? 'diet' : 
                     line.toLowerCase().includes('herb') ? 'herbs' : 
                     line.toLowerCase().includes('routine') ? 'routine' : 'lifestyle',
            completed: false,
            time: new Date().toISOString()
          });
        }
      }
    });

    return {
      dailyRoutine: tasks.filter(t => t.category === 'routine'),
      diet: tasks.filter(t => t.category === 'diet'),
      herbs: tasks.filter(t => t.category === 'herbs'),
      lifestyle: tasks.filter(t => t.category === 'lifestyle')
    };
  };

  const handleAddToPlan = () => {
    if (pendingRecommendations && onRecommendationsUpdate) {
      onRecommendationsUpdate(pendingRecommendations);
      
      toast({
        title: "✅ 3 new recommendations added to your wellness plan! 🌿",
        description: "Your personalized recommendations are now in your plan",
      });
      
      // Remove the button
      setMessages(prev => prev.filter(msg => msg.text !== '__ADD_TO_PLAN_BUTTON__'));
      setPendingRecommendations(null);
    }
  };

  // Show question when step changes (prevents duplicate questions)
  useEffect(() => {
    if (currentStep >= steps.length || showingRecommendations) return;
    
    const step = steps[currentStep];
    if (!step || lastShownStepRef.current === step.id) return;
    
    const timeoutId = setTimeout(() => {
      const questionMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: step.title,
        sender: 'agent',
        timestamp: new Date(),
        type: 'widget',
        widgetData: step
      };
      
      setMessages(prev => {
        // Check if this exact question is already the last message
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.type === 'widget' && lastMsg.widgetData?.id === step.id) {
          return prev;
        }
        return [...prev, questionMessage];
      });
      
      lastShownStepRef.current = step.id;
    }, messages.length === 1 ? 2000 : 0);
    
    return () => clearTimeout(timeoutId);
  }, [currentStep, showingRecommendations]);

  const renderWidget = (step: any) => {
    switch (step.type) {
      case 'slider':
      case 'sleep-slider':
      case 'water-tracker':
        return (
          <Card className="p-4 max-w-sm mx-auto">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{step.emoji}</div>
                <div className="text-2xl font-bold">{userInputs[step.id] || step.defaultValue}</div>
                <div className="text-sm text-muted-foreground">
                  {step.id === 'age' ? 'years' : step.id === 'sleep' ? 'hours' : step.id === 'water' ? 'glasses' : ''}
                </div>
              </div>
              <Slider
                value={[userInputs[step.id] || step.defaultValue]}
                onValueChange={(value) => setUserInputs(prev => ({ ...prev, [step.id]: value[0] }))}
                max={step.max}
                min={step.min}
                step={1}
                className="w-full"
              />
              <Button 
                onClick={() => handleWidgetResponse(step.id, userInputs[step.id] || step.defaultValue)}
                className="w-full gradient-healing"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'stress-meter':
        const stressLevel = userInputs[step.id] || step.defaultValue;
        const stressColor = stressLevel <= 3 ? 'bg-green-500' : stressLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500';
        return (
          <Card className="p-4 max-w-sm mx-auto">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {stressLevel <= 3 ? '😌' : stressLevel <= 6 ? '😐' : '😰'}
                </div>
                <div className="text-2xl font-bold">{stressLevel}/10</div>
                <div className="text-sm text-muted-foreground">Stress Level</div>
              </div>
              <div className="space-y-2">
                <Progress value={stressLevel * 10} className={`h-3 ${stressColor}`} />
                <Slider
                  value={[stressLevel]}
                  onValueChange={(value) => setUserInputs(prev => ({ ...prev, [step.id]: value[0] }))}
                  max={step.max}
                  min={step.min}
                  step={1}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={() => handleWidgetResponse(step.id, stressLevel)}
                className="w-full gradient-healing"
              >
                <Heart className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </Card>
        );

      case 'emoji-select':
        return (
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {step.options?.map((option: any) => (
              <Button
                key={option.value}
                variant="outline"
                className="h-20 flex-col gap-2 hover:scale-105 transition-ayur"
                onClick={() => handleWidgetResponse(step.id, option.value)}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        );

      case 'constitution-cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {step.options?.map((option: any) => (
              <Card
                key={option.value}
                className="p-4 cursor-pointer transition-ayur hover:scale-105 hover:shadow-lotus"
                onClick={() => handleWidgetResponse(step.id, option.value)}
              >
                <div className={`w-full h-24 ${option.color} rounded-lg flex items-center justify-center mb-3`}>
                  <span className="text-4xl">{option.emoji}</span>
                </div>
                <h3 className="font-semibold text-center mb-2">{option.title}</h3>
                <div className="space-y-1">
                  {option.traits.map((trait: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        );

      case 'multi-emoji-select':
        const selectedSymptoms = userInputs[step.id] || [];
        return (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {step.options?.map((option: any) => {
                const isSelected = selectedSymptoms.includes(option.value);
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-20 flex-col gap-2 transition-ayur ${
                      isSelected ? 'gradient-healing text-white' : 'hover:scale-105'
                    }`}
                    onClick={() => {
                      const newSelection = isSelected
                        ? selectedSymptoms.filter((s: string) => s !== option.value)
                        : [...selectedSymptoms, option.value];
                      setUserInputs(prev => ({ ...prev, [step.id]: newSelection }));
                    }}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-xs text-center">{option.label}</span>
                  </Button>
                );
              })}
            </div>
            <Button 
              onClick={() => handleWidgetResponse(step.id, selectedSymptoms)}
              className="w-full gradient-healing"
              disabled={selectedSymptoms.length === 0}
            >
              <Zap className="w-4 h-4 mr-2" />
              Continue with {selectedSymptoms.length} symptoms
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border gradient-healing text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bot size={20} />
              Interactive Ayurvedic Consultation
            </h2>
            {memory?.dosha_analysis && (
              <Badge variant="secondary" className="mt-1">
                Primary Dosha: {memory.dosha_analysis}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleChatbotRefresh}
              variant="outline" 
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Refresh
            </Button>
            {showingRecommendations && (
              <Button 
                onClick={() => exportConsultationHistory(messages, memory?.dosha_analysis)}
                variant="outline" 
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Download size={16} className="mr-2" />
                Export PDF
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => {
          // Render "Add to Plan" button
          if (message.text === '__ADD_TO_PLAN_BUTTON__') {
            return (
              <div key={message.id} className="flex justify-center my-4">
                <Button 
                  onClick={handleAddToPlan}
                  className="gradient-healing shadow-lotus hover:scale-105 transition-ayur px-8 py-6 text-lg"
                  size="lg"
                >
                  <Sparkles size={20} className="mr-2" />
                  Add to Wellness Plan
                </Button>
              </div>
            );
          }
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'agent' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full gradient-healing flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                </div>
              )}
              
              <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'gradient-healing text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Render widget if this is a widget message */}
                {message.type === 'widget' && message.widgetData && (
                  <div className="mt-3">
                    {renderWidget(message.widgetData)}
                  </div>
                )}
              </div>

              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User size={16} className="text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full gradient-healing flex items-center justify-center">
                <Bot size={16} className="text-white lotus-bloom" />
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Progress Indicator */}
      {!showingRecommendations && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{currentStep + 1}/{steps.length}</span>
              </div>
              <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
            </div>
            <div className="text-2xl">
              {currentStep < 3 ? '🌱' : currentStep < 6 ? '🌿' : '🌸'}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InteractiveChatInterface;