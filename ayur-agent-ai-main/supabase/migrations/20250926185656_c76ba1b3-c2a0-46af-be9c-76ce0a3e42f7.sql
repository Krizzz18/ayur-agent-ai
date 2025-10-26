-- Create conversation memory table for storing user's chat history and insights
CREATE TABLE public.conversation_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_context JSONB DEFAULT '{}',
  symptoms_history TEXT[] DEFAULT ARRAY[]::TEXT[],
  dosha_analysis TEXT,
  preferences JSONB DEFAULT '{}',
  key_insights TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.conversation_memory ENABLE ROW LEVEL SECURITY;

-- Create policies for conversation memory
CREATE POLICY "Users can view their own memory" 
ON public.conversation_memory 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memory" 
ON public.conversation_memory 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory" 
ON public.conversation_memory 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory" 
ON public.conversation_memory 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_conversation_memory_updated_at
BEFORE UPDATE ON public.conversation_memory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add chat_messages table for storing individual messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'agent')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable Row Level Security for chat messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages (users can only access messages from their consultations)
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.consultations c 
    WHERE c.id = consultation_id AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultations c 
    WHERE c.id = consultation_id AND c.user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX idx_chat_messages_consultation_id ON public.chat_messages(consultation_id);
CREATE INDEX idx_chat_messages_timestamp ON public.chat_messages(timestamp);
CREATE INDEX idx_conversation_memory_user_id ON public.conversation_memory(user_id);