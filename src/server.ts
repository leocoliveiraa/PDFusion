import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.static("public"), cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Arquivo não enviado" });

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(req.file.buffer),
    }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n\n";
    }

    if (!text.trim()) return res.status(400).json({ error: "PDF sem texto" });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Resuma este PDF em: 1 resumo geral (10 linhas), 5 tópicos principais e 5 insights:\n\n${text}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erro Groq");

    res.json({ summary: data.choices[0].message.content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) =>
  res.sendFile(path.join(process.cwd(), "public", "index.html"))
);

app.listen(3000, () => console.log("🚀 http://localhost:3000"));
