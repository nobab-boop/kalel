
// Service disabled to remove @google/genai dependency
export const generateCleanImage = async (imageBase64: string, prompt: string): Promise<string | null> => {
  console.warn("AI Image generation is currently disabled.");
  return null;
};
