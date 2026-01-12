import { GoogleGenAI } from "@google/genai";

// Vercel Serverless Function using Web Standard Request/Response
export default async function handler(req: Request) {
  // 1. Only allow POST requests for security
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST requests allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 2. Parse the JSON data sent from your frontend
    const { prompt, config } = await req.json();
    
    // 3. Initialize Gemini using the SECURE server-side key
    // This key is never sent to the user's browser
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Call the Gemini API
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: config
    });

    const responseText = await result.response.text();
    
    // 5. Send the result back to your frontend
    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}