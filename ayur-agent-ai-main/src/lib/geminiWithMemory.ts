import { generateGeminiReply } from './gemini';

export interface GenerateReplyWithMemoryOptions {
  model?: string;
  systemInstruction?: string;
  conversationContext?: string;
}

export async function generateGeminiReplyWithMemory(
  userMessage: string,
  conversationContext: string = '',
  options: GenerateReplyWithMemoryOptions = {}
): Promise<string> {
  
  // Enhanced system instruction with memory context
  const enhancedSystemInstruction = `You are an expert Ayurvedic doctor with 15+ years of clinical practice, deeply versed in Ayurveda principles, dosha imbalances, herbal remedies, diet, and Dinacharya. With compassion, diagnose the user's primary dosha (Vata, Pitta, Kapha) based on symptoms, age, and location, and provide a concise, personalized recommendation (1-2 sentences) focusing on diet, daily routines, and Ayurvedic herbs. Address the user as 'respected one,' integrate prior conversation context, and offer practical, holistic advice to promote balance. Respond as a doctor, not a patient.

${conversationContext ? `Previous Conversation Context:\n${conversationContext}\n\nPlease take this context into account when providing your response.` : ''}`;

  const contextualMessage = conversationContext 
    ? `${userMessage}\n\n[Previous context available for reference]`
    : userMessage;

  return await generateGeminiReply(contextualMessage, {
    ...options,
    systemInstruction: options.systemInstruction || enhancedSystemInstruction
  });
}