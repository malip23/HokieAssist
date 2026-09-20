import cors from "cors";
import express from "express";
import { generateSpeech } from "./services/elevenlabs";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/focus/speech", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required.",
      });
    }

    const audio = await generateSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (error) {
    console.error("Speech generation failed:", error);

    res.status(500).json({
      error: "Failed to generate speech.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HokieAssist server running on http://localhost:${PORT}`);
});
