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

function convertDatabricksRoute(row: DatabricksRouteRow): Route {
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

    // The Databricks routes table does not currently
    // contain a crowded field.
    // We can later get this from current conditions.
    crowded: false,
  };
}

export async function findRoutes(
  origin: string,
  destination: string,
  accessNeeds: AccessNeed[],
): Promise<Route[]> {
  // Get route data from Databricks instead of routes.json
  const databricksRows = await findDatabricksRoutes(origin, destination);

  const matchingRoutes = (databricksRows as DatabricksRouteRow[]).map(
    convertDatabricksRoute,
  );

  let filteredRoutes = matchingRoutes;

  if (accessNeeds.includes("no_stairs")) {
    filteredRoutes = filteredRoutes.filter((route) => route.stairs === 0);
  }

  if (accessNeeds.includes("elevator")) {
    filteredRoutes = filteredRoutes.filter((route) => route.elevators > 0);
  }

  if (accessNeeds.includes("seating")) {
    filteredRoutes = filteredRoutes.filter((route) => route.seatingAvailable);
  }

  if (accessNeeds.includes("restroom")) {
    filteredRoutes = filteredRoutes.filter((route) => route.restroomNearby);
  }

  if (accessNeeds.includes("water")) {
    filteredRoutes = filteredRoutes.filter((route) => route.waterNearby);
  }

  if (accessNeeds.includes("indoor_route")) {
    filteredRoutes = filteredRoutes.filter(
      (route) => route.indoorPercentage >= 70,
    );
  }

  if (accessNeeds.includes("low_stimulation")) {
    filteredRoutes = filteredRoutes.filter((route) => !route.crowded);
  }

  // Keep the behavior your project already had:
  // if every route gets filtered out,
  // fall back to the original matching routes.
  if (filteredRoutes.length === 0) {
    return matchingRoutes.sort((a, b) => a.walkingTime - b.walkingTime);
  }

  return filteredRoutes.sort((a, b) => a.walkingTime - b.walkingTime);
}
