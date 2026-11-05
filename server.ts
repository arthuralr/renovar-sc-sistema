import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

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

// Endpoint for AI Budget & Technical Memorial Generation
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

    const prompt = `
Você é o Engenheiro Chefe Especialista em Patologia das Construções e Recuperação de Fachadas da empresa "Renovar SC - Soluções Prediais" em Santa Catarina.
Gere um Memorial Descritivo Técnico e Orçamento Sintético Formal de altíssimo nível para o seguinte cliente:

- Contratante / Edificação: ${condoName}
- Localização: ${location}
- Porte: ${towersNum} torre(s) / bloco(s), ${floorsNum} pavimentos
- Área estimada de fachada: ${areaNum} m²
- Patologias identificadas no laudo preliminar: ${pathologies.join(", ")}
- Grau de Urgência: ${urgency}
- Observações de campo: ${notes || "Inspeção visual preliminar e ensaio à percussão realizados."}

Responda ESTRITAMENTE em formato JSON com o seguinte formato:
{
  "protocol": "string (ex: REV-2026-9482)",
  "title": "string (Título formal da proposta)",
  "executiveSummary": "string (Diagnóstico técnico preciso das patologias e riscos conforme NBRs)",
  "norms": ["string", "string"],
  "services": [
    {
      "code": "string (ex: 01.01)",
      "description": "string",
      "methodology": "string (procedimento executivo técnico)",
      "unit": "string (m², m, vb, un)",
      "quantity": number,
      "unitPrice": number,
      "total": number
    }
  ],
  "methodologyHighlights": [
    {
      "step": number,
      "title": "string",
      "detail": "string"
    }
  ],
  "timelineWeeks": number,
  "warrantyYears": number,
  "paymentConditions": "string (ex: Entrada + 4 parcelas vinculadas às medições de avanço)",
  "subtotal": number,
  "bdiPercent": number,
  "totalPrice": number,
  "technicalResponsible": "string (ex: Responsável Técnico Operacional - Renovar SC)"
}
`;

    if (ai) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini timeout")), 1800)
        );

        const aiPromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction:
              "Você é um engenheiro civil especialista em recuperação de fachadas prediais, ensaios de percussão, tratamento de concreto armado, juntas de dilatação e impermeabilização em Santa Catarina (litoral com alta salinidade e ventos costeiros). Forneça estimativas de preços reais de mercado em Real (R$).",
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        const rawText = response.text?.trim() || "";
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return res.json({ success: true, data: parsed, source: "gemini-3.8-flash" });
        }
      } catch (geminiError) {
        console.warn("Gemini API call timed out or failed, using local engineering engine:", geminiError);
      }
    }

    // High quality deterministic fallback matching engineering standards
    const baseRatePerM2 = 42.5; // R$ por m² de inspeção e reparo padrão
    const pathologyMultiplier = 1 + pathologies.length * 0.12;
    const urgencyMultiplier = urgency === "Alta / Risco de Queda" ? 1.25 : urgency === "Média" ? 1.1 : 1.0;
    const computedTotal = Math.round(areaNum * baseRatePerM2 * pathologyMultiplier * urgencyMultiplier);
    const subtotal = Math.round(computedTotal / 1.22);
    const bdiValue = computedTotal - subtotal;

    const fallbackData = {
      protocol: `RSC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Memorial Descritivo e Proposta Técnica de Restauração de Fachada - ${condoName}`,
      executiveSummary: `Inspeção técnica diagnóstica no ${condoName} (${location}), composto por ${towersNum} torre(s) de ${floorsNum} pavimentos com aproximadamente ${areaNum.toLocaleString("pt-BR")} m² de envelope predial. Identificou-se incidência prioritária de ${pathologies.join(
        ", "
      )}, demandando intervenção especializada com proteção de pedestres, montagem de balancins suspensos elétricos certificados pela NR-18/NR-35 e recuperação com argamassas poliméricas tixotrópicas.`,
      norms: [
        "ABNT NBR 13755 (Revestimento de paredes externas e fachadas com placas cerâmicas)",
        "ABNT NBR 9574 (Execução de impermeabilização)",
        "ABNT NBR 15575 (Edificações habitacionais - Desempenho)",
        "NR-35 (Trabalho em Altura)",
        "NR-18 (Condições de Segurança no Trabalho na Indústria da Construção)",
      ],
      services: [
        {
          code: "01.01",
          description: "Montagem, testes e certificação de balancins suspensos elétricos com duplo cabo de segurança e tela fachadeira",
          methodology: "Instalação conforme ART específica e plano de ancoragem predial conforme NR-35/NR-18.",
          unit: "vb",
          quantity: 1,
          unitPrice: 8500,
          total: 8500,
        },
        {
          code: "02.01",
          description: "Ensaio sistemático de percussão manual com martelo pontiagudo para mapeamento 100% de som cavo",
          methodology: "Mapeamento milimétrico com demarcação a giz especial de todos os pontos com delaminação ou descolamento.",
          unit: "m²",
          quantity: areaNum,
          unitPrice: 5.5,
          total: Math.round(areaNum * 5.5),
        },
        {
          code: "03.01",
          description: "Hidrojateamento técnico controlado com água pressurizada a 300 bar para desincrustação de fuligem e eflorescências",
          methodology: "Remoção de fungos, lixiviações e sujidades sem desagregação do substrato são.",
          unit: "m²",
          quantity: areaNum,
          unitPrice: 12.0,
          total: Math.round(areaNum * 12.0),
        },
        {
          code: "04.01",
          description: "Abertura em 'V', escarificação e estancamento de trincas/fissuras com mastique de poliuretano de alto módulo",
          methodology: "Ponte de aderência acrílica e aplicação de cordão delimitador de profundidade tarucel.",
          unit: "m",
          quantity: Math.round(areaNum * 0.15),
          unitPrice: 48.0,
          total: Math.round(areaNum * 0.15 * 48),
        },
        {
          code: "05.01",
          description: "Recuperação de armaduras expostas com escovamento de óxido, conversor galvânico e argamassa graute tixotrópica",
          methodology: "Passivação eletroquímica das armaduras com primer rico em zinco e recomposição volumétrica do cobrimento.",
          unit: "un",
          quantity: Math.max(12, Math.round(floorsNum * 2.5)),
          unitPrice: 280.0,
          total: Math.max(12, Math.round(floorsNum * 2.5)) * 280,
        },
        {
          code: "06.01",
          description: "Aplicação de pintura de acabamento impermeabilizante elastomérica premium com 3 demãos cruzadas",
          methodology: "Formação de membrana elástica anti-fissura com absorção de microfissuras de até 0,3mm e proteção UV.",
          unit: "m²",
          quantity: areaNum,
          unitPrice: 24.0,
          total: Math.round(areaNum * 24.0),
        },
      ],
      methodologyHighlights: [
        {
          step: 1,
          title: "Isolamento Perimetral & Montagem de Balancins",
          detail: "Instalação de bandejas de proteção secundárias e primárias, cabos guia independentes para trava-quedas.",
        },
        {
          step: 2,
          title: "Mapeamento por Percussão & Tratamento Estrutural",
          detail: "Sondagem auditiva detalhada, remoção de placas com som oco e passivação de armaduras com conversor de ferrugem.",
        },
        {
          step: 3,
          title: "Tratamento de Juntas de Dilatação & Fissuras",
          detail: "Substituição de mastiques ressecados por polímero MS híbrido com garantia de estanqueidade contra chuva torrencial.",
        },
        {
          step: 4,
          title: "Pintura Elastomérica & Hidrofugação",
          detail: "Aplicação cruzada de resina elastomérica de alta respirabilidade e repelência de íons cloreto da maresia catarinense.",
        },
      ],
      timelineWeeks: Math.max(6, Math.round(areaNum / 350)),
      warrantyYears: 5,
      paymentConditions: "Entrada de 20% na assinatura do contrato + saldo dividido em medições quinzenais de serviços conferidos.",
      subtotal,
      bdiPercent: 22,
      totalPrice: computedTotal,
      technicalResponsible: "Responsável Técnico Operacional - Renovar SC",
    };

    return res.json({ success: true, data: fallbackData, source: "local-engineering-engine" });
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
