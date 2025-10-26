import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyC2NZyha37rsd4sDn5Y-ZUQPTT4pIfWljE";

// apiKey is guaranteed due to fallback above

const defaultModelName = "gemini-2.5-flash";

let genAI: GoogleGenerativeAI | null = null;
function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY. Add it to your .env file.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface GenerateReplyOptions {
  model?: string;
  systemInstruction?: string;
}

export async function generateGeminiReply(
  userMessage: string,
  options: GenerateReplyOptions = {}
): Promise<string> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: options.model ?? defaultModelName,
      systemInstruction:
        options.systemInstruction ??
        "You are an expert Ayurvedic doctor with 15+ years of clinical practice, deeply versed in Ayurveda principles, dosha imbalances, herbal remedies, diet, and Dinacharya. With compassion, diagnose the user's primary dosha (Vata, Pitta, Kapha) based on symptoms, age, and location, and provide a concise, personalized recommendation (1-2 sentences) focusing on diet, daily routines, and Ayurvedic herbs. Address the user as 'respected one,' integrate prior conversation context, and offer practical, holistic advice to promote balance. Respond as a doctor, not a patient.",
    });

    const result = await model.generateContent(userMessage);
    const text = result.response.text();
    return text.trim();
  } catch (error: any) {
    // Provide specific error messages based on error type
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      throw new Error('❌ Invalid API Key: Your Gemini API key is not valid. Please check your configuration.');
    }
    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('⏳ API Quota Exceeded: You have reached the limit for Gemini API calls. Please try again later.');
    }
    if (error.message?.includes('permission') || error.message?.includes('PERMISSION_DENIED')) {
      throw new Error('🔒 Permission Denied: Your API key does not have permission to access this model.');
    }
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error('🌐 Network Error: Could not connect to Gemini API. Please check your internet connection.');
    }
    // Generic fallback
    throw new Error(`🤖 AI Error: ${error.message || 'Failed to generate response. Please try again.'}`);
  }
}


