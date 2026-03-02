# Deployment Guide

> How to run the Intrusive Thought Externalizer on your own machine or deploy it to the cloud.

---

## 🖥️ Local Development

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | ≥ 18.18 | `node -v` |
| npm | ≥ 9 | `npm -v` |
| HuggingFace Token | Free tier | [Get one here](https://huggingface.co/settings/tokens) |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/intrusive-thought-externalizer.git
cd intrusive-thought-externalizer

# 2. Install dependencies
npm install

# 3. Create environment file
echo "HF_TOKEN=hf_your_token_here" > .env.local

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it.

---

## ☁️ Deploy to Vercel (Recommended)

The fastest path to a live demo URL.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/intrusive-thought-externalizer.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Framework Preset** will auto-detect as **Next.js**
4. Add environment variable:

   | Key | Value |
   |-----|-------|
   | `HF_TOKEN` | `hf_your_token_here` |

5. Click **Deploy**

Your app will be live at `https://your-project.vercel.app` within ~60 seconds.

---

## 🐳 Docker (Alternative)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t thought-externalizer .
docker run -p 3000:3000 -e HF_TOKEN=hf_xxx thought-externalizer
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_TOKEN` | ✅ | HuggingFace API token ([get one free](https://huggingface.co/settings/tokens)) |

> **Note:** All AI models used (`Llama-3.2-3B-Instruct`, `FLUX.1-schnell`) are available on HuggingFace's free inference tier. No paid API keys are needed.

---

## 🛡️ Security Notes

- `.env.local` is gitignored and never committed
- The HF token is only used server-side in Next.js Server Actions
- No user data is ever sent to or stored on any server
- All persistent data lives in the user's browser (IndexedDB)

---

## 📋 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

The production build will be output to `.next/`. The app is fully static-capable for the frontend, with Server Actions handling AI API calls.
