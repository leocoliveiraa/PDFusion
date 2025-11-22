import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: "No file data provided" });

    const buffer = Buffer.from(data, "base64");

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (buffer.length > MAX_SIZE)
      return res.status(413).json({ error: "File too large" });

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
      .promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n\n";
    }

    if (!text.trim())
      return res.status(400).json({ error: "PDF contains no text" });

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey)
      return res.status(500).json({ error: "Missing GROQ_API_KEY" });

    const prompt = `Resuma este PDF em: 1 resumo geral (10 linhas), 5 tópicos principais e 5 insights:\n\n${text}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    const dataResp = await response.json();
    if (!response.ok)
      return res
        .status(502)
        .json({ error: dataResp.error || "Groq API error" });

    const summary =
      dataResp.choices?.[0]?.message?.content ||
      dataResp.result ||
      JSON.stringify(dataResp);

    return res.status(200).json({ summary });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
