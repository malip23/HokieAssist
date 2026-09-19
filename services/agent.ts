import { createAccessPlan } from "./accessPlan";
import { findRoutes } from "./routes";
import { AccessPlan, StudentRequest } from "./types";

export function runHokieAgent(request: StudentRequest): AccessPlan {
  if (!request.origin || !request.destination) {
    return {
      summary:
        "I need your starting location and destination to create an access plan.",
      steps: [],
      accommodations: [],
      warnings: [],
    };
  }

  const routes = findRoutes(
    request.origin,
    request.destination,
    request.accessNeeds,
  );

  if (routes.length === 0) {
    return {
      summary:
        "I couldn't find a route between those locations with the current campus data.",
      steps: [],
      accommodations: [],
      warnings: [],
    };
  }

  const bestRoute = routes[0];

  return createAccessPlan(bestRoute, request.accessNeeds);
}
