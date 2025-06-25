import { z } from 'zod';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ChatOpenAI } from '@langchain/openai';
import { ChatDeepSeek } from '@langchain/deepseek';

const NamesFont = z.enum(["Oswald", "Noto Serif", "Aboreto", "Jost", "Kaushan", "Playfair"]);

const SingleText = z.object({ id: z.string(), content: z.string() });
const ListTexts = z.array(SingleText);

const TagCloudType = z.object({
  name: z.literal("tagCloud"),
  id: z.string(),
  texts: ListTexts,
  color: z.string(),
  font: NamesFont,
});
const WallWishType = z.object({
  name: z.literal("wishWall"),
  id: z.string(),
  texts: ListTexts,
  color: z.string(),
  font: NamesFont,
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
  font: NamesFont,
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
    font: NamesFont,
  }),
  supriseCard: z.object({
    isActive: z.boolean(),
    isShowCard: z.boolean(),
    text: z.string(),
    color: z.string(),
    backgroundColor: z.string(),
    font: NamesFont,
  }),
  textAboveName: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: z.string(),
    font: NamesFont,
    isGradient: z.boolean(),
  }),
  textUnderName: z.object({
    isActive: z.boolean(),
    text: z.string(),
    color: z.string(),
    font: NamesFont,
    isGradient: z.boolean(),
  }),
  gif: z.object({ isShow: z.boolean(), url: z.string() }),
  endText: z.object({
    isActive: z.boolean(),
    font: NamesFont,
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


export default async function handler(req: VercelRequest, res: VercelResponse) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (req.method === "OPTIONS") {
    res.writeHead(200, CORS_HEADERS);
    res.end();
    return;
  }

res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


  if (req.method == "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  console.log(req.body);

  return res.status(200).json({ message: req.body });

  const { personName, additionalNotes = "", model, token } = req.body || {};
  if (!personName || typeof personName !== "string") {
    res.status(400).json({ error: "Missing 'personName' in request" });
    return;
  }

  let llm;
  if (model && typeof model === "string" && model.toLowerCase().includes("gpt")) {
    llm = new ChatOpenAI({ model: model, temperature: 0.3, apiKey: token });
  } else {
    llm = new ChatDeepSeek({ model: model || "deepseek-reasoner", temperature: 0.3, apiKey: "sk-7df0bde0720f4721a64fcccb91073a4f" });
  }

  try {
    const systemPrompt = "You are an assistant that generates JSON data for a party card builder application. Only return valid JSON matching the specified structure.";
    const userPrompt = `Name: "${personName}"` + (additionalNotes ? `\\nExtra context: ${additionalNotes}` : "");

    const structured = llm.withStructuredOutput(GeneratedJsonSchema, { name: "PartyCardResponse", method: "json_mode" });
    const result = await structured.invoke(`${systemPrompt}\\n\\n${userPrompt}`);

    const output = GeneratedJsonSchema.parse(result);
    res.status(200).json(output);
  } catch (error) {
    console.error("Error generating JSON:", error);
    res.status(500).json({ error: "Server error" });
  }
}