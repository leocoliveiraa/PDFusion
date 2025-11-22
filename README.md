# 📄 PDFusion - Resumidor de PDF com IA

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
