rretoriq-backend-api (vercel-api)

This folder contains simple Vercel serverless functions used as secure proxies to OpenAI (chat/completions and Whisper) and Google Gemini.

Required environment variables (set in Vercel Dashboard / CLI):
- OPENAI_KEY: OpenAI API key used for chat/completions and Whisper transcriptions.
- GEMINI_KEY: Google API key for the Gemini (Generative) endpoint.
- ALLOWED_ORIGINS: Comma-separated list of allowed origins, e.g. `https://rretoriq25.web.app`.

Deployment notes:
- Vercel will install dependencies from `package.json`. Ensure `package.json` is present in the project root (it is in this repo).
- After pushing to the remote, import this repo in Vercel (or run `vercel --prod`) and set the env vars in Project Settings.
- The API functions live under `/api/*`, for example `/api/health`.

CORS and security:
- The functions check `ALLOWED_ORIGINS` and will set `Access-Control-Allow-Origin` accordingly. If empty, all origins are allowed.
- Do NOT commit API keys to the repo. Use Vercel Environment Variables or a Secret Manager.

Testing:
- After deployment, call `https://<your-vercel-app>.vercel.app/api/health` to verify a healthy response.
