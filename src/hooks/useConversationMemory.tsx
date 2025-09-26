import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConversationMemory {
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

  // Load existing memory for user
  useEffect(() => {
    if (user) {
      loadUserMemory();
    }
  }, [user]);

  const loadUserMemory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error is okay
        console.error('Error loading memory:', error);
        return;
      }

      if (data) {
        setMemory(data);
      } else {
        // Create initial memory structure
        const initialMemory = {
          user_id: user.id,
          conversation_context: {},
          symptoms_history: [],
          dosha_analysis: null,
          preferences: {},
          key_insights: []
        };
        
        const { data: newMemory, error: createError } = await supabase
          .from('conversation_memory')
          .insert([initialMemory])
          .select()
          .single();

        if (createError) {
          console.error('Error creating memory:', createError);
        } else {
          setMemory(newMemory);
        }
      }
    } catch (error) {
      console.error('Error with memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemory = async (updates: Partial<ConversationMemory>) => {
    if (!user || !memory) return;

    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating memory:', error);
        return;
      }

      setMemory(data);
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