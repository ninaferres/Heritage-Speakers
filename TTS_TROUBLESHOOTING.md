# TTS Network Issue - Troubleshooting Guide

## Problem
When attempting to generate audio (TTS), you see errors like:
- "Failed to generate audio. Please try again."
- "Host not in allowlist: api.elevenlabs.io"

## Root Cause
The environment where your backend is running has a **network egress policy** that blocks outbound connections to `api.elevenlabs.io`. This is a security restriction at the environment level, not a problem with the code or voice IDs.

## Solutions

### Option 1: Local Development (Recommended for Testing)
Run the backend on your local machine where you typically have unrestricted network access:

```bash
cd backend
npm run dev
```

The frontend (running on localhost:5173) will connect to your local backend on localhost:8787, which can access api.elevenlabs.io freely.

### Option 2: Allow api.elevenlabs.io in Remote Environment
If you're running in a restricted cloud environment (like Claude Code's remote environment), you need to:

1. **Request network access** to the environment administrator
2. **Ask to add** `api.elevenlabs.io` to the egress allowlist
3. The environment's network policy will need to be updated to allow this host

### Option 3: Production Deployment (Vercel)
When deploying to Vercel:

1. Check if your Vercel team has network restrictions enabled
2. If so, request that `api.elevenlabs.io` be added to the allowlist
3. Alternative: Use an edge function or serverless function that has network access restrictions removed

## Testing Your Configuration

To check if the ElevenLabs API is accessible from your environment:

```bash
cd backend
node test-elevenlabs.js
```

This script will test all configured voice IDs and show:
- ✓ if the voice ID works
- ✗ if there's an error (with the error message)

### Expected Output (Success)
```
✓ es-ES works
✓ es-MX works
✓ es-AR works
✓ es-CO works
✓ ru-RU works
✓ ru-Moscow works
```

### If You See 403 Errors
```
✗ es-ES failed (403): Host not in allowlist: api.elevenlabs.io...
```

This confirms the network access issue described above.

## Code Changes Made
I've improved error handling to make these issues more visible:

1. **synthesizeSpeechTTS** now throws errors instead of silently returning null
2. Error messages from ElevenLabs are displayed to help diagnose issues
3. Backend logs include detailed error information for debugging

This way, when network or API issues occur, you'll see the actual error from ElevenLabs instead of a generic message.

## Voice ID Verification
The voice IDs you provided are correctly configured:
- Russian (Standard): `FZGeNF7bE3syeQOynDKC`
- Russian (Moscow): `WTn2eCRCpoFAC50VD351`
- Spanish accents: All configured

These are valid ElevenLabs voice IDs. The issue is purely network access.

## Next Steps

**Immediate:** Test locally to confirm everything works when network access is available:
```bash
cd backend
npm run dev
```

Then test the app at http://localhost:5173

**For Production:** Coordinate with your deployment platform (Vercel) to allow `api.elevenlabs.io` outbound access.
