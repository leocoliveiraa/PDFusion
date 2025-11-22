**Overview**: small app to extract text from a PDF and summarize it via the Groq API. This repo contains a static frontend in `public/` and a Vercel Serverless Function at `api/upload.ts`.

**Quick deploy (Vercel)**

- Create a Vercel project and point it to this repository.
- In Vercel dashboard add an Environment Variable `GROQ_API_KEY` (your Groq API key).
- The default build will run `vercel-build` (configured to run `tsc`) and deploy static files from `public/` and serverless functions from `api/`.

**Local development**

- Install deps: `npm install`
- Run the express dev server (serves `public/` and `/upload` as in `src/server.ts`):

```
npm run dev
```

- Open http://localhost:3000

**Notes & Production considerations**

- Client sends base64 JSON payload to `/api/upload` to simplify serverless parsing.
- Max file size enforced client & server: 10 MB. Adjust as needed for your plan.
- Serverless functions have time and memory limits on Vercel — large PDFs may fail. For heavy usage consider using a dedicated server or queueing processing jobs.
- Keep `GROQ_API_KEY` secret and do not hardcode.

If you'd like, I can: add automatic tests, add queueing (Redis/RabbitMQ), or migrate the serverless function to a smaller memory footprint. Which should I do next?

# 📄 PDFSum - Resumidor de PDF com IA

Aplicação web que extrai e resume PDFs automaticamente usando IA (Groq API).

## ✨ Funcionalidades

- 📤 Upload de arquivos PDF
- 🤖 Resumo automático com IA
- 📊 5 tópicos principais
- 💡 5 insights importantes
- ⚡ Processamento rápido e gratuito

## 🚀 Tecnologias

- **Backend:** Node.js + Express + TypeScript
- **IA:** Groq API (Llama 3.3)
- **PDF:** pdfjs-dist
- **Frontend:** HTML + CSS + JavaScript

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/pdfsum.git

# Entre na pasta
cd pdfsum

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua GROQ_API_KEY
```

## 🔑 Configuração

1. Crie uma conta gratuita em: https://console.groq.com
2. Gere uma API Key
3. Adicione no arquivo `.env`:

```env
GROQ_API_KEY=sua_chave_aqui
```

## ▶️ Como usar

```bash
# Modo desenvolvimento
npx ts-node server.ts

# Acesse
http://localhost:3000
```

## 📸 Screenshot

![PDF Summarizer](https://via.placeholder.com/800x400?text=PDF+Summarizer)

## 📄 Licença

MIT

## 👤 Autor

Leonardo Oliveira
