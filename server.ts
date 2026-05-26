import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;
function getAIInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware for parsing JSON body
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/quiz/generate", async (req, res) => {
    const { courseTitle, lessonTitle, courseDescription } = req.body;
    
    try {
      const ai = getAIInstance();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a multiple-choice quiz question based on this educational lesson about Ethiopian digitalization and development:
Course title: ${courseTitle || "Digital Literacy"}
Lesson Title: ${lessonTitle || "Introduction"}
Course Description: ${courseDescription || "Education and skills development"}.

Provide exactly one question checking comprehension, 4 multiple choice options, the exact correct answer, and a brief explanation specifying why it is correct.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The multiple choice question to ask the student check understanding of this lesson's topic."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options representing possible answers for the multiple choice question."
              },
              correctAnswer: {
                type: Type.STRING,
                description: "The exact correct option string. It must exactly match one of the items in the options array."
              },
              explanation: {
                type: Type.STRING,
                description: "A short educational text explaining why the answer is correct."
              }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from AI");
      }
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Server AI Quiz generation failed:", error.message || error);
      // Fallback response when key is unset or error occurs
      res.json({
        question: `What is the primary focus of the lesson "${lessonTitle || "Digital Basics"}"?`,
        options: [
          `Familiarizing with the core concepts and real-world skills of ${lessonTitle || "Digital Skills"}.`,
          "Learning about non-digital, traditional methods instead.",
          "Development of non-relevant infrastructure tools.",
          "None of the above."
        ],
        correctAnswer: `Familiarizing with the core concepts and real-world skills of ${lessonTitle || "Digital Skills"}.`,
        explanation: `This lesson emphasizes foundational understanding, development, and application of ${lessonTitle || "sustainable digital solutions"} in the local ecosystem.`
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
