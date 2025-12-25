
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

const MOVIE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    empatheticMessage: {
      type: Type.STRING,
      description: "A short, empathetic acknowledgement of the user's mood.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The movie title.",
          },
          genre: {
            type: Type.STRING,
            description: "The genre(s) of the movie.",
          },
          reason: {
            type: Type.STRING,
            description: "A one-sentence reason why this movie helps the current mood.",
          },
        },
        required: ["title", "genre", "reason"],
      },
      description: "Exactly 3 movie suggestions.",
    },
  },
  required: ["empatheticMessage", "suggestions"],
};

export const getMovieRecommendations = async (mood: string): Promise<RecommendationResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `You are a 'Mood-to-Movie' specialist. A user is feeling the following: "${mood}". 
  Provide exactly 3 movie recommendations that would help or resonate with this specific feeling. 
  Each suggestion must include Title, Genre, and a one-sentence empathetic reason. 
  Include a short introductory empathetic message before the suggestions.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: MOVIE_SCHEMA,
        temperature: 0.8,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as RecommendationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch movie recommendations. Please try again.");
  }
};
