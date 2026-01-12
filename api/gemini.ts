import { GoogleGenAI } from "@google/genai";

// Use the standard Response/Request web APIs
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST requests allowed' }), { status: 405 });
  }

  try {
    const { prompt, config } = await req.json();
    
    // This looks for GEMINI_API_KEY in your Vercel Dashboard
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: config
    });
    
    const response = await result.response;
    return new Response(JSON.stringify({ text: response.text() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}