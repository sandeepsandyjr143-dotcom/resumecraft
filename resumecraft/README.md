# ResumeCraft — AI Resume Builder
### Deploy in 20 minutes. Everything free.

---

## What's inside
gi
```
resumecraft/
├── backend/          ← Node.js + Express (deploy to Render)
└── frontend/         ← React + Vite (deploy to Vercel)
```

---

## Step 1 — Get your free API keys (10 minutes)

### 1A. Supabase (database)
1. Go to https://supabase.com → Sign up free
2. Click **New Project** → give it any name → set a password → **Create**
3. Wait 2 minutes for setup
4. Go to **Settings → Database**
5. Copy the **Connection string (URI)** — looks like:
   `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`
6. Replace `[YOUR-PASSWORD]` with the password you set

### 1B. OpenAI (AI features)
1. Go to https://platform.openai.com → Sign up
2. Go to **API Keys** → **Create new secret key** → copy it
3. Add ₹500 credit under **Billing** (that's all you need to start)
   - **We use gpt-4o-mini** — very cheap (~₹1 per 10 resumes built)

### 1C. Razorpay (payments)
1. Go to https://razorpay.com → Sign up free
2. Go to **Settings → API Keys → Generate Test Key**
3. Copy both **Key ID** (starts with `rzp_test_`) and **Key Secret**
4. For webhook secret: **Settings → Webhooks → Add Webhook**
   - URL: `https://your-backend.onrender.com/api/payments/webhook`
   - Copy the webhook secret shown

---

## Step 2 — Deploy Backend to Render (free)

1. Go to https://render.com → Sign up free
2. Click **New → Web Service**
3. Connect your GitHub repo (or upload the `backend` folder)
4. Settings:
   - **Name**: resumecraft-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Under **Environment Variables**, add all of these:

```
DATABASE_URL         = [your Supabase connection string]
JWT_SECRET           = [any random 32+ character string, e.g. mySecretKey123AbcXyz789!@#]
OPENAI_API_KEY       = sk-xxx
OPENAI_MODEL         = gpt-4o-mini
RAZORPAY_KEY_ID      = rzp_test_xxx
RAZORPAY_KEY_SECRET  = xxx
RAZORPAY_WEBHOOK_SECRET = xxx
FRONTEND_URL         = https://resumecraft.vercel.app   [fill after Vercel deploy]
NODE_ENV             = production
```

6. Click **Create Web Service** → wait 3-5 minutes
7. Copy your backend URL: `https://resumecraft-backend.onrender.com`

### Push DB schema (one-time)
After Render deploys, open the **Shell** tab in Render and run:
```
npx prisma db push
```
This creates all the database tables.

---

## Step 3 — Deploy Frontend to Vercel (free)

1. Go to https://vercel.com → Sign up free
2. Click **New Project** → import your repo (or drag the `frontend` folder)
3. **Root Directory**: frontend
4. Under **Environment Variables**, add:

```
VITE_API_URL           = https://resumecraft-backend.onrender.com
VITE_RAZORPAY_KEY_ID   = rzp_test_xxx
```

5. Click **Deploy** → wait 2 minutes
6. Copy your frontend URL: `https://resumecraft.vercel.app`

### Update backend FRONTEND_URL
Go back to Render → **Environment** → update `FRONTEND_URL` to your Vercel URL → **Save** → it redeploys automatically.

---

## Step 4 — Test it

1. Open your Vercel URL
2. Click **Get Started Free** → Register with any email
3. Try **Build Resume with AI** — paste some text
4. Check the ATS score
5. Try the **AI Coach** chat (3 free per day)

For payments, use Razorpay test card: `4111 1111 1111 1111`, any future date, any CVV.

---

## AI Chat Limits

- **3 free AI chats per day per user** — resets at midnight
- No chat history is stored (each chat is fresh) — keeps costs minimal
- Each chat uses ~2000 tokens max → very cheap on gpt-4o-mini

## Cost estimate (for 100 users/month)
- OpenAI: ~₹200–500/month (gpt-4o-mini is very cheap)
- Supabase: Free (up to 500MB, 2 projects)
- Render: Free (spins down after 15min idle — fine for early stage)
- Vercel: Free (unlimited for frontend)
- **Total: ~₹200–500/month to run**

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Fill in .env with your keys
npm install
npx prisma db push
npm run dev    # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm install
npm run dev    # runs on http://localhost:5173
```

---

## Files changed vs original project

| File | Change |
|------|--------|
| `backend/src/routes/ai.js` | Chat limit = 3/day. No history stored. All other AI unlimited. |
| `backend/src/routes/templates.js` | Real SVG previews — no placeholder images |
| `backend/src/services/openai.js` | Uses gpt-4o-mini (cheaper). Stateless chat (no history). |
| `frontend/src/components/Navbar.jsx` | ResumeCraft branding |
| `frontend/src/pages/Home.jsx` | ResumeCraft branding |
| `frontend/src/pages/Templates.jsx` | Shows real SVG template previews |
| `frontend/src/components/ChatAssistant/ChatAssistant.jsx` | 3/day limit shown. No chat list. Single reply view. |
| `frontend/src/pages/Builder.jsx` | Mobile preview toggle, ResumeCraft branding |
