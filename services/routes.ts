import { findRoutes as findDatabricksRoutes } from "../server/services/databricks";
import { AccessNeed, Route } from "./types";

type DatabricksRouteRow = {
  route_id: string;
  origin: string;
  destination: string;
  distance_miles: number;
  walking_time: number;
  stairs: number;
  elevators: number;
  slope: string;
  indoor_percentage: number;
  seating: boolean;
  restroom_nearby: boolean;
  water_nearby: boolean;
};

interface RoutePreferences {
  energyLevel?: "low" | "moderate" | "normal";
  urgency?: "low" | "normal" | "high";
}

function normalizeSlope(value: string): Route["slope"] {
  const slope = value?.toLowerCase();

  if (slope === "high") {
    return "high";
  }

  if (slope === "moderate" || slope === "medium") {
    return "moderate";
  }

  return "low";
}

function toBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

function convertDatabricksRoute(
  row: DatabricksRouteRow,
): Route {
  return {
    id: row.route_id,
    origin: row.origin,
    destination: row.destination,
    distance: Number(row.distance_miles),
    walkingTime: Number(row.walking_time),
    stairs: Number(row.stairs),
    elevators: Number(row.elevators),
    slope: normalizeSlope(row.slope),
    indoorPercentage: Number(row.indoor_percentage),
    seatingAvailable: toBoolean(row.seating),
    restroomNearby: toBoolean(row.restroom_nearby),
    waterNearby: toBoolean(row.water_nearby),

    // Crowding can later come from Databricks conditions.
    crowded: false,
  };
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
    score += route.walkingTime * 0.75;
    score += route.stairs * 10;

    if (route.elevators > 0) {
      score -= 5;
    }

    if (route.seatingAvailable) {
      score -= 5;
    }

    if (route.slope === "high") {
      score += 20;
    } else if (route.slope === "moderate") {
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
    score += route.walkingTime * 1.5;
    score += route.distance * 5;
  }

  if (preferences.urgency === "low") {
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
 * Gets routes from Databricks and ranks them using
 * HokieAssist's existing accessibility scoring.
 */
export async function findRoutes(
  origin: string,
  destination: string,
  accessNeeds: AccessNeed[],
  preferences: RoutePreferences = {},
): Promise<Route[]> {
  const databricksRows = await findDatabricksRoutes(
    origin,
    destination,
  );

  const matchingRoutes = (
    databricksRows as DatabricksRouteRow[]
  ).map(convertDatabricksRoute);

  if (matchingRoutes.length === 0) {
    return [];
  }

  // No stairs is treated as a hard accessibility requirement.
  let viableRoutes = matchingRoutes;

  if (accessNeeds.includes("no_stairs")) {
    viableRoutes = viableRoutes.filter(
      (route) => route.stairs === 0,
    );
  }

  // If no route satisfies the hard requirement,
  // return the closest alternatives rather than nothing.
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