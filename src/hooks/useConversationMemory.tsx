import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ConversationMemory {
  id: string;
  user_id: string;
  conversation_context: any;
  symptoms_history: string[];
  dosha_analysis: string | null;
  preferences: any;
  key_insights: string[];
  created_at: string;
  updated_at: string;
}

export const useConversationMemory = () => {
  const { user } = useAuth();
  const [memory, setMemory] = useState<ConversationMemory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing memory for user from localStorage as fallback
  useEffect(() => {
    if (user) {
      loadUserMemory();
    }
  }, [user]);

  const loadUserMemory = async () => {
    if (!user) return;
    
    try {
      // Try localStorage first as fallback until Supabase types are updated
      const storedMemory = localStorage.getItem(`memory_${user.id}`);
      
      if (storedMemory) {
        setMemory(JSON.parse(storedMemory));
      } else {
        // Create default memory
        const defaultMemory: ConversationMemory = {
          id: 'temp',
          user_id: user.id,
          conversation_context: {},
          symptoms_history: [],
          dosha_analysis: null,
          preferences: {},
          key_insights: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setMemory(defaultMemory);
        localStorage.setItem(`memory_${user.id}`, JSON.stringify(defaultMemory));
      }
    } catch (error) {
      console.error('Error with memory:', error);
      // Set default memory on error
      const defaultMemory: ConversationMemory = {
        id: 'temp',
        user_id: user.id,
        conversation_context: {},
        symptoms_history: [],
        dosha_analysis: null,
        preferences: {},
        key_insights: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setMemory(defaultMemory);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemory = async (updates: Partial<ConversationMemory>) => {
    if (!user || !memory) return;

    try {
      // Update local memory immediately for better UX
      const updatedMemory = { ...memory, ...updates, updated_at: new Date().toISOString() };
      setMemory(updatedMemory);
      
      // Store in localStorage as fallback
      localStorage.setItem(`memory_${user.id}`, JSON.stringify(updatedMemory));
      
      // TODO: Once Supabase types are updated, add database storage here
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const addSymptom = async (symptom: string) => {
    if (!memory) return;
    
    const updatedSymptoms = [...(memory.symptoms_history || []), symptom];
    await updateMemory({ symptoms_history: updatedSymptoms });
  };

  const addInsight = async (insight: string) => {
    if (!memory) return;
    
    const updatedInsights = [...(memory.key_insights || []), insight];
    await updateMemory({ key_insights: updatedInsights });
  };

  const updateDoshaAnalysis = async (dosha: string) => {
    await updateMemory({ dosha_analysis: dosha });
  };

  const updateConversationContext = async (context: any) => {
    const updatedContext = { ...memory?.conversation_context, ...context };
    await updateMemory({ conversation_context: updatedContext });
  };

  const getContextForAI = () => {
    if (!memory) return '';

    const context = [];
    
    if (memory.dosha_analysis) {
      context.push(`Patient's primary dosha: ${memory.dosha_analysis}`);
    }
    
    if (memory.symptoms_history && memory.symptoms_history.length > 0) {
      context.push(`Previous symptoms discussed: ${memory.symptoms_history.join(', ')}`);
    }
    
    if (memory.key_insights && memory.key_insights.length > 0) {
      context.push(`Key insights from previous consultations: ${memory.key_insights.join('; ')}`);
    }
    
    if (memory.conversation_context && Object.keys(memory.conversation_context).length > 0) {
      context.push(`Additional context: ${JSON.stringify(memory.conversation_context)}`);
    }

    return context.length > 0 ? `\n\nPatient History & Context:\n${context.join('\n')}` : '';
  };

  return {
    memory,
    isLoading,
    addSymptom,
    addInsight,
    updateDoshaAnalysis,
    updateConversationContext,
    getContextForAI
  };
};