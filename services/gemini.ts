// services/gemini.ts
export async function aiFixMenuData(data: any[][]): Promise<any[][]> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt: "Your menu architect prompt here...", 
      config: { responseMimeType: "application/json" } 
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return JSON.parse(result.text);
}