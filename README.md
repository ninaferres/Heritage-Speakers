# Heritage Speakers

Spanish learning platform for heritage speakers, with independent CEFR (A1–C2) tracks
for Speaking, Reading, Listening and Writing, gated behind free registration during
the beta phase.

## Architecture

```
frontend/   React + Vite SPA. Preserves the original visual design (wine/gold/bone
            palette, Fraunces/Outfit/Poppins type, bridge logo marks) from the
            prototype, rebuilt as componentized, maintainable code.
backend/    Node + Express API. Holds all third-party API keys server-side and
            exposes auth-gated endpoints for AI grading, speech-to-text and
            text-to-speech. The frontend never talks to Anthropic/OpenAI/
            ElevenLabs directly.
```

### Why a backend at all

Real user accounts and calls to paid AI/audio APIs can't happen safely from the
browser (that would leak API keys to anyone who opens devtools). Auth is handled by
Supabase (email/password + Google OAuth); the Express backend verifies each
request's Supabase session token and then calls the AI/audio providers using keys
that only ever live on the server.

### Gating & redirect-after-login flow

`ExerciseGateContext` (`frontend/src/context/ExerciseGateContext.tsx`) intercepts
every "try this exercise" click. If the visitor isn't signed in, it stores the
clicked skill+level in `sessionStorage` (`usePendingExercise.ts`) and opens the
auth modal instead. On successful sign-in — including the full-page redirect
Google OAuth requires — it reads that pending exercise back out and opens the
exercise runner for exactly what the user originally clicked.

### Multi-language architecture

The header's language selector (`frontend/src/i18n/languages.ts`) controls which
learning-language track the whole app is scoped to. Spanish (`es`) is the only
`active` track today; Chinese/Mandarin (`zh`) is listed as `coming-soon` so it's
visible in the UI without being selectable. To light up a new language later:

1. Add an `exercises.<code>.ts` file under `frontend/src/data/` with the same
   `"<LEVEL>-<Skill>"` keying as `exercises.es.ts`.
2. Wire it into `getExerciseBank()` in that same folder.
3. Flip its `status` to `active` in `languages.ts`.
4. Add its accent list to `data/accents.ts` if it needs TTS variants.

No other frontend code needs to change — `LevelsSection` and `ExerciseRunner`
already read everything through the language context.

### AI evaluation pipeline

All four skills are graded by the backend (`backend/src/services/grading.ts`)
using structured, schema-constrained output rather than free-text parsing, to
avoid hallucinated errors:

- **Anthropic** (default, `AI_PROVIDER=anthropic`): forced tool-use call whose
  `input_schema` matches the grading schema exactly.
- **OpenAI** (`AI_PROVIDER=openai`): `response_format: { type: 'json_schema', strict: true }`.

Both run at `temperature 0.15` (within the required 0.1–0.2 band) and share one
system-prompt rule set (`backend/src/prompts/systemPrompts.ts`) that instructs the
model to only report errors it's certain about, quote the exact original
fragment, and explain the specific linguistic rule involved (subjunctive vs.
indicative, ser/estar, preposition choice, agreement, false friends, etc.).

- **Writing**: full grammatical/syntactic/orthographic breakdown + native-level reformulation.
- **Speaking**: the recording is transcribed by OpenAI Whisper first, then graded
  the same way as Writing, plus a pronunciation/accent/stress notes field.
- **Reading / Listening**: open-response comprehension answers graded against the
  source passage/transcript, with per-question feedback and a model answer.

### Listening audio

The old prototype linked to third-party mp3 files that no longer resolve. Listening
exercises now store a transcript script instead of an audio URL; the runner calls
`POST /api/tts` on demand, which synthesizes it through ElevenLabs
(`eleven_multilingual_v2`) in the learner's choice of four regional Spanish accents
(Peninsular, Mexican, Argentine, Colombian) — nothing to go stale.

### Network requirements

The backend makes outbound HTTPS requests to:
- `api.elevenlabs.io` for text-to-speech (listening exercises + assessment intro)
- `api.openai.com` for speech-to-text transcription and optionally AI grading
- `api.anthropic.com` for AI grading (if using Anthropic as the provider)

If you're running in a restricted network environment (VPN, corporate firewall, or
cloud provider with egress policy), you may need to allowlist these hosts. See
`TTS_TROUBLESHOOTING.md` for diagnostic steps and solutions.

## Setup

### 1. Supabase (auth)

Create a free project at [supabase.com](https://supabase.com), enable the Google
OAuth provider under Authentication → Providers if you want "Continue with
Google" to work, and copy:

- Project URL → `SUPABASE_URL` (backend) / `VITE_SUPABASE_URL` (frontend)
- `anon` public key → `SUPABASE_ANON_KEY` (backend) / `VITE_SUPABASE_ANON_KEY` (frontend)

### 2. AI grading

Get an API key from [Anthropic](https://console.anthropic.com/) (default provider)
or [OpenAI](https://platform.openai.com/) and set `ANTHROPIC_API_KEY` or
`OPENAI_API_KEY` + `AI_PROVIDER=openai` in `backend/.env`.

### 3. Speech-to-text (Speaking)

Uses OpenAI Whisper — set `OPENAI_API_KEY` (same key works for grading if you
choose the OpenAI provider, or add it alongside Anthropic for grading + Whisper
for STT).

### 4. Text-to-speech (Listening)

Create an [ElevenLabs](https://elevenlabs.io/) account, pick/clone one voice per
regional accent, and set `ELEVENLABS_API_KEY` plus `ELEVENLABS_VOICE_ES` /
`_MX` / `_AR` / `_CO` to those voice IDs.

### Running locally

```bash
# Backend
cd backend
cp .env.example .env   # fill in the keys above
npm install
npm run dev             # http://localhost:8787

# Frontend (separate terminal)
cd frontend
cp .env.example .env    # fill in Supabase URL/anon key
npm install
npm run dev              # http://localhost:5173, proxies /api to the backend
```

Every AI/audio route degrades gracefully (returns a clear `503` with an
explanatory message) when its keys aren't configured yet, instead of crashing —
so the app is fully explorable (landing page, auth gate, exercise UI) before any
paid API keys are wired up.

## Known residual issue

`npm audit` flags a moderate, dev-server-only vulnerability in the Vite 5 /
esbuild dev server (arbitrary origins can query the dev server while it's
running locally). It does not affect the production build. Fixing it fully
requires a major-version Vite upgrade (6/8), which was left out of this pass to
avoid destabilizing the build; revisit when convenient.
