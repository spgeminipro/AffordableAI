import { NextRequest, NextResponse } from 'next/server';
import { enhancePrompt } from '@/lib/enhancePrompt';
import { estimateTokens } from '@/lib/tokens';
import * as OpenAIProv from '@/lib/providers/openai';
import * as AnthropicProv from '@/lib/providers/anthropic';
import * as GoogleProv from '@/lib/providers/google';

const MAP:any = {
  'openai:gpt-4o-mini': OpenAIProv.chat,
  'anthropic:claude-3-5-sonnet': AnthropicProv.chat,
  'google:gemini-1.5-pro': GoogleProv.chat,
};

export async function POST(req: NextRequest){
  const { messages, models, enhance } = await req.json();
  const userText = messages?.[messages.length-1]?.content ?? '';
  const finalPrompt = enhance ? await enhancePrompt(userText) : userText;

  const tasks = (models as string[]).map(async (id) => {
    const fn = MAP[id];
    if (!fn) return [id, { error: 'Unsupported model' }];
    const t0 = Date.now();
    try {
      const out = await fn(finalPrompt);
      const dt = (Date.now()-t0)/1000;
      return [id, { output: out.text, latency: dt, tokens: estimateTokens(out.text) }];
    } catch (e:any) {
      return [id, { error: e?.message || 'Failed' }];
    }
  });

  const entries = await Promise.all(tasks);
  const responses = Object.fromEntries(entries);
  const used = Object.values(responses).reduce((s:any, r:any)=> s + (('tokens' in (r as any)? (r as any).tokens : 0)), 0);

  return NextResponse.json({ prompt: finalPrompt, responses, used });
}
