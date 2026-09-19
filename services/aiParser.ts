import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { StudentRequest } from "./types";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function parseStudentRequestWithAI(
  message: string,
): Promise<StudentRequest> {
  const prompt = `
You are HokieAssist, an AI campus accessibility assistant for Virginia Tech.

Your job is to understand a student's request and convert it into structured JSON.

Extract:
- origin: starting campus location, if mentioned
- destination: destination campus location, if mentioned
- accessNeeds: any relevant accessibility preferences
- urgency: "low", "normal", or "high"
- energyLevel: "low", "moderate", or "normal"

Allowed accessNeeds:
- no_stairs
- minimize_walking
- minimize_standing
- seating
- low_stimulation
- avoid_heat
- indoor_route
- restroom
- water
- elevator

Important:
- Do not diagnose or infer a medical condition.
- Treat accessibility needs as preferences or current needs.
- Only include an access need when the student's message supports it.
- If origin or destination is not mentioned, use null.
- If urgency is not clear, use "normal".
- If energy level is not clear, use "normal".

Return ONLY valid JSON in this exact structure:

{
  "message": "original student message",
  "origin": "location or null",
  "destination": "location or null",
  "accessNeeds": [],
  "urgency": "normal",
  "energyLevel": "normal"
}

Student message:
${message}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const cleanedText = text
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  const parsed = JSON.parse(cleanedText);

  return parsed as StudentRequest;
}

export async function runAIRequest(message: string): Promise<StudentRequest> {
  return parseStudentRequestWithAI(message);
}
