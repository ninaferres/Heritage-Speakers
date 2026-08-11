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
   - `GROQ_API_KEY` → your Groq key (default `AI_PROVIDER` is `groq`; leave blank if you
     don't have one yet — grading will just return "not configured" until you add it).
     **Important**: this must go in the `GROQ_API_KEY` field specifically, not
     `ANTHROPIC_API_KEY` — the app reads whichever key matches `AI_PROVIDER`, so a Groq
     key stored under the wrong variable name is silently ignored.
   - `ANTHROPIC_API_KEY` → only needed if you set `AI_PROVIDER=anthropic` instead of `groq`
   - `OPENAI_API_KEY` → optional. Speaking transcription (Whisper) uses your `GROQ_API_KEY`
     for free if it's set; `OPENAI_API_KEY` is only used as a fallback (and costs money —
     OpenAI's Whisper API is pay-as-you-go, unlike Groq's free tier)
   - `GOOGLE_TTS_API_KEY` → needed for Listening audio. Get one for free from
     [Google Cloud Console](https://console.cloud.google.com/apis/credentials): create a
     project, enable the "Cloud Text-to-Speech API", then create an API key restricted to
     that API. Google's free tier covers a generous monthly character quota; you won't be
     charged unless you exceed it (a card is required to create the Cloud project, but
     nothing is billed while under the free quota).
   - `GOOGLE_TTS_VOICE_ES` / `_MX` / `_AR` / `_CO` / `_RU` / `_RU_MOSCOW` → optional, only
     needed if you want to override the built-in default voice names. Defaults use Google's
     Neural2/Wavenet tier (`es-ES-Neural2-A`, `es-US-Neural2-A` for the Latin American accents,
     `ru-RU-Wavenet-A`/`-D` for Russian) — these are real per-locale voice models, so Peninsular
     Spanish actually sounds Peninsular instead of borrowing a Latin American accent (which is
     what happens with Chirp3-HD's named voices, since those are the same voice reused across
     locales). Google doesn't offer distinct per-country Latin American Spanish voices the way
     the previous provider did, so MX/AR/CO share one generic voice unless you find and set
     region-specific ones yourself from the
     [voice list](https://cloud.google.com/text-to-speech/docs/voices).
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
- **Needs `GROQ_API_KEY` / `ANTHROPIC_API_KEY` / `OPENAI_API_KEY`** (matching `AI_PROVIDER`):
  Writing/Reading/Listening/Speaking grading. Without it, submitting an exercise shows
  a clear "AI grading is not configured yet" message instead of crashing.
- **Needs `GROQ_API_KEY` (free) or `OPENAI_API_KEY` (paid)**: Speaking transcription
  (Whisper). Groq is used automatically when set, since it's free; OpenAI is only used
  as a fallback if no Groq key is present.
- **Needs `GOOGLE_TTS_API_KEY`** (free tier): Listening audio generation.

You can deploy now with just the Supabase keys and add the AI/audio keys to
Render's environment variables whenever you get them — no redeploy of code
required, just a service restart (Render does this automatically when you save
new env vars).
