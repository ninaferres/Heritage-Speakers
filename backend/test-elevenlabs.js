#!/usr/bin/env node
import 'dotenv/config';

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_IDS = {
  'es-ES': process.env.ELEVENLABS_VOICE_ES,
  'es-MX': process.env.ELEVENLABS_VOICE_MX,
  'es-AR': process.env.ELEVENLABS_VOICE_AR,
  'es-CO': process.env.ELEVENLABS_VOICE_CO,
  'ru-RU': process.env.ELEVENLABS_VOICE_RU,
  'ru-Moscow': process.env.ELEVENLABS_VOICE_RU_MOSCOW,
};

console.log('🔍 ElevenLabs Configuration Test\n');
console.log('API Key configured:', API_KEY ? '✓' : '✗');
console.log('Available voice IDs:');
Object.entries(VOICE_IDS).forEach(([accent, voiceId]) => {
  console.log(`  ${accent}: ${voiceId ? '✓ ' + voiceId : '✗ Not set'}`);
});

if (!API_KEY) {
  console.error('\n❌ ELEVENLABS_API_KEY not configured');
  process.exit(1);
}

async function testVoice(accent, voiceId) {
  if (!voiceId) {
    console.log(`  ⚠️  No voice ID for ${accent}`);
    return;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'audio/mpeg',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text: `Testing ${accent} voice.`,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.45, similarity_boost: 0.8 },
      }),
    });

    if (response.ok) {
      console.log(`  ✓ ${accent} works`);
    } else {
      const detail = await response.text();
      console.log(`  ✗ ${accent} failed (${response.status}): ${detail}`);
    }
  } catch (err) {
    console.log(`  ✗ ${accent} error: ${err.message}`);
  }
}

async function runTests() {
  console.log('\n🧪 Testing voice IDs:\n');
  for (const [accent, voiceId] of Object.entries(VOICE_IDS)) {
    await testVoice(accent, voiceId);
  }
}

runTests();
