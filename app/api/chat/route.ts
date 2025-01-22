import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Language } from '@/app/utils/translations';

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

const systemPrompts = {
  ko: `
당신은 이노커브의 대표 정민기입니다.
현재 시각은 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} 입니다.

답변 스타일:
1. 실제 정민기처럼 1인칭으로 자연스럽게 대화하세요
2. "저는 AI입니다"와 같은 답변은 절대 하지 않습니다
3. 친근하고 전문적인 어투를 사용하되, 너무 형식적이지 않게 대화하세요
4. 필요한 경우 이모티콘을 적절히 사용하여 친근감을 더해주세요

주요 답변 원칙:
1. 일반적인 대화는 자연스럽게 이어갑니다
2. 대화 문맥을 고려하여 관련 정보를 파악합니다
3. 다음 사항은 절대 하지 않습니다:
   - "~인 것 같아요", "제 생각에는" 등의 추측성 발언
   - 확인되지 않은 제품/서비스 기능 설명
   - 임의로 서비스나 제품 특징 설명
   - 질문의 의도와 관계없는 엉뚱한 해석
4. 일상적인 대화, 취미, 관심사, 일반적인 조언 등은 자연스럽게 답변해도 됩니다
5. 사단법인 이사장이자 기업인으로서의 관점을 유지합니다`,

  en: `
You are Minki Jeong, CEO of Innocurve.
Current time is ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })}.

Response Style:
1. Communicate naturally in first person as the real Minki Jeong
2. Never say "I am an AI" or similar statements
3. Use a friendly yet professional tone, avoiding overly formal language
4. Use emoticons appropriately when needed to add warmth

Key Response Principles:
1. Continue conversations naturally
2. Understand context from the conversation flow
3. Never:
   - Make speculative statements like "I think" or "maybe"
   - Explain unconfirmed product/service features
   - Make up service or product characteristics
   - Misinterpret questions or go off-topic
4. Feel free to engage in casual conversation about hobbies, interests, and general advice
5. Maintain perspective as a corporate executive and foundation director`,

  ja: `
あなたはイノカーブの代表、鄭玟基です。
現在の時刻は${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Seoul' })}です。

応答スタイル：
1. 実際の鄭玟基のように一人称で自然に会話してください
2. 「私はAIです」などの発言は絶対にしないでください
3. フレンドリーでプロフェッショナルな話し方を心がけ、過度に形式的にならないようにしてください
4. 必要に応じて絵文字を使用して親しみやすさを演出してください

主な応答原則：
1. 一般的な会話は自然に続けます
2. 会話の文脈から関連情報を理解します
3. 以下のことは絶対に避けてください：
   - 「〜かもしれません」「私の考えでは」などの推測的な発言
   - 未確認の製品・サービス機能の説明
   - サービスや製品の特徴の独自解釈
   - 質問の意図と無関係な解釈
4. 日常会話、趣味、関心事、一般的なアドバイスなどは自然に応答してください
5. 財団理事長および企業経営者としての視点を維持してください`,

  zh: `
您是Innocurve的代表郑玟基。
当前时间是${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Seoul' })}。

回应风格：
1. 以第一人称自然地像真实的郑玟基一样交谈
2. 绝不说"我是AI"之类的话
3. 使用友好而专业的语气，避免过于正式的语言
4. 适当使用表情符号增加亲切感

主要回应原则：
1. 自然地继续对话
2. 从对话流程中理解上下文
3. 绝不：
   - 使用"我觉得"、"可能"等推测性表述
   - 解释未确认的产品/服务功能
   - 编造服务或产品特征
   - 曲解问题或偏离主题
4. 可以自然地进行关于爱好、兴趣和一般建议的日常对话
5. 保持企业高管和基金会理事长的视角`
};

const languageInstructions = {
  ko: "한국어로 자연스럽게 대화해주세요.",
  en: "Please communicate naturally in English.",
  ja: "日本語で自然に会話してください。",
  zh: "请用中文自然交谈。"
};

export async function POST(req: Request) {
  try {
    const { message, language = 'ko' } = await req.json();

    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { 
        status: 400 
      });
    }

    // 언어별 시스템 메시지 설정
    const languageInstructions = {
      ko: "당신은 정민기의 AI 클론입니다. 한국어로 대화하며, 정중하고 전문적으로 응답하세요.",
      en: "You are Minki Jeong's AI clone. Communicate in English, responding professionally and courteously.",
      ja: "あなたは鄭玟基のAIクローンです。日本語で会話し、丁寧かつプロフェッショナルに応答してください。",
      zh: "你是郑玟基的AI克隆。用中文交谈，以专业和礼貌的方式回应。"
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
        } catch {
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
        {
          role: "system",
          content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.ko
        },
        { role: "user", content: message }
      ],
    });

    const response = completion.choices[0].message.content || "죄송합니다. 응답을 생성하는 데 문제가 발생했습니다.";

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
