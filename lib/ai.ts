
import { GoogleGenAI } from "@google/genai";

export const translateContent = async (text: string, targetLang: 'ar' | 'en'): Promise<string | null> => {
  try {
    if (!process.env.API_KEY) {
        console.warn("API Key missing for translation");
        return null;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for speed
    const prompt = `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. 
    Keep the tone professional and medical context accurate. 
    Return ONLY the translated text, no explanations.
    
    Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || null;
  } catch (error) {
    console.error("AI Translation Error", error);
    return null;
  }
};
