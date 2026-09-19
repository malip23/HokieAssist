import { runHokieAgent } from "./agent";
import { parseStudentRequestWithAI } from "./aiParser";
import { parseStudentRequest } from "./requestParser";

// =====================================================
// TEST 1: No stairs + seating
// =====================================================

console.log("===== TEST 1: No stairs + seating =====");

const test1 = runHokieAgent({
  message:
    "I need to get from Newman Library to Squires. I don't want stairs and I need somewhere to sit.",
  origin: "Newman Library",
  destination: "Squires Student Center",
  accessNeeds: ["no_stairs", "seating"],
});

console.log(test1);

// =====================================================
// TEST 2: Indoor route
// =====================================================

console.log("\n===== TEST 2: Indoor route =====");

const test2 = runHokieAgent({
  message:
    "Get me from Newman Library to Squires. I want to stay indoors as much as possible.",
  origin: "Newman Library",
  destination: "Squires Student Center",
  accessNeeds: ["indoor_route"],
});

console.log(test2);

// =====================================================
// TEST 3: Low stimulation
// =====================================================

console.log("\n===== TEST 3: Low stimulation =====");

const test3 = runHokieAgent({
  message: "I need to get to Squires and I want to avoid crowded routes.",
  origin: "Newman Library",
  destination: "Squires Student Center",
  accessNeeds: ["low_stimulation"],
});

console.log(test3);

// =====================================================
// TEST 4: Natural language
// =====================================================

console.log("\n===== TEST 4: NATURAL LANGUAGE =====");

const naturalLanguageMessage =
  "I'm exhausted and need to get somewhere without stairs. I also need somewhere to sit.";

const naturalLanguageResult = parseStudentRequest(naturalLanguageMessage);

console.log(naturalLanguageResult);

// =====================================================
// TEST 5: Energy + urgency
// =====================================================

console.log("\n===== TEST 5: ENERGY + URGENCY =====");

const urgencyMessage =
  "I'm exhausted and running late. I need to get somewhere without stairs and I need somewhere to sit.";

const urgencyResult = parseStudentRequest(urgencyMessage);

console.log(urgencyResult);

// =====================================================
// TEST 6: GEMINI → HOKIE AGENT
// =====================================================

console.log("\n===== GEMINI → HOKIE AGENT TEST =====");

const aiMessage =
  "I'm exhausted and running late. I'm at Newman Library and need to get to Squires Student Center. I don't want stairs and I need somewhere to sit.";

parseStudentRequestWithAI(aiMessage)
  .then((studentRequest) => {
    console.log("\nAI PARSED REQUEST:");
    console.log(studentRequest);

    const accessPlan = runHokieAgent(studentRequest);

    console.log("\nFINAL ACCESS PLAN:");
    console.log(accessPlan);
  })
  .catch((error) => {
    console.error("AI agent test failed:");
    console.error(error);
  });
