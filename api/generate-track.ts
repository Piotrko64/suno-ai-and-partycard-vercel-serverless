import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  const CALLBACK_URL = process.env.SUNO_CALLBACK_URL;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }


  if (!CALLBACK_URL) {
    return res.status(500).json({ error: "Callback URL not configured in env." });
  }

  const {
    prompt,
    style,
    title,
    instrumental = true,
    model = "V3_5",
    negativeTags = "Heavy Metal, Upbeat Drums",
    token
  } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing token in request." });
  }

  try {
    const response = await fetch("https://apibox.erweima.ai/api/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        prompt,
        style,
        title,
        customMode: true,
        instrumental,
        model,
        negativeTags,
        callBackUrl: CALLBACK_URL
      })
    });

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ Something go wrong:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
