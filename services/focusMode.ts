import { AccessPlan } from "./types";

export type FocusStepPriority = "start" | "progress" | "arrival";

export interface FocusStep {
  text: string;
  priority: FocusStepPriority;
}

export function createFocusNarration(plan: AccessPlan): FocusStep[] {
  const route = plan.route;

  // If there is no route, there is nothing to narrate.
  if (!route) {
    return [];
  }

  const steps: FocusStep[] = [];

  // --------------------------------
  // START
  // --------------------------------

  let startMessage =
    `You're taking the accessible route to ${route.destination}. ` +
    `The route takes about ${route.walkingTime} minutes.`;

  if (route.stairs === 0) {
    startMessage += " There are no stairs on this route.";
  }

  steps.push({
    text: startMessage,
    priority: "start",
  });

  // --------------------------------
  // PROGRESS
  // --------------------------------

  let progressMessage = `Leave ${route.origin} and follow the accessible route toward ${route.destination}.`;

  if (route.elevators > 0) {
    progressMessage += " An elevator is available along the route.";
  }

  if (route.seatingAvailable) {
    progressMessage += " Seating is available along the route.";
  }

  steps.push({
    text: progressMessage,
    priority: "progress",
  });

  // --------------------------------
  // ARRIVAL
  // --------------------------------

  steps.push({
    text: `You've arrived at ${route.destination}.`,
    priority: "arrival",
  });

  return steps;
}
