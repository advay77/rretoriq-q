Firebase Functions proxy example and deploy guide

Files added:
- functions/index.js  (Express-based proxy, exported as `api`)
- functions/package.json
- firebase.json (hosting rewrite example to map /api/** to the function)

Quick overview
- The function exposes:
  - POST /openai-proxy  -> forwards JSON payload to OpenAI Chat Completions API using server-side key
  - POST /gemini-proxy  -> example forward to Google Generative API (Gemini) using API key
  - GET /health         -> simple health check

Setup & deploy (Firebase CLI)
1. Install firebase tools and login:

   npm install -g firebase-tools
   firebase login

2. Initialize functions in your project (if you haven't already). From the repo root run:

   firebase init functions hosting

   - Select JavaScript for functions (or TypeScript if you prefer; adjust files accordingly)
   - When asked about installing dependencies, say yes

3. Copy the `functions` folder files into your project's `functions` directory (already added here).

4. Install dependencies in the functions folder:

   cd functions
   npm install

5. Configure your API keys and allowed origins. There are two common ways:

   A) Using functions config (classic):

   firebase functions:config:set openai.key="sk-..." gemini.key="YOUR_GEMINI_KEY" app.allowed_origins="https://yourdomain.com,https://www.yourdomain.com"

   B) Using environment variables via Google Cloud (or .env for local emulation):

   export OPENAI_KEY="sk-..."
   export GEMINI_KEY="..."
   export ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

   Note: For production, prefer using Firebase functions config or Secret Manager for secrets.

6. Deploy functions and hosting (if you use hosting):

   firebase deploy --only functions

   If you also want to deploy the frontend build to Firebase Hosting and have rewrites to /api:

   firebase deploy --only hosting,functions

How to call from the frontend
- If you host frontend on Firebase Hosting with the rewrite above, you can call relative endpoints:

  fetch('/api/openai-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Hello' }] })
  })

- If the function is at a different domain (e.g. https://us-central1-yourproject.cloudfunctions.net/api), call that full URL.

Domain change & CORS notes
- If you change the frontend domain later, update the allowed origins in your function config:

  firebase functions:config:set app.allowed_origins="https://newdomain.com"
  firebase deploy --only functions

- Since the API keys are stored server-side, changing frontend domain does not require rotating the keys. However, if you restricted API keys at the provider (OpenAI/GCP) by HTTP referrers, update those restrictions accordingly.

Security notes & recommendations
- Prefer storing secrets in Firebase/Google Secret Manager and referencing them in functions. Avoid embedding secrets in source or frontend.
- Rate-limit and log suspicious requests in the function to reduce abuse.
- Use authenticated endpoints if possible so only your frontend (or logged-in users) can call expensive endpoints.

If you want, I can:
- Convert the function to TypeScript (if you prefer functions in TS).
- Add Secret Manager integration to fetch API keys at runtime.
- Update one of your frontend services (e.g. `src/services/openAIAnalysisService.ts`) to call the new proxy and verify locally.

CI / GitHub Actions
-------------------
I added a GitHub Actions workflow at `.github/workflows/firebase-deploy.yml` that:

- Builds the frontend (`npm run build`)
- Installs functions deps
- Runs `firebase deploy --only hosting,functions` using `FIREBASE_TOKEN` and `FIREBASE_PROJECT_ID` secrets

To use it:

1. Create a CI token:

    - Run `firebase login:ci` locally and copy the token.
    - In GitHub repo settings -> Secrets -> Actions, add `FIREBASE_TOKEN` with the token value.
    - Add `FIREBASE_PROJECT_ID` as the Firebase project id string.

2. Push to `main` and the workflow will deploy automatically.

Optional: Require Firebase Auth for proxy endpoints
-------------------------------------------------
The functions include an optional auth middleware. To enable it set:

   firebase functions:config:set app.require_auth="true"
   firebase deploy --only functions

When enabled, client requests must include a Firebase ID token in the `Authorization: Bearer <idToken>` header. The function verifies the token with `admin.auth().verifyIdToken` and populates `req.user` with the decoded token.
