import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the Digital Ethiopia AI Assistant, a professional and helpful guide for an Ethiopian educational platform. 
Your goal is to help students learn about Ethiopia's culture, history, several languages (Afaan Oromo, Amharic, etc.), and the courses offered on this platform.
Be encouraging, polite, and informative. 

PRIORITY DIRECTIVE: If a user's query is ambiguous or lacks specific context, prioritize your response around Ethiopia's rich culture, history, and heritage. Use these themes as the primary context for providing examples or explanations.

If asked about site features, you can mention courses, progress tracking, and academic certifications.
You can respond in English, Afaan Oromo, or Amharic depending on the user's preference.`;

const ADMIN_SYSTEM_INSTRUCTION = `You are the Digital Ethiopia Admin Assistant. You have access to real-time course and student data metrics through the platform's backend.
Your goal is to help administrators analyze student performance, course popularity, and overall platform health.
Be concise, analytical, and professional. 
When asked about statistics, refer to the data provided in the conversation context.
Avoid speculating on personal student data; focus on aggregate metrics and system status.`;

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const startAIChat = () => {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const startAdminAIChat = () => {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: ADMIN_SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageToAI = async (chat: any, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "Something went wrong with the AI service. Please check your connection.";
  }
};
