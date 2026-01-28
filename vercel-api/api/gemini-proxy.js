export default async function handler(req, res) {
  // ✅ Allow cross-origin requests from your frontend
 res.setHeader("Access-Control-Allow-Origin", "*"); // for testing, later replace with your domain
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

// Handle preflight
if (req.method === "OPTIONS") {
  return res.status(200).end();
}

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
  // Frontend sends: { model: 'gemini-2.0-flash', input: '<prompt>' }
  // OR: { prompt: '<prompt>', fileData: { data: 'base64', mimeType: 'application/pdf' } }
  const { model = 'gemini-pro', input, prompt, fileData } = req.body;
  const actualInput = input || prompt; // Support both field names
  
  console.log("🧠 Incoming Gemini Request:", { 
    model, 
    inputLength: actualInput?.length,
    hasFileData: !!fileData 
  });

  if (!actualInput) {
    return res.status(400).json({ error: "Missing 'input' or 'prompt' in request body" });
  }

  if (!process.env.GEMINI_API_KEY)  {
    console.error("❌ Gemini API key not found");
    return res.status(500).json({ error: "Gemini API key not configured." });
  }

console.log("process.env.GEMINI_API_KEY", process.env.GEMINI_API_KEY)

  // Map common model names to actual v1beta model names
  // Gemini 2.0 Flash models use different naming in v1beta
  // Try: gemini-2.0-flash-exp (experimental version available in v1beta)
  const modelMapping = {
    'gemini-2.0-flash': 'gemini-2.0-flash-exp',
    'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
    'gemini-1.5-flash': 'gemini-2.0-flash-exp',
    'gemini-1.5-pro': 'gemini-2.0-flash-exp',
    'gemini-pro': 'gemini-2.0-flash-exp'
  };
  
  const geminiModel = modelMapping[model] || 'gemini-2.0-flash-exp';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  // Build parts array - include text and optionally file data
  const parts = [{ text: actualInput }];
  
  // Add file data if provided (for resume parsing)
  if (fileData && fileData.data && fileData.mimeType) {
    parts.push({
      inline_data: {
        mime_type: fileData.mimeType,
        data: fileData.data
      }
    });
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: parts
      }
    ]
  };

  console.log("📡 Sending payload to Gemini:", {
    model: geminiModel,
    partsCount: parts.length,
    hasFileData: parts.length > 1
  });

  const geminiResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await geminiResponse.text();
  console.log("🔍 Gemini Raw Response:", raw.substring(0, 500)); // Log first 500 chars

  if (!geminiResponse.ok) {
    console.error("❌ Gemini API error response:", raw);
    return res.status(geminiResponse.status).json({ error: `Gemini API error: ${raw}` });
  }

  const data = JSON.parse(raw);
  console.log("✅ Gemini Response received:", { 
    hasCandidates: !!data.candidates, 
    candidatesCount: data.candidates?.length 
  });
  
  // Extract text from response for easier consumption
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Return both the raw response and extracted text
  return res.status(200).json({
    ...data,
    text: text,
    response: text // Alias for compatibility
  });

  } catch (error) {
    console.error("❌ Gemini Proxy Crash:", error);
    return res
      .status(500)
      .json({ error: error.message || "Gemini Proxy internal error" });
  }
}