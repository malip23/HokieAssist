import routesData from "../data/routes.json";

import { AccessNeed, Route } from "./types";

const routes: Route[] = routesData.map((route) => ({
  id: route.route_id,
  origin: route.origin,
  destination: route.destination,
  distance: route.distance_miles,
  walkingTime: route.walking_time,
  stairs: route.stairs,
  elevators: route.elevators,
  slope: route.slope as Route["slope"],
  indoorPercentage: route.indoor_percentage,
  seatingAvailable: route.seating,
  restroomNearby: route.restroom_nearby,
  waterNearby: route.water_nearby,
  crowded: false,
}));

interface RoutePreferences {
  energyLevel?: "low" | "moderate" | "normal";
  urgency?: "low" | "normal" | "high";
}

/**
 * Gives a route a score based on the student's
 * access needs, energy level, and urgency.
 *
 * Lower score = better route.
 */
function scoreRoute(
  route: Route,
  accessNeeds: AccessNeed[],
  preferences: RoutePreferences = {},
): number {
  let score = route.walkingTime;

  // --------------------------------
  // ACCESS NEEDS
  // --------------------------------

  if (accessNeeds.includes("no_stairs")) {
    score += route.stairs * 20;
  }

  if (accessNeeds.includes("elevator")) {
    if (route.elevators > 0) {
      score -= 10;
    } else {
      score += 30;
    }
  }

  if (accessNeeds.includes("seating")) {
    if (route.seatingAvailable) {
      score -= 10;
    } else {
      score += 20;
    }
  }

  if (accessNeeds.includes("restroom")) {
    if (route.restroomNearby) {
      score -= 8;
    } else {
      score += 15;
    }
  }

  if (accessNeeds.includes("water")) {
    if (route.waterNearby) {
      score -= 8;
    } else {
      score += 15;
    }
  }

  if (accessNeeds.includes("indoor_route")) {
    score -= route.indoorPercentage * 0.2;
  }

  if (accessNeeds.includes("low_stimulation")) {
    if (route.crowded) {
      score += 25;
    }
  }

  // --------------------------------
  // ENERGY LEVEL
  // --------------------------------

  if (preferences.energyLevel === "low") {
    // Walking becomes more important when the
    // student has low energy.
    score += route.walkingTime * 0.75;

    // Stairs become more important.
    score += route.stairs * 10;

    // Prefer elevators when available.
    if (route.elevators > 0) {
      score -= 5;
    }

    // Prefer routes with seating.
    if (route.seatingAvailable) {
      score -= 5;
    }

    // Avoid steep routes.
    if (route.slope === "high") {
      score += 20;
    } else if (route.slope === "moderate" || route.slope === "medium") {
      score += 8;
    }
  }

  if (preferences.energyLevel === "moderate") {
    score += route.stairs * 5;

    if (route.slope === "high") {
      score += 10;
    }
  }

  // --------------------------------
  // URGENCY
  // --------------------------------

  if (preferences.urgency === "high") {
    // When running late, walking time matters more.
    score += route.walkingTime * 1.5;

    // Distance matters too.
    score += route.distance * 5;
  }

  if (preferences.urgency === "low") {
    // If there is no rush, accessibility features
    // can matter more than raw speed.
    if (route.seatingAvailable) {
      score -= 3;
    }

    if (route.indoorPercentage >= 70) {
      score -= 5;
    }
  }

  return score;
}

/**
 * Finds and ranks routes based on the student's
 * access needs and current situation.
 */
export function findRoutes(
  origin: string,
  destination: string,
  accessNeeds: AccessNeed[],
  preferences: RoutePreferences = {},
): Route[] {
  const matchingRoutes = routes.filter(
    (route) =>
      route.origin.toLowerCase() === origin.toLowerCase() &&
      route.destination.toLowerCase() === destination.toLowerCase(),
  );

  if (matchingRoutes.length === 0) {
    return [];
  }

  // "No stairs" is treated as a hard requirement.
  let viableRoutes = matchingRoutes;

  if (accessNeeds.includes("no_stairs")) {
    viableRoutes = viableRoutes.filter((route) => route.stairs === 0);
  }

  // If no route satisfies the hard requirement,
  // keep the routes available so the agent can
  // still provide the closest alternatives.
  if (viableRoutes.length === 0) {
    return matchingRoutes.sort(
      (a, b) =>
        scoreRoute(a, accessNeeds, preferences) -
        scoreRoute(b, accessNeeds, preferences),
    );
  }

  return viableRoutes.sort(
    (a, b) =>
      scoreRoute(a, accessNeeds, preferences) -
      scoreRoute(b, accessNeeds, preferences),
  );
}
