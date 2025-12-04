import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI({ apiKey: import.meta.env.VITE_API_KEY });

export const getAIRecommendations = async (query, menuItems) => {
  try {
    // Summarize menu for context
    const menuContext = menuItems.slice(0, 20).map(item => 
      `${item.name} (${item.isVeg ? 'Veg' : 'Non-Veg'}) - ₹${item.price}`
    ).join('\n');

    const prompt = `
      You are a helpful food concierge for EatClub. 
      The user is asking: "${query}".
      
      Here is a sample of our menu:
      ${menuContext}

      Recommend 1-2 specific dishes from this list.
      Be brief, witty. Mention the EatClub membership price savings if applicable.
      Keep it under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't find a perfect match, but our Comfort Meals are legendary!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the food network right now. Try the Ghee Toor Dal Khichdi!";
  }
};