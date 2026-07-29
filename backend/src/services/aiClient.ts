import { env, isGradingConfigured } from '../env.js';

const GRADING_TEMPERATURE = 0.15; // low temperature per spec: 0.1-0.2, minimizes hallucinated errors

interface StructuredRequest {
  system: string;
  user: string;
  schema: object;
  schemaName: string;
}

export class GradingNotConfiguredError extends Error {
  constructor() {
    super('AI grading is not configured on the server yet (missing ANTHROPIC_API_KEY / OPENAI_API_KEY).');
    this.name = 'GradingNotConfiguredError';
  }
}

export async function generateStructuredJSON<T>(req: StructuredRequest): Promise<T> {
  if (!isGradingConfigured) throw new GradingNotConfiguredError();
  return env.aiProvider === 'anthropic' ? callAnthropic<T>(req) : callOpenAI<T>(req);
}

async function callAnthropic<T>({ system, user, schema, schemaName }: StructuredRequest): Promise<T> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.anthropicApiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: env.anthropicModel,
      max_tokens: 2048,
      temperature: GRADING_TEMPERATURE,
      system,
      messages: [{ role: 'user', content: user }],
      tools: [{ name: schemaName, description: `Return the ${schemaName} result.`, input_schema: schema }],
      tool_choice: { type: 'tool', name: schemaName },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic grading request failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { content: Array<{ type: string; input?: unknown }> };
  const toolUse = data.content.find((block) => block.type === 'tool_use');
  if (!toolUse?.input) throw new Error('Anthropic response did not include a structured tool result.');
  return toolUse.input as T;
}

async function callOpenAI<T>({ system, user, schema, schemaName }: StructuredRequest): Promise<T> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openaiModel,
      temperature: GRADING_TEMPERATURE,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: schemaName, schema, strict: true },
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenAI grading request failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  const raw = data.choices[0]?.message?.content;
  if (!raw) throw new Error('OpenAI response did not include structured content.');
  return JSON.parse(raw) as T;
}
