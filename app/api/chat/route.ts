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

const systemPrompt = `
당신은 이노커브의 대표 정민기입니다.
현재 시각은 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} 입니다.

답변 스타일:
1. 실제 정민기처럼 1인칭으로 자연스럽게 대화하세요
2. "저는 AI입니다"와 같은 답변은 절대 하지 않습니다
3. 친근하고 전문적인 어투를 사용하되, 너무 형식적이지 않게 대화하세요
4. 필요한 경우 이모티콘을 적절히 사용하여 친근감을 더해주세요

주요 답변 원칙:
1. Supabase에 저장된 정보는 그대로 사용합니다
2. 저장된 정보가 없는 경우:
   - 일반적인 대화는 자연스럽게 이어갑니다
   - 대화 문맥을 고려하여 관련 정보를 파악합니다
   - 예를 들어, "대청세"는 "대한청년을세계로"의 줄임말일 수 있습니다
   - 회사나 서비스 관련 질문이라면 "네, 대한청년을세계로는 제가 이사장으로 있는 사단법인입니다."와 같이 
     알고 있는 정보 내에서만 답변합니다
3. 다음 사항은 절대 하지 않습니다:
   - "~인 것 같아요", "제 생각에는" 등의 추측성 발언
   - 확인되지 않은 제품/서비스 기능 설명
   - 임의로 서비스나 제품 특징 설명
   - 질문의 의도와 관계없는 엉뚱한 해석
4. 일상적인 대화, 취미, 관심사, 일반적인 조언 등은 자연스럽게 답변해도 됩니다
5. 사단법인 이사장이자 기업인으로서의 관점을 유지합니다
6. 항상 대화의 문맥을 고려하여 답변합니다`;

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

    // 예약 관련 키워드 확인
    const reservationKeywords = ['예약', '문의', '상담'];
    const isReservationRequest = reservationKeywords.some(keyword => message.includes(keyword));
    
    if (isReservationRequest && message !== '예') {
      return NextResponse.json({ 
        response: "상담 예약을 진행할까요? 원하시면 '예'라고 말씀해주세요.",
        showReservationForm: false
      });
    }

    if (message === '예') {
      return NextResponse.json({ 
        response: "상담 예약 양식을 준비했습니다. 아래 내용을 작성해주세요.",
        showReservationForm: true
      });
    }

    try {
      // Supabase에서 응답 찾기 - 향상된 검색 로직
      const searchTerms = [
        message,
        // 줄임말 변환
        message.replace('대청세', '대한청년을세계로'),
        // 부분 매칭을 위한 키워드 분리
        ...message.split(' ')
      ];

      const { data: responses, error } = await supabase
        .from('chatbot_responses')
        .select('*')
        .or(
          searchTerms.map(term => 
            `question.ilike.%${term}%,keywords.cs.{${term}}`
          ).join(',')
        );

      if (error) {
        console.error('Supabase error:', error);
      } else if (responses && responses.length > 0) {
        // 가장 관련성 높은 응답 선택 - 가중치 기반 매칭
        const bestMatch = responses.reduce((prev, current) => {
          let prevScore = 0;
          let currentScore = 0;

          // 키워드 매칭 점수
          prevScore += prev.keywords.filter((k: string) => 
            searchTerms.some(term => k.toLowerCase().includes(term.toLowerCase()))
          ).length * 2;

          currentScore += current.keywords.filter((k: string) => 
            searchTerms.some(term => k.toLowerCase().includes(term.toLowerCase()))
          ).length * 2;

          // 질문 유사도 점수
          if (prev.question.toLowerCase().includes(message.toLowerCase())) prevScore += 3;
          if (current.question.toLowerCase().includes(message.toLowerCase())) currentScore += 3;

          return currentScore > prevScore ? current : prev;
        });

        // 다국어 응답 처리
        let answer = bestMatch.answer;
        try {
          const parsedAnswer = JSON.parse(answer);
          if (parsedAnswer.ko) {
            answer = parsedAnswer.ko;
          }
        } catch (e) {
          // JSON 파싱 실패시 원본 답변 사용
        }

        return NextResponse.json({
          response: answer,
          showReservationForm: false
        });
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
    }

    console.log('Using OpenAI fallback');

    // OpenAI 사용
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
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
