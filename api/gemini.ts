// api/gemini.ts
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, config } = req.body;
  
  // This variable is SECURE because it's only on the server
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: config
    });
    
    const response = await result.response;
    return res.status(200).json({ text: response.text() });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}