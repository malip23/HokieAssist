import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

import type {
    AccessNeed,
    StudentRequest,
} from "../../services/types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY");
}

const ai = new GoogleGenAI({
  apiKey,
});

const allowedAccessNeeds = new Set<AccessNeed>([
  "no_stairs",
  "minimize_walking",
  "minimize_standing",
  "seating",
  "low_stimulation",
  "avoid_heat",
  "indoor_route",
  "restroom",
  "water",
  "elevator",
]);

function isAccessNeed(value: unknown): value is AccessNeed {
  return (
    typeof value === "string" &&
    allowedAccessNeeds.has(value as AccessNeed)
  );
}

export async function parseStudentRequestWithGemini(
  message: string,
): Promise<StudentRequest> {
  const prompt = `
You are HokieAssist, an AI campus accessibility assistant for Virginia Tech.

Convert the student's request into structured JSON.

Extract:
- origin: starting campus location, if mentioned
- destination: destination campus location, if mentioned
- accessNeeds: relevant accessibility preferences
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

Rules:
- Never diagnose or infer a medical condition.
- Only include needs supported by the student's message.
- If a location is missing, use null.
- Default urgency and energyLevel to "normal".
- Return only valid JSON.

Required structure:
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

  const parsed = JSON.parse(cleanedText) as Record<string, unknown>;

  const accessNeeds = Array.isArray(parsed.accessNeeds)
    ? parsed.accessNeeds.filter(isAccessNeed)
    : [];

  const urgency =
    parsed.urgency === "low" || parsed.urgency === "high"
      ? parsed.urgency
      : "normal";

  const energyLevel =
    parsed.energyLevel === "low" ||
    parsed.energyLevel === "moderate"
      ? parsed.energyLevel
      : "normal";

  return {
    message,
    origin:
      typeof parsed.origin === "string"
        ? parsed.origin
        : undefined,
    destination:
      typeof parsed.destination === "string"
        ? parsed.destination
        : undefined,
    accessNeeds,
    urgency,
    energyLevel,
  };
}