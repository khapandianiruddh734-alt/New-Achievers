import { apiTracker } from "./apiTracker";

/**
 * HELPER: Unified function to call your secure Vercel API
 */
async function callGeminiApi(prompt: string, config: any = {}) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      config 
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result.text;
}

export async function aiFixMenuData(data: any[][]): Promise<any[][]> {
  const startTime = Date.now();
  const modelName = 'gemini-3-flash-preview';
  const prompt = `Enterprise Restaurant Menu Architect transformation for data: ${JSON.stringify(data)}`;

  try {
    const textResponse = await callGeminiApi(prompt, { responseMimeType: "application/json" });
    const result = JSON.parse(textResponse || "[]");
    
    apiTracker.logRequest({
      tool: 'AI Menu Fixer', model: modelName, status: 'success',
      latency: Date.now() - startTime, fileCount: 1, fileFormats: ['xlsx']
    });
    
    return result;
  } catch (e: any) {
    apiTracker.logRequest({
      tool: 'AI Menu Fixer', model: modelName, status: 'error',
      latency: Date.now() - startTime, fileCount: 1, fileFormats: ['xlsx'],
      errorMessage: e.message
    });
    throw e;
  }
}

export async function aiExtractToExcel(base64Data: string, mimeType: string): Promise<any[][]> {
  const startTime = Date.now();
  const modelName = 'gemini-3-flash-preview';
  const ext = mimeType.split('/').pop() || 'unknown';

  try {
    // Sending the image data and instructions to your backend
    const prompt = `Extract tabular JSON data from this file. MimeType: ${mimeType}`;
    const textResponse = await callGeminiApi(prompt, { responseMimeType: "application/json" });

    const result = JSON.parse(textResponse || "[[]]");
    apiTracker.logRequest({
      tool: 'AI OCR', model: modelName, status: 'success',
      latency: Date.now() - startTime, fileCount: 1, fileFormats: [ext]
    });
    
    return result;
  } catch (e: any) {
    apiTracker.logRequest({
      tool: 'AI OCR', model: modelName, status: 'error',
      latency: Date.now() - startTime, fileCount: 1, fileFormats: [ext],
      errorMessage: e.message
    });
    throw e;
  }
}

export async function aiSummarizeDoc(text: string): Promise<string> {
  const startTime = Date.now();
  const modelName = 'gemini-3-flash-preview';

  try {
    const prompt = `Summarize the following text:\n${text.substring(0, 15000)}`;
    const textResponse = await callGeminiApi(prompt);

    apiTracker.logRequest({
      tool: 'AI Summarizer', model: modelName, status: 'success',
      latency: Date.now() - startTime, fileCount: 1, fileFormats: ['pdf']
    });
    
    return textResponse || "No summary.";
  } catch (e: any) {
    apiTracker.logRequest({
      tool: 'AI Summarizer', model: modelName, status: 'error',
      latency: Date.now() - startTime, fileCount: 1, fileFormats: ['pdf'],
      errorMessage: e.message
    });
    throw e;
  }
}