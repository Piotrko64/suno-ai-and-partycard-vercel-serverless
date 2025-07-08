
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { GeneratedJsonSchema } from "../../types/party-card/generate-card";
import { handleCorsOption } from "../../utils/handle-cors-options";
import { victoriaExampleCard } from "../../data/party-card/victoria-example-card";


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
