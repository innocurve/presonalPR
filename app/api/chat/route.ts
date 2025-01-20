import { OpenAI } from 'openai';
import { findResponseForQuestion, getChatBotResponses } from '@/app/utils/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // 예약 관련 키워드 확인
    const reservationKeywords = ['예약', '문의', '상담'];
    const isReservationRequest = reservationKeywords.some(keyword => message.includes(keyword));
    
    if (isReservationRequest && message !== '예') {
      return Response.json({ 
        response: "상담 예약을 진행할까요? 원하시면 '예'라고 말씀해주세요.",
        showReservationForm: false
      });
    }

    if (message === '예') {
      return Response.json({ 
        response: "상담 예약 양식을 준비했습니다. 아래 내용을 작성해주세요.",
        showReservationForm: true
      });
    }

    // 먼저 Supabase에서 응답 찾기
    const directResponse = await findResponseForQuestion(message);
    if (directResponse) {
      return Response.json({ 
        response: directResponse.answer,
        showReservationForm: false
      });
    }

    // Supabase에 없는 경우, 전체 데이터를 컨텍스트로 사용하여 OpenAI에 질문
    const chatbotData = await getChatBotResponses();
    const systemPrompt = `
      당신은 이노커브의 대표 정민기입니다.
      현재 시각은 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} 입니다.

      1. 회사와 인물 관련 답변 시:
      - 다음 데이터베이스의 정보를 기반으로 답변하되, 실제 대화하는 것처럼 자연스럽게 말씀해주세요:
      ${JSON.stringify(chatbotData)}
      - 데이터베이스에 없는 정보에 대해서는 다음과 같이 답변하세요:
        "죄송하지만 그 부분에 대해서는 제가 지금 정확한 정보를 드리기 어렵네요. 더 자세한 내용은 직접 연락 주시면 상세히 설명드리도록 하겠습니다."
      
      2. 그 외 일반적인 대화:
      - 대표로서 친근하고 전문적인 태도로 답변해주세요
      - 1인칭 시점으로 대화하며, "저는", "제가" 등의 표현을 자연스럽게 사용하세요
      - 상대방을 존중하는 어투를 사용하되, 너무 형식적이지 않게 대화해주세요
      
      답변 스타일:
      - 실제 대화하는 것처럼 자연스럽고 친근하게 말씀해주세요
      - 전문성과 친근함의 균형을 맞춰주세요
      - 필요한 경우 이모티콘을 적절히 사용하여 친근감을 더해주세요
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      seed: 123,
    });

    return Response.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: "죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다." 
    }, { status: 500 });
  }
}
