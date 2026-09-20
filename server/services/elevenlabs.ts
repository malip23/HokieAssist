import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  throw new Error("Missing ELEVENLABS_API_KEY");
}

const elevenlabs = new ElevenLabsClient({
  apiKey,
});

/**
 * Converts Focus Mode narration into speech.
 *
 * Returns the generated audio as a Buffer.
 */
export async function generateSpeech(text: string): Promise<Buffer> {
  const audio = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128",
  });

  const arrayBuffer = await new Response(audio).arrayBuffer();

  return Buffer.from(arrayBuffer);
}
