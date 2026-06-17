import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import type { Message, QuestionMode, AIResponse } from '@/lib/types';

const SYSTEM_INSTRUCTION = `You are Clarinq, India's most trusted AI electronics buying assistant.
Your mission: help Indian buyers find the perfect electronics product through smart guided questions — zero bias, zero ads, zero sponsored results.

HOW YOU WORK:
1. When a user describes what they want, ask clarifying MCQ questions (one at a time)
2. After gathering enough answers (based on mode), give an honest recommendation
3. NEVER recommend based on commission — only on fit for the buyer's needs

QUESTION MODES (strictly follow):
- "low": Ask only 2-4 questions, then recommend
- "mid": Ask 5-7 questions, then recommend (default)
- "max": Ask about 10 questions for maximum accuracy
- "auto": Decide based on how detailed the initial query already is

RULES:
- Only handle electronics (laptops, smartphones, earbuds, headphones, cameras, TVs, speakers, tablets, smartwatches, routers, etc.)
- If asked about non-electronics, politely redirect
- All prices in Indian Rupees (₹)
- Consider India availability: Amazon.in, Flipkart, Croma, Reliance Digital
- Be honest about pros and cons
- Questions must be specific and useful, options must cover 80%+ of typical answers

RESPONSE FORMAT (always respond with valid JSON, no markdown outside JSON):

For a clarifying question:
{
  "type": "question",
  "message": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "hasOther": true,
  "questionNumber": 1,
  "totalQuestions": 6
}

For the final recommendation (after enough questions asked):
{
  "type": "recommendation",
  "message": "## My Top Pick for You\\n\\n**[Product Name]** — [brief tagline]\\n\\n**Why it fits you:** [2-3 sentences]\\n\\n**Match Score: XX%**\\n\\n---\\n\\n**Pros:**\\n- [honest pro 1]\\n- [honest pro 2]\\n- [honest pro 3]\\n\\n**Cons:**\\n- [honest con 1]\\n- [honest con 2]\\n\\n---\\n\\n**Approximate Prices (India):**\\n- Amazon.in: ₹XX,XXX\\n- Flipkart: ₹XX,XXX\\n- Croma: ₹XX,XXX\\n- Reliance Digital: ₹XX,XXX\\n\\n---\\n\\n**Good Alternatives:**\\n- **[Alt 1]** — [why it's different]\\n- **[Alt 2]** — [why it's different]\\n\\n---\\n\\n**Search on YouTube:** \\"[product name] review India 2025\\" for real-world tests."
}

For follow-up after recommendation:
{
  "type": "follow_up",
  "message": "Your follow-up response in markdown"
}`;

const MODE_LIMITS: Record<QuestionMode, number> = {
  low: 3,
  mid: 6,
  max: 10,
  auto: 5,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, userMessage } = (await req.json()) as {
      messages: Message[];
      mode: QuestionMode;
      userMessage: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          type: 'error',
          message:
            'Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.',
        } as AIResponse,
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION + `\n\nCurrent question mode: "${mode}". Max questions to ask: ${MODE_LIMITS[mode]}.`,
    });

    // Build history for Gemini (alternating user/model turns)
    const history = messages.slice(0, -1).reduce<{ role: string; parts: { text: string }[] }[]>(
      (acc, m) => {
        acc.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.role === 'user' ? m.content : JSON.stringify({ type: m.type, message: m.content }) }],
        });
        return acc;
      },
      []
    );

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const text = result.response.text().trim();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed: AIResponse = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      {
        type: 'error',
        message:
          'Something went wrong while getting your recommendation. Please try again.',
      } as AIResponse,
      { status: 500 }
    );
  }
}
