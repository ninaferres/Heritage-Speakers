# Local Testing Guide

Since this remote environment has network restrictions blocking api.elevenlabs.io, you should test locally on your machine where you have full network access.

## Prerequisites

Before starting, make sure you have:
- Node.js 18+ installed
- All required API keys in `backend/.env` (see `backend/.env.example`)

## Running locally

### Terminal 1: Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✓ Server running at http://localhost:8787
✓ CORS enabled for http://localhost:5173
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

## Testing TTS (Audio Generation)

### Quick Test Script (Backend)

In the backend terminal, while the server is running, you can verify ElevenLabs configuration:

```bash
node test-elevenlabs.js
```

Expected output if configured correctly:
```
✓ es-ES works
✓ es-MX works
✓ es-AR works
✓ es-CO works
✓ ru-RU works
✓ ru-Moscow works
```

### Manual Testing (UI)

1. Go to http://localhost:5173
2. Sign up or log in
3. Select "Aprender Ruso" (Learn Russian) from the language selector
4. Click on a Listening exercise (any CEFR level)
5. Click "Play audio" button
6. Listen to confirm you hear Russian audio (not Spanish)

Try a Spanish listening exercise too:
1. Select "Aprender Español" (Learn Spanish)
2. Click on a Listening exercise
3. Click "Play audio" and verify Spanish audio with proper accent

## Troubleshooting

### Audio Generation Fails

Check the error message in the UI. Common causes:

1. **Backend not running**: Make sure Terminal 1 shows "Server running at..."
2. **API keys missing**: Check `backend/.env` has all required keys
3. **ElevenLabs unreachable**: Run `node test-elevenlabs.js` to verify network access

### Network Errors

If `test-elevenlabs.js` shows 403 errors, it means your local machine might also have network restrictions. Contact your network admin to allowlist `api.elevenlabs.io`.

## Important Notes

- The frontend's dev proxy at http://localhost:5173 automatically forwards `/api/*` requests to http://localhost:8787
- Never commit `.env` files containing API keys (they're in `.gitignore`)
- The backend must be running for the frontend to work (TTS, evaluation, etc.)
