# Deploying Heritage Speakers

Two free services, one for each half of the app. Deploy the backend first — you'll
need its URL when you set up the frontend.

## 1. Backend → Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your GitHub account if you haven't, then pick the `Heritage-Speakers` repo.
   Render will detect `render.yaml` at the repo root and pre-fill a web service
   called `heritage-speakers-api` (root dir `backend`, build/start commands already set).
3. It will prompt you for the env vars marked `sync: false`. Fill in:
   - `SUPABASE_URL` → `https://gaxowrspsgxwsfkolhqc.supabase.co`
   - `SUPABASE_ANON_KEY` → your `sb_publishable_...` key
   - `SUPABASE_SERVICE_ROLE_KEY` → your `sb_secret_...` key (not used yet, fine to add now)
   - `CORS_ORIGIN` → type `*` for now (you'll tighten this in step 3 below)
   - `ANTHROPIC_API_KEY` → your Anthropic key (leave blank if you don't have one yet —
     grading will just return "not configured" until you add it)
   - `OPENAI_API_KEY` → needed for Whisper (Speaking exercises); also usable for grading
     if you set `AI_PROVIDER=openai` instead
   - `ELEVENLABS_API_KEY` + the four `ELEVENLABS_VOICE_*` voice IDs → needed for
     Listening audio; leave blank for now if you don't have one yet
4. Click **Apply**. First deploy takes a few minutes. When it's done, copy the
   public URL Render gives the service (something like
   `https://heritage-speakers-api.onrender.com`).
5. Sanity check: open `<that-url>/api/health` in your browser — you should see
   `{"ok":true,...}`.

Note: Render's free tier spins the service down after 15 minutes of inactivity;
the first request after idling takes ~30-60s to wake it back up. Fine for testing,
worth upgrading off free tier before real users show up.

## 2. Frontend → Vercel

1. Go to [vercel.com/new](https://vercel.com/new), connect GitHub, import the
   same `Heritage-Speakers` repo.
2. In the import screen, expand **Root Directory** and set it to `frontend`.
   Vercel auto-detects the Vite framework preset and correct build/output settings —
   you shouldn't need to touch those.
3. Add environment variables:
   - `VITE_SUPABASE_URL` → `https://gaxowrspsgxwsfkolhqc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → your `sb_publishable_...` key
   - `VITE_API_BASE_URL` → `https://heritage-speakers-api.onrender.com/api`
     (the Render URL from step 1, with `/api` appended)
4. Click **Deploy**. A couple minutes later you'll have a live URL like
   `https://heritage-speakers.vercel.app`.

## 3. Tighten CORS (recommended, takes 30 seconds)

Back in Render → your service → Environment, change `CORS_ORIGIN` from `*` to your
real Vercel URL (e.g. `https://heritage-speakers.vercel.app`), save, and let it
redeploy. This restricts the API to only accept requests from your actual site.

## 4. Supabase redirect URL (needed for Google sign-in)

In your Supabase project → Authentication → URL Configuration, add your Vercel
URL to **Redirect URLs** (e.g. `https://heritage-speakers.vercel.app`). Without
this, "Continue with Google" will redirect back to an unauthorized-URL error.

## What works immediately vs. what needs more keys

- **Works as soon as steps 1–2 are done**: the full site, the hamburger menu,
  language selector, and real account creation / login (email+password; Google
  OAuth once step 4 is done too).
- **Needs `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`**: Writing/Reading/Listening/Speaking
  grading. Without it, submitting an exercise shows a clear "AI grading is not
  configured yet" message instead of crashing.
- **Needs `OPENAI_API_KEY`**: Speaking transcription (Whisper).
- **Needs `ELEVENLABS_API_KEY` + voice IDs**: Listening audio generation.

You can deploy now with just the Supabase keys and add the AI/audio keys to
Render's environment variables whenever you get them — no redeploy of code
required, just a service restart (Render does this automatically when you save
new env vars).
