import { runHokieAgent } from "./agent";

console.log("===== TEST 1: No stairs + seating =====");

const test1 = runHokieAgent({
  message:
    "I need to get from Newman Library to Squires. I don't want stairs and I need somewhere to sit.",
  origin: "Newman Library",
  destination: "Squires Student Center",
  accessNeeds: ["no_stairs", "seating"],
});

console.log(test1);

console.log("\n===== TEST 2: Indoor route =====");

const test2 = runHokieAgent({
  message:
    "Get me from Newman Library to Squires. I want to stay indoors as much as possible.",
  origin: "Newman Library",
  destination: "Squires Student Center",
  accessNeeds: ["indoor_route"],
});

console.log(test2);

console.log("\n===== TEST 3: Low stimulation =====");

const test3 = runHokieAgent({
  message: "I need to get to Squires and I want to avoid crowded routes.",
  origin: "Newman Library",
  destination: "Squires Student Center",
  accessNeeds: ["low_stimulation"],
});

console.log(test3);

import { parseStudentRequest } from "./requestParser";

console.log("\n===== NATURAL LANGUAGE TEST =====");

const message =
  "I'm exhausted and need to get somewhere without stairs. I also need somewhere to sit.";

const parsed = parseStudentRequest(message);

console.log(parsed);
