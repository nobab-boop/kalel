import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 2.5 Flash Image to edit an image based on a text prompt.
 * Suitable for "Virtual Softwash" previews.
 */
export const generateCleanImage = async (imageBase64: string, prompt: string): Promise<string | null> => {
  try {
    // Extract the raw base64 data and mime type from the data URL
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
       throw new Error("Invalid base64 string provided");
    }
    const mimeType = matches[1];
    const data = matches[2];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    // Iterate through parts to find the image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini AI Image Generation Error:", error);
    throw error;
  }
};