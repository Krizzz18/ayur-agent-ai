// Centralized API client for Flask backend
// All AI calls go through the backend to keep API keys secure
// Falls back to relative /api via Vite proxy when VITE_FLASK_API_URL is not set

const RAW_FLASK_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000';
const FLASK_BASE_URL = RAW_FLASK_URL.replace(/\/$/, ''); // strip trailing slash

interface ChatRequest {
  message: string;
  systemInstruction?: string;
}

interface ChatResponse {
  reply?: string;
  error?: string;
}

interface DoshaPredictionRequest {
  quiz_responses: number[];
}

interface DoshaPredictionResponse {
  dosha: string;
  confidence: number;
  confidence_scores: Record<string, number>;
  model_used: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = FLASK_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async post<T>(endpoint: string, data: unknown): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === 'AbortError') {
        throw new Error('Request timed out (30s) — AI service is slow or unreachable. Check your connection or try again.');
      }
      // Network / CORS / backend down
      const isLocalHost = this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1');
      const hint = isLocalHost
        ? ` Could not reach Flask backend at ${this.baseUrl}. Ensure it is running:  python src/main.py  (or  python -m flask run).`
        : '';
      throw new Error(`Network Error: Could not connect to AI service.${hint} Details: ${err?.message || 'fetch failed'}`);
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status} ${response.statusText}` }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Chat endpoint - routes to Gemini through Flask
  async chat(message: string, systemInstruction?: string): Promise<string> {
    const data: ChatRequest = { message, ...(systemInstruction ? { systemInstruction } : {}) };
    const response = await this.post<ChatResponse>('/api/chat', data);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.reply || 'No response from AI';
  }

  // Dosha prediction endpoint - uses ML model
  async predictDosha(quizResponses: number[]): Promise<DoshaPredictionResponse> {
    const data: DoshaPredictionRequest = { quiz_responses: quizResponses };
    return this.post<DoshaPredictionResponse>('/api/predict-dosha', data);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
