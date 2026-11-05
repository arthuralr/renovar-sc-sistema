import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { generateLocalEngineeringBudget } from "./src/utils/engineeringEngine";

dotenv.config();

const app = express();
app.use(express.json({ limit: "25mb" }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Renovar SC - Soluções Prediais",
    hasGeminiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint for AI Budget & Technical Memorial Generation (Fixed Official Engineering Template)
app.post("/api/gemini/generate-budget", async (req, res) => {
  try {
    const {
      condoName = "Condomínio Edifício Residencial",
      location = "Balneário Camboriú, SC",
      towers = 1,
      floors = 12,
      estimatedArea = 2500,
      pathologies = ["Fissuras e trincas", "Desplacamento cerâmico"],
      urgency = "Média",
      notes = "",
    } = req.body;

    const areaNum = typeof estimatedArea === "number" ? estimatedArea : parseInt(estimatedArea, 10) || 2500;
    const towersNum = typeof towers === "number" ? towers : parseInt(towers, 10) || 1;
    const floorsNum = typeof floors === "number" ? floors : parseInt(floors, 10) || 12;

    let aiVariableObservation = "";

    if (ai) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini timeout")), 1500)
        );

        const prompt = `
Você é o Engenheiro Chefe da "Renovar SC - Soluções Prediais".
Forneça APENAS um JSON com o campo "technicalObservation" (2 frases técnicas formais de engenharia civil) contextualizando os dados variáveis informados para injeção no template oficial fixo de Memorial Descritivo:
- Contratante / Cliente: ${condoName}
- Localização: ${location}
- Porte: ${towersNum} torre(s), ${floorsNum} pavimentos (${areaNum} m²)
- Patologias: ${pathologies.join(", ")}
- Grau de Urgência: ${urgency}
- Anotações: ${notes || "Vistoria técnica e ensaio percussivo em campo."}
Responda estritamente: {"technicalObservation": "..."}
`;

        const aiPromise = ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction:
              "Você é um engenheiro civil especialista em recuperação de fachadas prediais em Santa Catarina. Nunca use o termo 'síndico', utilize sempre 'Contratante / Cliente'.",
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const rawText = response.text?.trim() || "";
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed?.technicalObservation) {
            aiVariableObservation = parsed.technicalObservation;
          }
        }
      } catch (geminiError) {
        console.warn("Using deterministic fixed engineering template:", geminiError);
      }
    }

    const officialProposal = generateLocalEngineeringBudget({
      condoName,
      location,
      towers: towersNum,
      floors: floorsNum,
      estimatedArea: areaNum,
      pathologies,
      urgency,
      notes,
      aiVariableObservation: aiVariableObservation || undefined,
    });

    return res.json({
      success: true,
      data: officialProposal,
      source: aiVariableObservation ? "official-template+ai" : "official-template-engine",
    });
  } catch (err: any) {
    console.error("Error generating budget:", err);
    return res.status(500).json({ error: "Falha ao gerar memorial orçamentário: " + err?.message });
  }
});

// Server initialization & Vite middleware handling
const PORT = process.env.PORT || 3000;

async function startServer() {
  const publicPath = path.resolve(process.cwd(), "public");
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Renovar SC Server running on port ${PORT}`);
  });
}

startServer();
