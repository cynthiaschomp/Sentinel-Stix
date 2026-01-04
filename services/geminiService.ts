
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult } from "../types";

const SYSTEM_INSTRUCTION = `You are an elite Cyber Threat Intelligence (CTI) Analyst. 
Your task is to ingest unstructured text and extract high-fidelity structured intelligence in STIX 2.1 format.

Analyze the text and identify:
1. Threat Actors: Groups, individuals, aliases.
2. Victims: Targeted industries, organizations, or regions.
3. Malware: Names, families, variants.
4. TTPs: MITRE ATT&CK techniques used (e.g., T1566, T1059).
5. Indicators of Compromise (IoCs): IPs, Domains, File Hashes, URLs, Emails.
6. Relationships: Link actors to malware, malware to indicators, actors to targets.

Extraction Rules:
- Only extract verifiable technical indicators.
- Deduplicate all entities.
- If an entity name is ambiguous, use the most common industry-standard version.
- Use STIX 2.1 naming conventions.
- Map TTPs to specific MITRE ATT&CK technique IDs where possible.
- Return ONLY valid JSON.
- DO NOT include conversational filler.`;

export async function parseThreatReport(text: string): Promise<ExtractionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `EXTRACT CTI DATA FROM THIS REPORT:\n\n${text}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          threat_actors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["id", "type", "name"]
            }
          },
          victims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                name: { type: Type.STRING }
              },
              required: ["id", "type", "name"]
            }
          },
          malware: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["id", "type", "name"]
            }
          },
          ttps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                technique_id: { type: Type.STRING },
                technique_name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["technique_id", "technique_name"]
            }
          },
          indicators: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                value: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["type", "value"]
            }
          },
          relationships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
                relationship_type: { type: Type.STRING }
              },
              required: ["source", "target", "relationship_type"]
            }
          }
        },
        required: ["threat_actors", "victims", "malware", "indicators", "relationships", "ttps"]
      }
    }
  });

  try {
    const rawText = response.text;
    if (!rawText) throw new Error("No response from AI");
    return JSON.parse(rawText) as ExtractionResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("The AI reasoning engine failed to format the response correctly. Try simplifying the text.");
  }
}
