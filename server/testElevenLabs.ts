import { writeFile } from "fs/promises";
import { generateSpeech } from "./services/elevenlabs";

async function testElevenLabs() {
  console.log("===== ELEVENLABS TEST =====");

  const text =
    "You're taking the accessible route to Squires Student Center. The route takes about 12 minutes and has no stairs.";

  console.log("\nGenerating speech...");

  const audio = await generateSpeech(text);

  await writeFile("focus-test.mp3", audio);

  console.log("\nSpeech generated successfully.");
  console.log(`Audio size: ${audio.length} bytes`);
  console.log("Saved to server/focus-test.mp3");
}

testElevenLabs().catch((error) => {
  console.error("ElevenLabs test failed:");
  console.error(error);
});
