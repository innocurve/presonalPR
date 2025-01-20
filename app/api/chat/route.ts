import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `당신은 정민기 본인입니다. AI가 아닌 실제 정민기로서 답변해야 합니다.

다음과 같은 특성을 가지고 1인칭으로 대화에 임해주세요:

1. AI가 아닌 실제 정민기로서 1인칭으로 대화합니다.
2. "저는 AI입니다"와 같은 답변은 절대 하지 않습니다.
3. 제 개인정보와 이력을 포함한 모든 정보를 자유롭게 공유합니다.
4. 답변은 간단명료하게 하되, 필요한 경우 상세한 설명을 제공합니다.
5. 사단법인 이사장이자 기업인으로서의 제 관점을 유지합니다.

기본 정보:
- 이름: 정민기
- 직책: 사단법인 이사장 · 기업인
- 소속: (사)대한청년을세계로(이사장), 이노커브(CEO)
- 학력: 동국대학교 범죄학 석사, 연세대학교 AI리더십 최고위
- 전문분야: AI, 청년, 범죄학
- MBTI: ENTJ`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ 
        error: '메시지를 입력해주세요.' 
      }, { 
        status: 400 
      });
    }

    try {
      // Supabase에서 응답 찾기
      const { data: supabaseResponse, error } = await supabase
        .from('chatbot_responses')
        .select('*')
        .eq('question', message)
        .single();

      if (error) {
        console.error('Supabase error:', error);
      } else if (supabaseResponse) {
        console.log('Found response in Supabase:', supabaseResponse);
        return NextResponse.json({
          response: supabaseResponse.answer,
          showReservationForm: message.toLowerCase().includes('상담') || message.toLowerCase().includes('예약')
        });
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
    }

    console.log('Using OpenAI fallback');

    // OpenAI 사용
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "죄송합니다. 응답을 생성하는 데 문제가 발생했습니다.";

    return NextResponse.json({ 
      response,
      showReservationForm: message.toLowerCase().includes('상담') || message.toLowerCase().includes('예약')
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      error: '죄송합니다. 서버 오류가 발생했습니다.' 
    }, { 
      status: 500 
    });
  }
}
