Deploying backend to Vercel (serverless functions)

Files added (vercel-api/api):
- openai-proxy.js   (POST JSON -> forwards to OpenAI chat completions)
- gemini-proxy.js   (POST JSON -> forwards to Google Generative / Gemini)
- whisper-proxy.js  (POST multipart/base64 -> forwards to OpenAI Whisper)
- health.js         (GET / -> { ok: true })

How to deploy to Vercel (fast, free tier)

1. Create a Vercel account and install Vercel CLI (optional):
   - https://vercel.com/
   - npm i -g vercel

2. From your project root, deploy the vercel-api folder:
   - Option A: Deploy the whole project and Vercel will pick up `vercel-api/api` as serverless functions at /api/*
     - In repo root run:
       vercel --prod

   - Option B: Deploy just the vercel-api folder:
     - cd vercel-api
     - vercel --prod

3. Set environment variables in Vercel Dashboard (very important):
   - OPENAI_KEY = <your openai key>
   - GEMINI_KEY = <your gemini key>

   In the Project -> Settings -> Environment Variables

4. After deploy, your endpoints will be available at:
   - https://<your-vercel-app>.vercel.app/api/openai-proxy
   - https://<your-vercel-app>.vercel.app/api/gemini-proxy
   - https://<your-vercel-app>.vercel.app/api/whisper-proxy
   - https://<your-vercel-app>.vercel.app/api/health

5. Update your frontend to point to the Vercel API URL and rebuild/deploy hosting:
   - Set `VITE_API_PROXY_BASE=https://<your-vercel-app>.vercel.app/api` in your frontend environment (.env.production or CI vars)
   - Rebuild frontend:
     npm run build
   - Deploy frontend hosting (Firebase hosting already set up):
     firebase deploy --only hosting

Notes
- Whisper endpoint expects base64 `file` field by default in this simple implementation. If you want to upload binary files from the browser, we can adjust to use Busboy/multer in the server and a different upload approach.
- For production, enable authentication on API calls (Firebase ID token or other) or add CORS allowed origins. Vercel lets you add logic to verify tokens.

Want me to:
- Convert `whisper-proxy.js` to accept binary multipart uploads (multer/busboy) so the browser can post the File directly.
- Add client-side helper to convert File to base64 and call the Vercel whisper endpoint.
- Create a small Vercel project config (vercel.json) for tidy routing and constraints.
