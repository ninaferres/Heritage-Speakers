# 🚀 Heritage Speakers - Setup Guide

## ⚙️ Configuración Necesaria

### 1. Variables de Entorno del Backend

Crea/actualiza `backend/.env`:

```bash
# Supabase (para autenticación)
SUPABASE_URL=https://gaxowrspsgxwsfkolhqc.supabase.co
SUPABASE_ANON_KEY=sb_publishable_n1TRQViCS4VB436HQ4IJqg_o5NR0vZd

# AI Provider (para evaluación de ejercicios)
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-70b-versatile

# OpenAI (para transcripción de audio - Whisper STT)
OPENAI_API_KEY=your-openai-api-key

# ElevenLabs (para síntesis de voz de calidad - TTS)
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ES=voice-id-spanish
ELEVENLABS_VOICE_MX=voice-id-mexican
ELEVENLABS_VOICE_AR=voice-id-argentinian
ELEVENLABS_VOICE_CO=voice-id-colombian
ELEVENLABS_VOICE_RU=voice-id-russian
ELEVENLABS_VOICE_RU_MOSCOW=voice-id-russian-moscow

# Server
PORT=8787
CORS_ORIGIN=http://localhost:5173
```

### 2. Variables de Entorno del Frontend

`frontend/.env` está bien configurado. Solo asegúrate de que sea:

```bash
VITE_SUPABASE_URL=https://gaxowrspsgxwsfkolhqc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_n1TRQViCS4VB436HQ4IJqg_o5NR0vZd
VITE_API_BASE_URL=/api
```

## 🔧 Desarrollo Local

### Paso 1: Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Paso 2: Ejecutar Backend

```bash
cd backend
npm run dev
```

El backend estará en: `http://localhost:8787`

### Paso 3: Ejecutar Frontend (en otra terminal)

```bash
cd frontend
npm run dev
```

El frontend estará en: `http://localhost:5173`

El proxy de Vite enviará todas las requests a `/api` al backend en `localhost:8787`.

## 🚀 Producción (Railway)

### Backend en Railway

1. Conecta tu repo a Railway
2. Asegúrate de que `.env` tenga las variables correctas
3. El `Procfile` ejecutará: `node dist/index.js`

### Frontend en Vercel/Railway

Cambia `frontend/.env` para producción:

```bash
# Si el backend está en Railway:
VITE_API_BASE_URL=https://tu-backend-railway-url.up.railway.app/api
```

## 🔍 Troubleshooting

### Error "Request to /evaluate/reading failed (404)"

**Causa**: El backend no está corriendo o no es accesible.

**Solución**:
1. Asegúrate de que el backend esté corriendo: `npm run dev` en la carpeta `backend/`
2. Verifica que las variables de entorno estén configuradas
3. Comprueba que no hay firewall bloqueando `localhost:8787`

### Audios en español cuando deberían ser en ruso

**Causa**: El backend no tiene las voces de ElevenLabs para ruso configuradas.

**Solución**:
1. Configura `ELEVENLABS_VOICE_RU` y `ELEVENLABS_VOICE_RU_MOSCOW` en `backend/.env`
2. Obtén los voice IDs de: https://api.elevenlabs.io/v1/voices
3. Reinicia el backend: `npm run dev`

### CORS Error

**Causa**: El `CORS_ORIGIN` en backend no coincide con la URL del frontend.

**Solución**:
- Local: `CORS_ORIGIN=http://localhost:5173`
- Producción: `CORS_ORIGIN=https://tu-frontend-url.com`

## 📝 Notas

- Las rutas de evaluación (`/evaluate/*`) requieren autenticación via Supabase
- Las rutas de TTS (`/tts`) también requieren autenticación
- El frontend usa Vite Dev Proxy en desarrollo, por eso `/api` funciona

## 🎯 Verificar Setup

Visita: `http://localhost:8787/api/health`

Deberías ver:
```json
{
  "ok": true,
  "auth": true,
  "grading": true,
  "stt": true,
  "tts": true
}
```

Si `tts: false`, configura `ELEVENLABS_API_KEY`.
Si `stt: false`, configura `OPENAI_API_KEY`.
