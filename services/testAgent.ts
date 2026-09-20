import { runHokieAgent } from "./agent";
import { parseStudentRequestWithAI } from "./aiParser";
import { createFocusNarration } from "./focusMode";
import { parseStudentRequest } from "./requestParser";

async function runTests() {
  // =====================================================
  // TEST 1: No stairs + seating
  // =====================================================

  console.log("===== TEST 1: No stairs + seating =====");

  const test1 = await runHokieAgent({
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

  const test2 = await runHokieAgent({
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

  const test3 = await runHokieAgent({
    message:
      "I need to get to Squires and I want to avoid crowded routes.",
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

  const naturalLanguageResult =
    parseStudentRequest(naturalLanguageMessage);

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
  // TEST 6: Gemini → Hokie Agent
  // =====================================================

  console.log("\n===== GEMINI → HOKIE AGENT TEST =====");

  const aiMessage =
    "I'm exhausted and running late. I'm at Newman Library and need to get to Squires Student Center. I don't want stairs and I need somewhere to sit.";

  const studentRequest =
    await parseStudentRequestWithAI(aiMessage);

  console.log("\nAI PARSED REQUEST:");
  console.log(studentRequest);

  const accessPlan = await runHokieAgent(studentRequest);

  console.log("\nFINAL ACCESS PLAN:");
  console.log(accessPlan);

  // =====================================================
  // TEST 8: Personalized route scoring
  // =====================================================

  console.log("\n===== PERSONALIZED ROUTE SCORING =====");

  const normalRequest = await runHokieAgent({
    message:
      "I'm going from Newman Library to Squires Student Center.",
    origin: "Newman Library",
    destination: "Squires Student Center",
    accessNeeds: [],
  });

  console.log("\nNORMAL STUDENT:");
  console.log(normalRequest.route);

  const tiredRequest = await runHokieAgent({
    message:
      "I'm exhausted and need to get from Newman Library to Squires Student Center.",
    origin: "Newman Library",
    destination: "Squires Student Center",
    accessNeeds: ["seating"],
    energyLevel: "low",
  });

  console.log("\nLOW ENERGY STUDENT:");
  console.log(tiredRequest.route);

  const rushedRequest = await runHokieAgent({
    message:
      "I'm running late and need to get from Newman Library to Squires Student Center.",
    origin: "Newman Library",
    destination: "Squires Student Center",
    accessNeeds: [],
    urgency: "high",
  });

  console.log("\nURGENT STUDENT:");
  console.log(rushedRequest.route);

  // =====================================================
  // TEST 9: Focus Mode
  // =====================================================

  console.log("\n===== FOCUS MODE =====");

  const focusSteps = createFocusNarration(normalRequest);

  console.log(focusSteps);
}

runTests().catch((error) => {
  console.error("Agent test failed:");
  console.error(error);
});