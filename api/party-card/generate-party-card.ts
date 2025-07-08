
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { GeneratedJsonSchema } from "../../types/party-card/generate-card";
import { handleCorsOption } from "../../utils/handle-cors-options";


export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  await handleCorsOption(req, res);

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

const victoriaExampleCard = {
  id: "viki",
  headerSection: {
    isActive: true,
    name: {
      isActive: false,
      text: "Victoria",
      color: "linear-gradient(110deg, #ff0000 0%, #bc10e7 50%, #5e92d0 100%)",
      isGradient: true,
      isStrokeColor: true,
      strokeColor: "#fff",
      font: "Oswald",
    },
    supriseCard: {
      isActive: false,
      isShowCard: true,
      text: "",
      color: "blue",
      backgroundColor: "red",
      font: "Oswald",
    },
    textAboveName: {
      isActive: true,
      text: "Happy Birthday",
      color: "white",
      font: "Aboreto",
      isGradient: false,
    },
    textUnderName: {
      isActive: true,
      text: " ❤️ ❤️ ❤️",
      color: "white",
      font: "Noto Serif",
      isGradient: false,
    },
    gif: {
      isShow: false,
      url: "",
    },
    endText: {
      isActive: true,
      font: "Aboreto",
      text: "⬇️⬇️ I wish you... ⬇️⬇️",
      color: "#fff",
      isGradient: false,
    },
  },

  backgroundSection: {
    background: {
      color: "#07090e",
      isGradient: false,
    },
    confetti: {
      onStart: true,
      buttonConfetti: true,
      amountConfetti: 1083.2,
      isActive: true,
    },
    backgroundDecorations: {
      isDecorations: true,
      kindDecorations: "heart",
      color: "#cb4141",
      isGradient: false,
    },
    fireworks: {
      isFireworks: true,
      intensity: 8.3,
    },
    music: {
      isMusic: false,
      volume: 20,
      url: "",
    },
  },

  wishesSection: [
    {
      id: "e6d3ada8-cc73-45ba-910d-d8c73f120284",
      name: "wishWall",
      texts: [
        {
          id: "620ebeb9-bc9f-4c0f-9210-7f12a525c41d",
          content: "smiles ",
        },
        {
          id: "bfd728ed-5509-4177-971c-cbd108defb55",
          content: "happiness",
        },
        {
          id: "13dcde25-f739-451c-846f-2039922b5f12",
          content: "money",
        },
        {
          id: "0bd5c1ab-a9ee-4315-bf78-0d6d6af5f9b5",
          content: "lots of free time",
        },
        {
          id: "75bc776d-092e-4591-9363-4d6c10a399fe",
          content: "gifts ",
        },
        {
          id: "48a2c72a-fff5-4cdf-a29b-7dc1f4860862",
          content: "happy moments",
        },
      ],
      color: "#fff",
      font: "Aboreto",
    },
    {
      id: "ce7892fa-983a-4124-af61-570f17e2d54a",
      name: "text",
      text: "Remember! You are awesome person!",
      isFullWidth: false,
      color: "linear-gradient(110deg, #ff0000 0%, #bc10e7 50%, #5e92d0 100%)",
      backgroundColor: "#fff",
      font: "Oswald",
      marginTop: 45.9,
      marginBottom: 237.8,
      isGradient: true,
      size: "medium",
    },
  ],
};

  try {
    const systemPrompt =
     `You are an assistant that generates valid JSON output for party cards based on the provided name and notes.
Follow these strict rules when generating the JSON:

1. For the wishesSection array, the "name" field must be exactly one of the following: "tagCloud", "wishWall", "imageURL", "gif", "text".
2. Do NOT invent other values for "name". If the content is a simple message, use "text".
3. Do NOT use "imageURL" or "gif" sections at all.
4. Do NOT use the "supriseCard" unless explicitly requested in the notes.
5. Ensure proper contrast between background and text colors for good readability (light text on dark backgrounds, or vice versa).
6. By default, prefer dark background colors (e.g. black, navy, dark purple).
7. Be creative and vary fonts and messages to make the card feel unique and festive.
8. Always follow the exact structure and field names defined by the schema.
9. Don't repeat yourself
10. If you don't want to specify a font, omit the field entirely. Never use null.

This is JSON example: ${JSON.stringify(victoriaExampleCard)}
`;
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
