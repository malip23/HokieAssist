import { AccessNeed, AccessPlan, Route } from "./types";

export function createAccessPlan(
  route: Route,
  accessNeeds: AccessNeed[],
): AccessPlan {
  const accommodations: string[] = [];
  const warnings: string[] = [];

  if (route.stairs === 0) {
    accommodations.push("No stairs");
  }

  if (route.elevators > 0) {
    accommodations.push("Elevator available");
  }

  if (route.seatingAvailable) {
    accommodations.push("Seating available along the route");
  }

  if (route.restroomNearby) {
    accommodations.push("Restroom nearby");
  }

  if (route.waterNearby) {
    accommodations.push("Water available nearby");
  }

  if (route.indoorPercentage >= 70) {
    accommodations.push("Mostly indoors");
  }

  if (route.crowded) {
    warnings.push("This route may have higher crowds");
  }

  if (route.slope === "high") {
    warnings.push("This route includes a steep section");
  }

  const steps = [
    `Leave ${route.origin}`,
    `Follow the accessible route toward ${route.destination}`,
    `Estimated walking time: ${route.walkingTime} minutes`,
    `Distance: ${route.distance} miles`,
    `Arrive at ${route.destination}`,
  ];

  return {
    summary: `${route.walkingTime}-minute accessible route from ${route.origin} to ${route.destination}.`,
    route,
    steps,
    accommodations,
    warnings,
  };
}
