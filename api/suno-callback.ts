import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCorsOption } from '../utils/handle-cors-options';

export default async function handler(req: VercelRequest, res: VercelResponse) {

await handleCorsOption(req, res);

  try {
    const data = req.body;

    if (data.audio_url) {
      console.log("LINK:", data.audio_url);
    }

    return res.status(200).json({ message: 'Callback received', data });
  } catch (err) {
    console.error("❌ Something go wrong:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
