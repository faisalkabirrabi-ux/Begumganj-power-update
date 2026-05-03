import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OutagePrediction {
  probability: number;
  estimatedTime: string;
  reasonEn: string;
  reasonBn: string;
  confidence: "low" | "medium" | "high";
}

export async function predictPowerOutage(
  historicalData: any,
  weatherForecast: string,
  currentGridLoad: number
): Promise<OutagePrediction> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined. Using fallback prediction.");
    return {
      probability: 15,
      estimatedTime: "Stable",
      reasonEn: "Predictive AI disabled (Missing API Key). Check your settings.",
      reasonBn: "এআই প্রেডিকশন বন্ধ (API Key নেই)। সেটিংস চেক করুন।",
      confidence: "low"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following electricity grid data for Begumganj, Noakhali and predict if a power outage (load shedding) is likely in the next 1 hour.
        
        Historical Data: ${JSON.stringify(historicalData)}
        Weather Forecast: ${weatherForecast}
        Current Grid Load: ${currentGridLoad}%
        
        Provide a prediction in JSON format.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["probability", "estimatedTime", "reasonEn", "reasonBn", "confidence"],
          properties: {
            probability: { type: Type.NUMBER, description: "Probability percentage (0-100)" },
            estimatedTime: { type: Type.STRING, description: "Estimated time of outage (e.g. 'Within 30 mins' or 'Stable')" },
            reasonEn: { type: Type.STRING, description: "Brief explanation in English" },
            reasonBn: { type: Type.STRING, description: "Brief explanation in Bengali" },
            confidence: { type: Type.STRING, enum: ["low", "medium", "high"] }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as OutagePrediction;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    // Fallback safe value
    return {
      probability: 10,
      estimatedTime: "Stable",
      reasonEn: "Unable to reach AI advisor. Grid seems stable.",
      reasonBn: "AI উপদেষ্টার সাথে যোগাযোগ করা যাচ্ছে না। গ্রিড স্থিতিশীল মনে হচ্ছে।",
      confidence: "low"
    };
  }
}
