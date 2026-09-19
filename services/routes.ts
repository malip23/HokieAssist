import routesData from "../data/routes.json";
import { AccessNeed, Route } from "./types";

const routes = routesData as Route[];

export function findRoutes(
  origin: string,
  destination: string,
  accessNeeds: AccessNeed[],
): Route[] {
  const matchingRoutes = routes.filter(
    (route) =>
      route.origin.toLowerCase() === origin.toLowerCase() &&
      route.destination.toLowerCase() === destination.toLowerCase(),
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

  // If the filters eliminate every route,
  // return the original matching routes instead of giving up.
  if (filteredRoutes.length === 0) {
    return matchingRoutes;
  }

  return filteredRoutes.sort((a, b) => a.walkingTime - b.walkingTime);
}
