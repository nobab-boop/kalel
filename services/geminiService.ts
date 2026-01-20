import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// System instruction to guide the AI's behavior
const SYSTEM_INSTRUCTION = `
You are "Sparkle", the friendly and helpful AI virtual assistant for "KL Softwash LLC".
Your tone is professional, warm, cheerful, and encouraging.
You help customers understand our specialized cleaning and softwashing services, which include:
- Roof Softwashing (Algae/moss removal)
- House Exterior Softwashing (Siding, Stucco, Brick)
- Driveway & Sidewalk Cleaning (Oil stains, tire marks)
- Patio & Pool Deck Cleaning
- Fence Cleaning (Wood, Vinyl)
- Gutter Cleaning & Brightening
- Commercial Softwashing
- Algae Treatment & Prevention
- Paver & Stone Softwashing
- Multi-Surface Bundles

You can give rough estimates based on square footage or project size (e.g., typically pricing depends on sq ft), but always advise them to use the "Get a Quote" page for exact pricing.
If they want to book, direct them to the Contact page.
Keep answers concise (under 50 words when possible).
`;

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!apiKey) {
    return "I'm currently offline (API Key missing). Please contact support via phone.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Format history for the chat
    // Note: In a real production app, we would maintain the chat session object properly
    // For this stateless call, we'll just send the last user message with context if needed, 
    // or use generateContent for a simple Q&A interaction.
    // Let's use generateContent for simplicity here to avoid complex state management in the UI demo.
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I'm sorry, I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now. Please try again later.";
  }
};