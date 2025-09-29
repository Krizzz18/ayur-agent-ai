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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onRecommendationsUpdate?: (recommendations: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onRecommendationsUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste, respected one! 🙏 I am your Ayurvedic consultant with 15+ years of experience. I will ask you a few questions to understand your health better and then provide personalized Ayurvedic recommendations.\n\nLet me start by asking: What is your age?',
      sender: 'agent',
      timestamp: new Date(),
    }
  ]);
  const [questionSequence, setQuestionSequence] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const { exportToPDF, exportConsultationHistory } = usePDFExport();
  const { user } = useAuth();
  const { toast } = useToast();
  const { memory, addSymptom, addInsight, updateDoshaAnalysis, getContextForAI } = useConversationMemory();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        
        // Parse recommendations
        if (onRecommendationsUpdate) {
          const recommendations = parseRecommendationsFromResponse(agentReply);
          onRecommendationsUpdate(recommendations);
        }
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

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
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