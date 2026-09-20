import cors from "cors";
import express from "express";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "HokieAssist server",
  });
});

app.post("/api/ai/parse", async (req, res) => {
  const { message } = req.body;

  if (
    typeof message !== "string" ||
    message.trim().length === 0
  ) {
    return res.status(400).json({
      error: "A student request message is required.",
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      error: "The student request is too long.",
    });
  }

  try {
    const { parseStudentRequestWithGemini } = await import(
      "./services/gemini"
    );

    const parsedRequest =
      await parseStudentRequestWithGemini(message.trim());

    return res.json(parsedRequest);
  } catch (error) {
    console.error("Gemini request parsing failed:", error);

    return res.status(500).json({
      error: "HokieAssist could not interpret the request.",
    });
  }
});

app.get("/api/routes", async (req, res) => {
  const origin =
    typeof req.query.origin === "string"
      ? req.query.origin.trim()
      : "";

  const destination =
    typeof req.query.destination === "string"
      ? req.query.destination.trim()
      : "";

  if (!origin || !destination) {
    return res.status(400).json({
      error: "Origin and destination are required.",
    });
  }

  try {
    const { findRoutes } = await import("./services/databricks");

    const routes = await findRoutes(origin, destination);

    return res.json(routes);
  } catch (error) {
    console.error("Databricks route lookup failed:", error);

    return res.status(500).json({
      error: "Failed to retrieve campus routes.",
    });
  }
});

app.post("/api/focus/speech", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required.",
      });
    }

    const { generateSpeech } = await import("./services/elevenlabs");

    const audio = await generateSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(audio);
  } catch (error) {
    console.error("Speech generation failed:", error);

    return res.status(500).json({
      error: "Failed to generate speech.",
    });
  }
});

const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(
    `HokieAssist server running on http://${HOST}:${PORT}`,
  );
});