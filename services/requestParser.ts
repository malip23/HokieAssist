import { AccessNeed, StudentRequest } from "./types";

export function parseStudentRequest(message: string): StudentRequest {
  const text = message.toLowerCase();

  const accessNeeds: AccessNeed[] = [];

  // Stairs
  if (
    text.includes("no stairs") ||
    text.includes("avoid stairs") ||
    text.includes("without stairs")
  ) {
    accessNeeds.push("no_stairs");
  }

  // Seating
  if (
    text.includes("sit") ||
    text.includes("seat") ||
    text.includes("seating")
  ) {
    accessNeeds.push("seating");
  }

  // Indoor route
  if (
    text.includes("indoors") ||
    text.includes("inside") ||
    text.includes("indoor")
  ) {
    accessNeeds.push("indoor_route");
  }

  // Low stimulation / crowds
  if (
    text.includes("crowd") ||
    text.includes("quiet") ||
    text.includes("low stimulation")
  ) {
    accessNeeds.push("low_stimulation");
  }

  // Restroom
  if (text.includes("bathroom") || text.includes("restroom")) {
    accessNeeds.push("restroom");
  }

  // Water
  if (text.includes("water") || text.includes("water fountain")) {
    accessNeeds.push("water");
  }

  // Elevator
  if (text.includes("elevator")) {
    accessNeeds.push("elevator");
  }

  return {
    message,
    accessNeeds,
  };
}
