
import { GoogleGenAI, Type } from "@google/genai";

export const getMenuRecommendation = async (mood: string, dietaryPrefs: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `L'utilisateur se sent ${mood} et a ces préférences : ${dietaryPrefs}. Suggère un type de plat parfait et un profil de saveur pour un menu de restaurant de luxe.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishType: { type: Type.STRING },
            flavorProfile: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ['dishType', 'flavorProfile', 'reasoning']
        }
      }
    });
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return null;
  }
};

export const culinaryConcierge = async (message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es le concierge expert de "L'Éclat de Saveurs", un restaurant 3 étoiles. Réponds de manière élégante, concise et passionnée à cette question : ${message}.`,
      config: {
        systemInstruction: "Ton ton est luxueux, accueillant et expert en gastronomie française et accords mets-vins. Tu parles comme un majordome de palace."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Concierge Error:", error);
    return "Nos cuisines sont actuellement en pleine effervescence, je reviens vers vous dans un instant.";
  }
};

/**
 * Génère une image culinaire ultra-photoréaliste en utilisant Gemini 3 Pro Image
 * Utilise des techniques de prompt engineering avancées pour un rendu 2K.
 */
export const generateFoodImage = async (prompt: string) => {
  // Instance créée à chaque appel pour garantir l'utilisation de la clé sélectionnée
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const enrichedPrompt = `
    Ultra-photorealistic Michelin-star culinary art. 
    DISH: ${prompt}. 
    STYLE: Professional food photography for luxury editorial. 
    COMPOSITION: Minimalist architectural plating on a bespoke dark slate plate, vast negative space, sculptural height.
    TEXTURES: Translucent yuzu gels, velvety emulsions with micro-bubbles, fragile coral tuiles, moisture droplets on herbs, perfectly seared protein with glossy glaze.
    LIGHTING: Moody Chiaroscuro side lighting from a softbox, subtle glints on silver cutlery and 24k gold leaf flakes.
    CAMERA: Shot on Phase One XF with 100mm Macro lens, f/2.8 for razor-sharp focus on a single salt crystal and creamy, cinematic bokeh background.
    QUALITY: 8k resolution, photorealistic, highly detailed, vibrant but natural color grading.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: enrichedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "2K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error; // Propager l'erreur pour gérer le renouvellement de clé si nécessaire
  }
};
