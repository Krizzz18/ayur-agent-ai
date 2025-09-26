import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
<<<<<<< HEAD
import { usePDFExport } from '@/hooks/usePDFExport';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
=======
import { generateGeminiReply } from '@/lib/gemini';
>>>>>>> daa0be9 (feat: integrate Gemini API; add frontend + Flask fallbacks; fix models; improve chat error handling)

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! 🙏 I\'m your AyurAgent assistant. I\'ll guide you through discovering your dosha and creating a personalized wellness plan. Let\'s start - how are you feeling today?',
      sender: 'agent',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
<<<<<<< HEAD
  const [currentPhase, setCurrentPhase] = useState<'intake' | 'analysis' | 'recommendation' | 'monitoring'>('intake');
  const [userProfile, setUserProfile] = useState<any>({});
  const [analysisResult, setAnalysisResult] = useState<{ dosha: string; recommendations: any } | null>(null);
  
  const { exportToPDF, exportConsultationHistory } = usePDFExport();
  const { user } = useAuth();
  const { toast } = useToast();
=======
>>>>>>> daa0be9 (feat: integrate Gemini API; add frontend + Flask fallbacks; fix models; improve chat error handling)
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

<<<<<<< HEAD
  const doshaQuestions = [
    "In simple words, what problem do you want help with? (e.g., poor sleep, stress, headache, digestion, skin issues)",
    "What is your age range? (e.g., 18–25, 26–35, 36–45, 46+)",
    "Which city and country do you live in?",
    "Describe your daily routine in simple words (sleep time, work hours, activity level).",
    "What do you usually eat in a day? (Breakfast, lunch, dinner, snacks, cold/hot drinks)",
    "How do you feel during stress? (e.g., worry, anger, slow/low energy)",
  ];

  const analyzeDoshaFromProfile = (profile: any): string => {
    // Simplified dosha analysis based on symptoms and lifestyle
    const symptoms = profile.symptoms?.toLowerCase() || '';
    const lifestyle = profile.lifestyle?.toLowerCase() || '';
    const stress = profile.stress?.toLowerCase() || '';

    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Vata indicators
    if (symptoms.includes('anxiety') || symptoms.includes('stress') || symptoms.includes('insomnia')) vataScore += 2;
    if (lifestyle.includes('irregular') || lifestyle.includes('travel') || lifestyle.includes('busy')) vataScore += 1;
    if (stress.includes('worry') || stress.includes('overthinking')) vataScore += 1;

    // Pitta indicators
    if (symptoms.includes('acidity') || symptoms.includes('anger') || symptoms.includes('inflammation')) pittaScore += 2;
    if (lifestyle.includes('competitive') || lifestyle.includes('intense') || lifestyle.includes('work')) pittaScore += 1;
    if (stress.includes('irritation') || stress.includes('criticism')) pittaScore += 1;

    // Kapha indicators
    if (symptoms.includes('fatigue') || symptoms.includes('weight') || symptoms.includes('congestion')) kaphaScore += 2;
    if (lifestyle.includes('sedentary') || lifestyle.includes('slow') || lifestyle.includes('routine')) kaphaScore += 1;
    if (stress.includes('withdrawal') || stress.includes('eating')) kaphaScore += 1;

    if (vataScore >= pittaScore && vataScore >= kaphaScore) return 'Vata';
    if (pittaScore >= kaphaScore) return 'Pitta';
    return 'Kapha';
  };

  const generateRecommendations = (dosha: string, profile: any) => {
    const base = {
      Vata: {
        dailyRoutine: [
          "Wake up at a consistent time (before 7 AM if possible)",
          "Warm oil self-massage (Abhyanga)",
          "Gentle yoga or stretching",
          "Eat warm, cooked meals at regular times",
          "Evening wind-down: light reading/meditation"
        ],
        diet: [
          "Favor warm, moist, slightly oily foods",
          "Cooked grains (rice, oats), root vegetables",
          "Sweet fruits; avoid cold/raw foods",
          "Spiced milk or herbal tea at night"
        ],
        herbs: [
          "Ashwagandha for stress balance",
          "Brahmi for focus",
          "Sesame oil for massage"
        ]
      },
      Pitta: {
        dailyRoutine: [
          "Wake up during cool hours (around 5:30–6:30 AM)",
          "Cooling pranayama (sheetali/sitali)",
          "Moderate exercise; avoid peak heat",
          "Prefer cooling, mildly spiced meals",
          "Evening: calming activities in a cool space"
        ],
        diet: [
          "Cool, fresh, and sweet/bitter foods",
          "Coconut water, mint, leafy greens",
          "Avoid very spicy, sour, fermented foods"
        ],
        herbs: [
          "Amla for cooling and immunity",
          "Aloe vera for heat/inflammation",
          "Coconut oil for massage"
        ]
      },
      Kapha: {
        dailyRoutine: [
          "Wake up early (around 5–6 AM)",
          "Energizing exercise (brisk walk/jog)",
          "Dry brushing before shower",
          "Light, warm, mildly spicy meals",
          "Stay active after sunset; avoid heavy dinners"
        ],
        diet: [
          "Light, warm, gently spicy foods",
          "Ginger tea; steamed veggies with spices",
          "Avoid heavy, oily, and very sweet foods"
        ],
        herbs: [
          "Triphala for digestion",
          "Guggul for metabolism",
          "Tulsi for respiratory health"
        ]
      }
    } as const;

    const text = (
      [profile?.symptoms, profile?.lifestyle, profile?.diet, profile?.stress]
        .filter(Boolean)
        .join(' ') || ''
    ).toLowerCase();

    const tags = {
      insomnia: /insomnia|sleep|sleepless|night/.test(text),
      anxiety: /anxiety|anxious|stress|worry|tension|panic/.test(text),
      digestion: /bloat|gas|constipation|indigestion|digestion|acidity|heartburn|reflux/.test(text),
      acidity: /acidity|heartburn|reflux|ulcer/.test(text),
      skin: /acne|pimple|rash|eczema|psoriasis|skin/.test(text),
      weight: /weight|obese|overweight|fat|gain/.test(text),
      headache: /headache|migraine|head pain/.test(text),
      fatigue: /fatigue|tired|low energy|exhausted|weak/.test(text),
    };

    const plan = JSON.parse(JSON.stringify(base[dosha as keyof typeof base]));

    if (tags.insomnia) {
      plan.dailyRoutine.unshift(
        "Sleep by 10 PM; avoid screens 1 hour before bed",
        "Warm milk with nutmeg or ashwagandha at night"
      );
      plan.herbs.push("Jatamansi for better sleep");
    }

    if (tags.digestion) {
      plan.dailyRoutine.unshift(
        "Sip warm ginger water 15 mins before meals",
        "Make lunch your largest meal"
      );
      plan.herbs.push("Triphala at night (as advised)");
    }

    if (tags.acidity) {
      plan.diet.unshift("Favor cooling foods: cucumber, coconut water, mint");
      plan.dailyRoutine.unshift("Avoid very spicy/fermented foods; never skip meals");
      plan.herbs.push("Aloe vera juice in the morning (as advised)");
    }

    if (tags.anxiety) {
      plan.dailyRoutine.unshift("10–15 min calming breathing twice daily (box breathing)");
      plan.herbs.push("Ashwagandha for stress balance");
    }

    if (tags.weight) {
      plan.dailyRoutine.unshift(
        "30–40 min brisk walk/cardio in the morning",
        "Avoid daytime naps"
      );
      plan.diet.unshift("Prefer light, warm, mildly spicy meals; avoid sweets & fried foods");
      plan.herbs.push("Guggul (as advised)");
    }

    if (tags.skin) {
      plan.diet.unshift("Hydrate well; include bitter greens, coriander, turmeric");
      plan.herbs.push("Neem (skin support)");
    }

    if (tags.headache) {
      plan.dailyRoutine.unshift("Hydrate; avoid skipping meals; 5–10 min forehead oiling (cool oil) if Pitta");
    }

    if (tags.fatigue) {
      plan.dailyRoutine.unshift("Regular sleep-wake time; sunlight exposure in morning");
    }

    return plan;
  };

