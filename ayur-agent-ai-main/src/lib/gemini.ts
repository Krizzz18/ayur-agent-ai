import { apiClient } from "./api";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔒 SECURITY: Prefer Flask backend; fall back to direct Gemini if backend unreachable
// This ensures chat works both in dev (Flask running) and when Flask is down / not deployed

const defaultModelName = "gemini-2.5-flash";

export interface GenerateReplyOptions {
  model?: string;
  systemInstruction?: string;
}

export async function generateGeminiReply(
  userMessage: string,
  options: GenerateReplyOptions = {}
): Promise<string> {
  const { systemInstruction, model: modelName } = options;
  // 1) Try Flask backend first
  try {
    const reply = await apiClient.chat(userMessage, systemInstruction);
    return reply.trim();
  } catch (backendError: any) {
    const msg = backendError?.message || "";
    // Surface well-known backend errors immediately without fallback masking
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      throw new Error('❌ Invalid API Key: Your Gemini API key is not valid. Please check your configuration.');
    }
    if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('⏳ API Quota Exceeded: You have reached the limit for Gemini API calls. Please try again later.');
    }
    if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
      throw new Error('🔒 Permission Denied: Your API key does not have permission to access this model.');
    }

    // 2) Fallback: direct Gemini SDK using VITE_GEMINI_API_KEY (client-side)
    const directKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY as string | undefined;
    const isNetworkError = msg.includes('Network Error') || msg.includes('fetch') || msg.includes('Could not connect') || msg.includes('timed out') || msg.includes('Failed to fetch');
    if (directKey && directKey.length > 20 && isNetworkError) {
      try {
        console.warn('[gemini] Flask backend unreachable, falling back to direct Gemini SDK', msg);
        const genAI = new GoogleGenerativeAI(directKey);
        const model = genAI.getGenerativeModel({
          model: modelName || defaultModelName,
          ...(systemInstruction ? { systemInstruction } as any : {}),
        });
        const result = await model.generateContent(userMessage);
        const text = result?.response?.text?.() || (result as any)?.response?.text || '';
        if (text && String(text).trim()) return String(text).trim();
        // try alternative access path
        const candidates = (result as any)?.response?.candidates;
        const altText = candidates?.[0]?.content?.parts?.[0]?.text;
        if (altText) return String(altText).trim();
        throw new Error('Empty response from Gemini (direct fallback)');
      } catch (directError: any) {
        // If direct also fails, throw enhanced network error with both causes
        const directMsg = directError?.message || String(directError);
        if (directMsg.includes('API_KEY_INVALID') || directMsg.includes('API key not valid')) {
          throw new Error('❌ Invalid API Key: Your Gemini API key is not valid. Please check your configuration.');
        }
        throw new Error(`🌐 Network Error: Could not connect to AI service. Backend unreachable (${msg}) and direct Gemini fallback failed: ${directMsg}. Ensure Flask backend is running (python src/main.py) or check your API key / internet.`);
      }
    }

    if (msg.includes('Network Error') || msg.includes('fetch') || msg.includes('Could not connect') || msg.includes('timed out')) {
      throw new Error(`🌐 Network Error: Could not connect to AI service. ${msg} Please ensure Flask backend is running at ${import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000'} (run: python src/main.py) and check your internet connection.`);
    }
    // Generic fallback
    throw new Error(`🤖 AI Error: ${msg || 'Failed to generate response. Please try again.'}`);
  }
}

export async function generateGeminiReplyWithFallback(
  userMessage: string,
  options: GenerateReplyOptions = {}
): Promise<string> {
  return generateGeminiReply(userMessage, options);
}


