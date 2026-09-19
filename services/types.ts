export type AccessNeed =
  | "no_stairs"
  | "minimize_walking"
  | "minimize_standing"
  | "seating"
  | "low_stimulation"
  | "avoid_heat"
  | "indoor_route"
  | "restroom"
  | "water"
  | "elevator";

export interface StudentRequest {
  message: string;
  origin?: string;
  destination?: string;
  accessNeeds: AccessNeed[];
  urgency?: "low" | "normal" | "high";
  energyLevel?: "low" | "moderate" | "normal";
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  walkingTime: number;
  stairs: number;
  elevators: number;
  slope: "low" | "moderate" | "high";
  indoorPercentage: number;
  seatingAvailable: boolean;
  restroomNearby: boolean;
  waterNearby: boolean;
  crowded: boolean;
}

export interface Event {
  id: string;
  name: string;
  building: string;
  room?: string;
  startTime: string;
  endTime: string;
  eventType: string;
  expectedCrowd: "low" | "moderate" | "high";
  noiseLevel: "low" | "moderate" | "high";
}

export interface AccessPlan {
  summary: string;
  route?: Route;
  steps: string[];
  accommodations: string[];
  warnings: string[];
}
