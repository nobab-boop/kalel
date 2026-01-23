
// Service disabled to remove @google/genai dependency
export const generateCleanImage = async (_imageBase64: string, _prompt: string): Promise<string | null> => {
  console.warn("AI Image generation is currently disabled.");
  return null;
};
