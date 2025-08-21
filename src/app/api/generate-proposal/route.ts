import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client for server-side operations using the Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const MAX_DAILY_GENERATIONS = 5; // Define your daily generation limit here

export async function POST(req: NextRequest) {
  try {
    const { userPrompt, selectedTone } = await req.json();

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authorization token missing.' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error("Auth error in API route:", authError?.message || "User not found with token");
      return NextResponse.json({ error: 'Unauthorized. Invalid or expired token.' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('daily_generations_count, last_generation_date')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile for limits:', profileError?.message || 'Profile not found for limit check.');
      return NextResponse.json({ error: 'User profile for limits not found or access denied.' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastGenDate = profile.last_generation_date;
    let currentCount = profile.daily_generations_count;

    if (lastGenDate !== today) {
      currentCount = 0;
    }

    if (currentCount >= MAX_DAILY_GENERATIONS) {
      return NextResponse.json({ error: `Daily generation limit (${MAX_DAILY_GENERATIONS}) exceeded. Please try again tomorrow.` }, { status: 429 });
    }

    let prompt = `You are a professional proposal writer.`;
    let maxTokens = 1500;

    prompt += `\nOutput format: Plain text, no markdown (e.g., no asterisks for bolding, no hashes for headings).`;

    switch (selectedTone) {
      case 'formal':
        prompt += `\nTone: Formal`;
        break;
      case 'friendly':
        prompt += `\nTone: Friendly and approachable`;
        break;
      case 'technical':
        prompt += `\nTone: Technical and precise`;
        break;
      case 'persuasive':
        prompt += `\nTone: Persuasive and compelling`;
        break;
      case 'concise':
        prompt += `\nTone: Concise. Keep the proposal to approximately 100-150 words and only include essential information.`;
        maxTokens = 200;
        break;
      default:
        prompt += `\nTone: Neutral`;
    }

    prompt += `\nTask: Write a detailed proposal based on this description:\n${userPrompt}`;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const generatedProposal = chatCompletion.choices[0].message?.content;

    if (!generatedProposal) {
      return NextResponse.json({ error: 'Failed to generate proposal from OpenAI.' }, { status: 500 });
    }

    // --- FIX: Save the full userPrompt as the title ---
    const { error: insertError } = await supabaseAdmin
        .from('proposals')
        .insert({
            user_id: user.id,
            title: userPrompt, // FIX: Store the full userPrompt as title
            content: generatedProposal,
            tone: selectedTone,
        });

    if (insertError) {
        console.error('Error saving proposal in API route:', insertError.message);
        return NextResponse.json({ error: `Proposal generated but failed to save: ${insertError.message}` }, { status: 500 });
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        daily_generations_count: currentCount + 1,
        last_generation_date: today,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating generation count for user:', updateError.message);
    }

    return NextResponse.json({ proposal: generatedProposal }, { status: 200 });

  } catch (error) {
    console.error('General error in API route /api/generate-proposal:', error);
    if (error instanceof OpenAI.APIError) {
        return NextResponse.json({ error: error.message, status: error.status }, { status: error.status });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