=======
>>>>>>> daa0be9 (feat: integrate Gemini API; add frontend + Flask fallbacks; fix models; improve chat error handling)
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Try frontend Gemini first (gemini.ts has a fallback API key now)
      const reply = await generateGeminiReply(userMessage.text);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('Error generating reply:', error);
      // If frontend failed, attempt backend as a last resort
      try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.text }),
        });
        if (!response.ok) throw new Error('Backend not reachable');
        const data = await response.json();
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply ?? 'Sorry, I could not generate a response.',
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentMessage]);
      } catch (fallbackErr) {
        const msg = (error?.message?.includes('VITE_GEMINI_API_KEY') || error?.message?.includes('Missing'))
          ? 'Gemini API key is not set. Add VITE_GEMINI_API_KEY in your .env (frontend) or set GEMINI_API_KEY and run the Flask server.'
          : 'Sorry, I am having trouble connecting. Please try again later.';
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: msg,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">AI Ayurvedic Consultation</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'agent' && (
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                  <Bot size={16} className="text-white" />
                </div>
              </div>
            )}
            
            <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-1' : ''}`}>
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
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User size={16} className="text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full gradient-healing flex items-center justify-center">
                <Bot size={16} className="text-white" />
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

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your symptoms, lifestyle, or ask a question..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            variant="healing"
            size="icon"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;