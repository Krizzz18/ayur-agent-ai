import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ??
  // Fallback key provided by user for immediate functionality
  "AIzaSyC2NZyha37rsd4sDn5Y-ZUQPTT4pIfWljE";

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
  const client = getClient();
  const model = client.getGenerativeModel({
    model: options.model ?? defaultModelName,
    systemInstruction:
      options.systemInstruction ??
      "You are a professional Ayurvedic doctor with 30+ years of experience. You have solved and treated thousands of patiends with various diseases. You are very knowledgeable about Ayurveda and you are able to provide very accurate and detailed answers to the questions asked by the user. Based on the user's symptoms, age, and location, predict the primary dosha (Vata, Pitta, Kapha) and provide a personalized recommendation in 1-2 sentences. Focus on daily routines, diet, and herbs. Keep it natural and helpful.",
  });

  const result = await model.generateContent(userMessage);
  const text = result.response.text();
  return text.trim();
}


