import { z } from "zod";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const NamesFont = z.enum([
  "Oswald",
  "Noto Serif",
  "Aboreto",
  "Jost",
  "Kaushan",
  "Playfair",
]);

const SingleText = z.object({ id: z.string(), content: z.string() });
const ListTexts = z.array(SingleText);

const TagCloudType = z.object({
  name: z.literal("tagCloud"),
  id: z.string(),
  texts: ListTexts,
  color: z.string(),
  font: NamesFont.optional().default("Oswald"),
});
const WallWishType = z.object({
  name: z.literal("wishWall"),
  id: z.string(),
  texts: ListTexts,
  color: z.string(),
  font: NamesFont.optional().default("Oswald"),
});
const ImageURLType = z.object({
  name: z.literal("imageURL"),
  id: z.string(),
  isBorder: z.boolean(),
  backgroundColor: z.string(),
  url: z.string(),
});
const GifSectionType = z.object({
  name: z.literal("gif"),
  id: z.string(),
  url: z.string(),
});
const TextType = z.object({
  name: z.literal("text"),
  id: z.string(),
  size: z.enum(["normal", "medium", "theBiggest"]),
  text: z.string(),
  isFullWidth: z.boolean(),
  color: z.string(),
  backgroundColor: z.string(),
  font: NamesFont.optional().default("Oswald"),
  marginTop: z.number(),
  marginBottom: z.number(),
  isGradient: z.boolean(),
});

const UnionWishElements = z.union([
  TagCloudType,
  WallWishType,
  ImageURLType,
  GifSectionType,
  TextType,
]);

const HeaderSection = z.object({
  isActive: z.boolean(),
  name: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: z.string(),
    isGradient: z.boolean(),
    isStrokeColor: z.boolean(),
    strokeColor: z.string(),
    font: NamesFont.optional().default("Oswald"),
  }),
  supriseCard: z.object({
    isActive: z.boolean(),
    isShowCard: z.boolean(),
    text: z.string(),
    color: z.string(),
    backgroundColor: z.string(),
    font: NamesFont.optional().default("Oswald"),
  }),
  textAboveName: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: z.string(),
    font: NamesFont.optional().default("Oswald"),
    isGradient: z.boolean(),
  }),
  textUnderName: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: z.string(),
    font: NamesFont.optional().default("Oswald"),
    isGradient: z.boolean(),
  }),
  gif: z.object({ isShow: z.boolean(), url: z.string() }),
  endText: z.object({
    isActive: z.boolean(),
    font: NamesFont.optional().default("Oswald"),
    text: z.string(),
    color: z.string(),
  }),
});

const BackgroundStore = z.object({
  background: z.object({ color: z.string() }),
  confetti: z.object({
    onStart: z.boolean(),
    buttonConfetti: z.boolean(),
    amountConfetti: z.number(),
    isActive: z.boolean(),
  }),
  backgroundDecorations: z.object({
    isDecorations: z.boolean(),
    kindDecorations: z.string(),
    color: z.string(),
  }),
  fireworks: z.object({
    isFireworks: z.boolean(),
    intensity: z.number(),
  }),
});

const GeneratedJsonSchema = z.object({
  idAuthor: z.string(),
  nameAuthor: z.string(),
  date: z.string(),
  headerSection: HeaderSection,
  backgroundSection: BackgroundStore,
  wishesSection: z.array(UnionWishElements),
});

const examples = [
  {
    input: {
      name: "Victoria",
      notes: "Birthday card with colorful style and positive energy."
    },
    output: JSON.stringify({
      idAuthor: "viki",
      nameAuthor: "Victoria",
      date: "2024-06-01",
      headerSection: {
        isActive: true,
        name: {
          isActive: false,
          text: "Victoria",
          color: "linear-gradient(110deg, #ff0000 0%, #bc10e7 50%, #5e92d0 100%)",
          isGradient: true,
          isStrokeColor: true,
          strokeColor: "#fff",
          font: "Oswald"
        },
        supriseCard: {
          isActive: false,
          isShowCard: true,
          text: "",
          color: "blue",
          backgroundColor: "red",
          font: "Oswald"
        },
        textAboveName: {
          isActive: true,
          text: "Happy Birthday",
          color: "white",
          font: "Aboreto",
          isGradient: false
        },
        textUnderName: {
          isActive: true,
          text: " ❤️ ❤️ ❤️",
          color: "white",
          font: "Noto Serif",
          isGradient: false
        },
        gif: { isShow: false, url: "" },
        endText: {
          isActive: true,
          font: "Aboreto",
          text: "⬇️⬇️ I wish you... ⬇️⬇️",
          color: "#fff",
          isGradient: false
        }
      },
      backgroundSection: {
        background: {
          color: "#07090e",
          isGradient: false
        },
        confetti: {
          onStart: true,
          buttonConfetti: true,
          amountConfetti: 1083.2,
          isActive: true
        },
        backgroundDecorations: {
          isDecorations: true,
          kindDecorations: "heart",
          color: "#cb4141",
          isGradient: false
        },
        fireworks: {
          isFireworks: true,
          intensity: 8.3
        },
        music: {
          isMusic: false,
          volume: 20,
          url: ""
        }
      },
      wishesSection: [] // Można rozszerzyć
    }, null, 2)
  }
];

const examplePrompt = new PromptTemplate({
  template: `Name: {name}\nNotes: {notes}\n\nOutput JSON:\n{output}`,
  inputVariables: ["name", "notes", "output"]
});

const fewShotPrompt = new FewShotPromptTemplate({
  examples,
  examplePrompt,
  prefix: `You are an assistant that generates valid JSON output for party cards. Only return valid JSON. Never return null fonts.`,
  suffix: `Name: {name}\nNotes: {notes}\n\nOutput JSON:\n`,
  inputVariables: ["name", "notes"]
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { personName, additionalNotes = "", model, token } = req.body || {};
  if (!personName || typeof personName !== "string") {
    res.status(400).json({ error: "Missing 'personName' in request" });
    return;
  }

  let llm;
  if (
    model &&
    typeof model === "string" &&
    model.toLowerCase().includes("gpt")
  ) {
    llm = new ChatOpenAI({ model: model, temperature: 0.3, apiKey: token });
  } else {
    llm = new ChatDeepSeek({
      model: model || "deepseek-reasoner",
      temperature: 0.3,
      apiKey: token,
    });
  }

  try {
    const systemPrompt =
      "You are an assistant that generates JSON data for a party card builder application. Only return valid JSON matching the specified structure. Don't use fig or image sections. Never use null for font fields. Always use a valid font from the following: Oswald, Noto Serif, Aboreto, Jost, Kaushan, Playfair.";
    const userPrompt =
      `Name: "${personName}"` +
      (additionalNotes ? `\\nExtra context: ${additionalNotes}` : "");

    const structured = llm.withStructuredOutput(GeneratedJsonSchema, {
      name: "PartyCardResponse",
      method: "json_mode",
    });
    const result = await structured.invoke(
      `${systemPrompt}\\n\\n${userPrompt}`
    );

    const output = GeneratedJsonSchema.parse(result);
    res.status(200).json(output);
  } catch (error) {
    console.error("Error generating JSON:", error);
    res.status(500).json({ error: "Server error", errorDetails: error });
  }
}
