import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
}

interface ChatInterfaceProps {
  onRecommendationsUpdate?: (recommendations: any) => void;
}

const questions = [
  { key: 'age', question: 'What is your age?' },
  { key: 'gender', question: 'What is your gender? (Male/Female/Other)' },
  { key: 'location', question: 'Which city/location do you live in?' },
  { key: 'diet', question: 'What are your dietary preferences? (Vegetarian/Non-Vegetarian/Vegan)' },
  { key: 'symptoms', question: 'What health issues or symptoms are you experiencing? Please describe in detail.' },
  { key: 'sleep', question: 'How many hours do you sleep per day?' },
  { key: 'exercise', question: 'How often do you exercise? (Daily/Weekly/Rarely/Never)' },
  { key: 'stress', question: 'Do you experience stress or anxiety? If yes, please describe.' },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onRecommendationsUpdate }) => {
  const { userProfile, setUserProfile } = useAppContext();
  const { user } = useAuth();
  
  // Dynamic storage key based on user authentication
  const STORAGE_KEY = user ? `ayuragent-chat-v1-${user.id}` : 'ayuragent-chat-v1-guest';
  
  const [messages, setMessages] = useState<Message[]>(() => {
    // Determine which question to start with based on stored user info
    const hasBasicInfo = !!(userProfile.age && userProfile.gender);
    let greeting = '';
    
    if (hasBasicInfo) {
      greeting = 'Namaste, respected one! 🙏 How can I assist you with your wellness journey today?';
    } else if (userProfile.age && !userProfile.gender) {
      greeting = 'Welcome back! 🙏 To continue, what is your gender? (Male/Female/Other)';
    } else {
      greeting = 'Namaste, respected one! 🙏 I am your Ayurvedic consultant with 15+ years of experience. I will ask you a few questions to understand your health better and then provide personalized Ayurvedic recommendations.\n\nLet me start by asking: What is your age?';
    }
    
    return [{
      id: '1',
      text: greeting,
      sender: 'agent',
      timestamp: new Date(),
    }];
  });
  
  // Calculate starting question index based on what info we already have
  const getStartingQuestionIndex = () => {
    if (userProfile.age && userProfile.gender) return 2; // Skip age and gender
    if (userProfile.age) return 1; // Skip only age
    return 0; // Start from age
  };
  
  const [questionSequence, setQuestionSequence] = useState(getStartingQuestionIndex());
  const [userResponses, setUserResponses] = useState<Record<string, string>>(() => {
    const responses: Record<string, string> = {};
    if (userProfile.age) responses.age = userProfile.age.toString();
    if (userProfile.gender) responses.gender = userProfile.gender;
    return responses;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const { exportToPDF, exportConsultationHistory } = usePDFExport();
  const { toast } = useToast();
  const { memory, addSymptom, addInsight, updateDoshaAnalysis, getContextForAI } = useConversationMemory();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // LocalStorage: load persisted chat on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages)) {
          setMessages(parsed.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        }
        if (typeof parsed.questionSequence === 'number') setQuestionSequence(parsed.questionSequence);
        if (parsed.userResponses) setUserResponses(parsed.userResponses);
      } else {
        // Migration: Try loading from alternate storage key (guest <-> auth migration)
        const alternateKey = user ? 'ayuragent-chat-v1-guest' : null;
        if (alternateKey) {
          const alternateSaved = localStorage.getItem(alternateKey);
          if (alternateSaved) {
            try {
              const parsed = JSON.parse(alternateSaved);
              if (Array.isArray(parsed.messages) && parsed.messages.length > 1) {
                // Migrate data to current user's key
                setMessages(parsed.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
                if (typeof parsed.questionSequence === 'number') setQuestionSequence(parsed.questionSequence);
                if (parsed.userResponses) setUserResponses(parsed.userResponses);
                
                // Save to new key and remove old
                localStorage.setItem(STORAGE_KEY, alternateSaved);
                localStorage.removeItem(alternateKey);
                
                toast({ 
                  title: '✅ Chat history restored', 
                  description: 'Your previous conversation has been migrated to your account'
                });
              }
            } catch {}
          }
        }
      }
    } catch {}
  }, [STORAGE_KEY, user, toast]);

  // LocalStorage: persist chat state
  useEffect(() => {
    const payload = { messages, questionSequence, userResponses };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [messages, questionSequence, userResponses, STORAGE_KEY]);

  // Create new conversation on mount
  useEffect(() => {
    if (user && !conversationId) {
      createNewConversation();
    }
  }, [user]);

  const createNewConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          user_id: user.id,
          message_text: 'New consultation started',
          message_type: 'system',
          session_id: `session_${Date.now()}`,
          recommendations: null
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return;
      }

      setConversationId(data.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const saveMessageToSupabase = async (message: Message) => {
    if (!user || !conversationId) return;

    try {
      // Create a new consultation entry for this message using the existing schema
      await supabase
        .from('consultations')
        .insert([{
          user_id: user.id,
          message_text: message.text,
          message_type: message.sender,
          session_id: conversationId,
          agent_type: message.sender === 'agent' ? 'ayur_agent' : null
        }]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleChatbotRefresh = () => {
    setMessages([{ 
      id: '1', 
      text: 'Hello! I am your Ayurvedic wellness assistant. How can I help you today?', 
      sender: 'agent', 
      timestamp: new Date() 
    }]);
    setQuestionSequence(0);
    setUserResponses({});
    localStorage.removeItem(STORAGE_KEY);
    toast({ title: "Chat history cleared 🗑️" });
  };

  const extractInsightsFromResponse = (response: string) => {
    // Extract dosha mentions
    const doshaMatches = response.match(/(Vata|Pitta|Kapha)/gi);
    if (doshaMatches) {
      const primaryDosha = doshaMatches[0];
      updateDoshaAnalysis(primaryDosha);
    }

    // Extract symptoms mentioned
    const symptomKeywords = ['headache', 'insomnia', 'anxiety', 'digestion', 'acidity', 'skin', 'fatigue', 'weight'];
    const mentionedSymptoms = symptomKeywords.filter(symptom => 
      response.toLowerCase().includes(symptom)
    );
    
    mentionedSymptoms.forEach(symptom => addSymptom(symptom));

    // Extract key recommendations as insights
    if (response.includes('recommend') || response.includes('suggest')) {
      addInsight(response.substring(0, 200) + '...');
    }
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
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Save user message
    await saveMessageToSupabase(userMessage);

    try {
      // Store user response
      if (questionSequence < questions.length) {
        const currentQuestion = questions[questionSequence];
        setUserResponses(prev => ({ ...prev, [currentQuestion.key]: currentInput }));
        
        // Store age and gender in global context for persistence
        if (currentQuestion.key === 'age') {
          const ageNum = parseInt(currentInput);
          if (!isNaN(ageNum)) {
            setUserProfile({ age: ageNum });
          }
        }
        if (currentQuestion.key === 'gender') {
          setUserProfile({ gender: currentInput });
        }
      }

      let agentReply = '';

      // If still collecting info, ask next question
      if (questionSequence < questions.length - 1) {
        const nextQuestion = questions[questionSequence + 1];
        agentReply = `Thank you for sharing. ${nextQuestion.question}`;
        setQuestionSequence(prev => prev + 1);
      } else if (questionSequence === questions.length - 1) {
        // Final question answered, now generate Ayurvedic recommendations
        setQuestionSequence(prev => prev + 1);
        
        // Build comprehensive context
        const allResponses = { ...userResponses, [questions[questionSequence].key]: currentInput };
        const contextForAI = `
Patient Information:
- Age: ${allResponses.age || 'Not provided'}
- Gender: ${allResponses.gender || 'Not provided'}
- Location: ${allResponses.location || 'Not provided'}
- Dietary Preferences: ${allResponses.diet || 'Not provided'}
- Symptoms/Health Issues: ${allResponses.symptoms || 'Not provided'}
- Sleep: ${allResponses.sleep || 'Not provided'} hours
- Exercise: ${allResponses.exercise || 'Not provided'}
- Stress/Anxiety: ${allResponses.stress || 'Not provided'}

Based on this information, provide comprehensive Ayurvedic recommendations including:
1. Primary Dosha analysis (Vata, Pitta, or Kapha)
2. Specific diet plan with food items to include and avoid
3. Herbal medicines/supplements (with dosage if applicable)
4. Lifestyle modifications (daily routine, sleep schedule)
5. Yoga or exercise recommendations
6. Any other Ayurvedic therapies that may help

Format the response clearly and professionally.`;

        agentReply = await generateGeminiReplyWithMemory(currentInput, contextForAI);
        
        // Extract insights
        extractInsightsFromResponse(agentReply);
        
        // Store recommendations separately (not in userResponses)
        const recommendations = parseRecommendationsFromResponse(agentReply);
        
        // Add button prompt to review and add to wellness plan
        agentReply += '\n\n💡 Would you like to add these recommendations to your Wellness Plan? Click the button below to review and confirm.';
        
        // Store recommendations temporarily
        (window as any).__pendingChatRecommendations = recommendations;
      } else {
        // After recommendations, allow free-form conversation
        const contextualContext = getContextForAI();
        const previousContext = Object.entries(userResponses)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        
        agentReply = await generateGeminiReplyWithMemory(
          currentInput, 
          `${previousContext}\n\n${contextualContext}`
        );
        
        extractInsightsFromResponse(agentReply);
      }
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: agentReply,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Add button after recommendations are generated
      if (questionSequence === questions.length && (window as any).__pendingChatRecommendations) {
        setTimeout(() => {
          const buttonMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: '__ADD_TO_PLAN_BUTTON__', // Special marker for button
            sender: 'agent',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, buttonMessage]);
        }, 500);
      }
      
      await saveMessageToSupabase(agentMessage);

    } catch (error: any) {
      console.error('Error generating reply:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, respected one. I am having difficulty connecting at the moment. Please try again shortly.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const parseRecommendationsFromResponse = (response: string) => {
    // Simple parsing logic - can be enhanced
    return {
      dailyRoutine: response.includes('routine') ? [response.substring(0, 100)] : [],
      diet: response.includes('eat') || response.includes('food') ? [response.substring(0, 100)] : [],
      herbs: response.includes('herb') || response.includes('ashwagandha') ? [response.substring(0, 100)] : []
    };
  };

  const handleExportChat = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to export your consultation",
        variant: "destructive"
      });
      return;
    }

      try {
        await exportConsultationHistory(messages, memory?.dosha_analysis);
        toast({
          title: "Export successful",
          description: "Your consultation has been exported as PDF"
        });
      } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your consultation",
        variant: "destructive"
      });
    }
  };

  const handleAddToPlan = () => {
    const recommendations = (window as any).__pendingChatRecommendations;
    if (recommendations && onRecommendationsUpdate) {
      onRecommendationsUpdate(recommendations);
      
      toast({
        title: "✅ 3 new recommendations added to your wellness plan! 🌿",
        description: "Your personalized recommendations are now in your plan",
      });
      
      // Remove the button and clear pending recommendations
      setMessages(prev => prev.filter(msg => msg.text !== '__ADD_TO_PLAN_BUTTON__'));
      delete (window as any).__pendingChatRecommendations;
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
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">AI Ayurvedic Consultation</h2>
          {memory?.dosha_analysis && (
            <p className="text-sm text-muted-foreground">Primary Dosha: {memory.dosha_analysis}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleChatbotRefresh}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            Refresh
          </Button>
          <Button 
            onClick={handleExportChat}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export PDF
          </Button>
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
                  className="gradient-healing shadow-lotus hover:scale-105 transition-ayur"
                  size="lg"
                >
                  <Save size={18} className="mr-2" />
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
          );
        })}

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
            placeholder="Share your symptoms, lifestyle, or ask about Ayurvedic remedies..."
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