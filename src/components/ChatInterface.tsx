import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentType?: 'intake' | 'analysis' | 'recommendation' | 'monitoring';
}

interface ChatInterfaceProps {
  onDoshaAnalysisComplete?: (dosha: string, recommendations: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onDoshaAnalysisComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! 🙏 I\'m your AyurAgent assistant. I\'ll guide you through discovering your dosha and creating a personalized wellness plan. Let\'s start - how are you feeling today?',
      sender: 'agent',
      timestamp: new Date(),
      agentType: 'intake'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intake' | 'analysis' | 'recommendation' | 'monitoring'>('intake');
  const [userProfile, setUserProfile] = useState<any>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const doshaQuestions = [
    "What symptoms are you experiencing? (e.g., stress, digestion issues, fatigue)",
    "What's your age range? (e.g., 20-30, 30-40, 40-50, etc.)",
    "Which city are you located in?",
    "How would you describe your daily routine and lifestyle?",
    "What's your current diet like?",
    "How do you typically handle stress?",
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
    const recommendations = {
      Vata: {
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
      },
      Pitta: {
        dailyRoutine: [
          "Wake up at 5:30 AM during cool hours",
          "Practice cooling pranayama",
          "Moderate exercise, avoid intense heat",
          "Eat cooling foods, avoid spicy meals",
          "Meditation in a cool, calm environment"
        ],
        diet: [
          "Cool, fresh, and sweet foods",
          "Coconut water and fresh fruit juices",
          "Leafy greens and cucumber",
          "Avoid spicy, sour, and fermented foods",
          "Rose water and mint teas"
        ],
        herbs: [
          "Amla for cooling and immunity",
          "Aloe vera for inflammation",
          "Neem for skin health",
          "Coconut oil for massage"
        ]
      },
      Kapha: {
        dailyRoutine: [
          "Wake up at 5 AM for energizing start",
          "Vigorous exercise like jogging",
          "Light, warm, and spicy foods",
          "Dry brushing before shower",
          "Active evening activities"
        ],
        diet: [
          "Light, warm, and spicy foods",
          "Ginger tea and turmeric milk",
          "Steamed vegetables with spices",
          "Avoid heavy, oily, and sweet foods",
          "Honey (unheated) as sweetener"
        ],
        herbs: [
          "Triphala for digestion",
          "Guggul for metabolism",
          "Tulsi for respiratory health",
          "Mustard oil for massage"
        ]
      }
    };

    return recommendations[dosha as keyof typeof recommendations];
  };

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

    // Update user profile based on message context
    const messageText = inputValue.toLowerCase();
    const newProfile = { ...userProfile };

    if (messages.length === 1) {
      newProfile.symptoms = inputValue;
    } else if (messages.length === 3) {
      newProfile.age = inputValue;
    } else if (messages.length === 5) {
      newProfile.location = inputValue;
    } else if (messages.length === 7) {
      newProfile.lifestyle = inputValue;
    } else if (messages.length === 9) {
      newProfile.diet = inputValue;
    } else if (messages.length === 11) {
      newProfile.stress = inputValue;
    }

    setUserProfile(newProfile);

    // Simulate agent response delay
    setTimeout(() => {
      let agentResponse = '';
      let agentType: 'intake' | 'analysis' | 'recommendation' | 'monitoring' = 'intake';

      if (messages.length < 11) {
        // Intake phase - ask next question
        const questionIndex = Math.floor(messages.length / 2);
        agentResponse = doshaQuestions[questionIndex] || "Thank you for sharing! Let me analyze your information.";
        agentType = 'intake';
      } else if (messages.length === 11) {
        // Analysis phase
        setCurrentPhase('analysis');
        agentType = 'analysis';
        agentResponse = "Perfect! I'm now analyzing your responses to determine your primary dosha constitution. This may take a moment... 🧘‍♀️";
        
        // Trigger dosha analysis after a delay
        setTimeout(() => {
          const primaryDosha = analyzeDoshaFromProfile(newProfile);
          const recommendations = generateRecommendations(primaryDosha, newProfile);
          
          const analysisMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `Based on your responses, your primary dosha is **${primaryDosha}**! This means you have a ${primaryDosha.toLowerCase()} constitution. Let me create your personalized wellness plan...`,
            sender: 'agent',
            timestamp: new Date(),
            agentType: 'analysis'
          };

          const recommendationMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: `Here's your personalized ${primaryDosha} balancing plan:\n\n**Daily Routine:**\n${recommendations.dailyRoutine.map(item => `• ${item}`).join('\n')}\n\n**Dietary Guidelines:**\n${recommendations.diet.map(item => `• ${item}`).join('\n')}\n\n**Recommended Herbs:**\n${recommendations.herbs.map(item => `• ${item}`).join('\n')}\n\nWould you like me to create a detailed weekly schedule for you?`,
            sender: 'agent',
            timestamp: new Date(),
            agentType: 'recommendation'
          };

          setMessages(prev => [...prev, analysisMessage, recommendationMessage]);
          setCurrentPhase('recommendation');
          
          // Notify parent component
          if (onDoshaAnalysisComplete) {
            onDoshaAnalysisComplete(primaryDosha, recommendations);
          }
        }, 3000);
      } else {
        // Monitoring phase
        agentType = 'monitoring';
        agentResponse = "I'll continue to monitor your progress and provide personalized guidance. How are you feeling with your current plan?";
        setCurrentPhase('monitoring');
      }

      if (agentResponse) {
        const agentMessage: Message = {
          id: (Date.now() + 1000).toString(),
          text: agentResponse,
          sender: 'agent',
          timestamp: new Date(),
          agentType
        };

        setMessages(prev => [...prev, agentMessage]);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentName = (agentType?: string) => {
    switch (agentType) {
      case 'intake': return 'Intake Agent';
      case 'analysis': return 'Analysis Agent';
      case 'recommendation': return 'Recommendation Agent';
      case 'monitoring': return 'Monitoring Agent';
      default: return 'AyurAgent';
    }
  };

  const getAgentVariant = (agentType?: string) => {
    switch (agentType) {
      case 'intake': return 'vata';
      case 'analysis': return 'pitta';
      case 'recommendation': return 'kapha';
      case 'monitoring': return 'healing';
      default: return 'default';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">AI Ayurvedic Consultation</h2>
        <p className="text-sm text-muted-foreground">
          Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </p>
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAgentVariant(message.agentType)}`}>
                  <Bot size={16} className="text-white" />
                </div>
              </div>
            )}
            
            <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-1' : ''}`}>
              {message.sender === 'agent' && (
                <p className="text-xs text-muted-foreground mb-1">
                  {getAgentName(message.agentType)}
                </p>
              )}
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