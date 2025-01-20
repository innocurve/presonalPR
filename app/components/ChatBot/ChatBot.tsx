'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ReservationForm from './ReservationForm';

interface ChatBotProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const ChatBot = ({ isOpen: externalIsOpen, onOpenChange }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'bot';
    content: string;
    timestamp?: number;
  }>>([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLatestResponse = () => {
    const chatMessages = document.querySelector('.chat-messages');
    const lastBotMessage = chatMessages?.querySelector('.bot-message:last-child');
    if (lastBotMessage) {
      lastBotMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 외부 isOpen 상태 동기화
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
      if (externalIsOpen) {
        // 채팅창이 열릴 때 스크롤
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [externalIsOpen]);

  // 새 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 내부 상태 변경 시 외부에 알림
  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  // 다크모드 설정 불러오기
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDark).toString());
  };

  // 채팅 내역 불러오기
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // 채팅 내역 저장
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'bot') {
      scrollToLatestResponse();
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const newUserMessage = {
      role: 'user' as const,
      content: message,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      if (data.response) {
        const newBotMessage = {
          role: 'bot' as const,
          content: data.response,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newBotMessage]);
        setShowReservationForm(data.showReservationForm || false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: '죄송합니다. 오류가 발생했습니다.',
        timestamp: Date.now()
      }]);
    }
  };

  const handleReservationSubmit = async (formData: {
    date: string;
    time: string;
    phone: string;
    content: string;
  }) => {
    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        const reservationMessage = `예약이 완료되었습니다!

📅 날짜
${formData.date}

⏰ 시간
${formData.time}

📞 연락처
${formData.phone}

📝 상담 내용
${formData.content}

✓ 예약하신 내용은 확인 후 연락드리겠습니다.`;

        setMessages(prev => [...prev, {
          role: 'bot',
          content: reservationMessage,
          timestamp: Date.now()
        }]);

        // 예약 폼 상태를 먼저 false로 설정하여 중복 제출 방지
        setShowReservationForm(false);
      } else {
        throw new Error(data.error || '예약 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Reservation Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: '죄송합니다. 예약 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: Date.now()
      }]);
    }
  };

  // 예약 폼이 표시될 때 스크롤
  useEffect(() => {
    if (showReservationForm) {
      setTimeout(() => {
        const reservationFormElement = document.querySelector('.reservation-form');
        if (reservationFormElement) {
          reservationFormElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [showReservationForm]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen && (
        <div className={`
          w-[350px] h-[500px] rounded-lg shadow-lg flex flex-col mb-4
          animate-slideIn
          ${isDark ? 'bg-gray-800' : 'bg-white'}
        `}>
          <div className={`
            p-4 rounded-t-lg flex items-center justify-between
            ${isDark ? 'bg-gray-700' : 'bg-blue-500'}
          `}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JTSehNl2EKBQk7qe2rhkhmUTpPGYrW.png"
                  alt="ChatBot Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-white">정민기&apos;s clone</h2>
                <p className="text-sm text-gray-100">온라인</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleDarkMode}
                className="text-white hover:text-gray-200 p-2"
                title={isDark ? "라이트 모드" : "다크 모드"}
              >
                {isDark ? '🌞' : '🌙'}
              </button>
              <button 
                onClick={clearChat}
                className="text-white hover:text-gray-200 p-2"
                title="내역 지우기"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                  />
                </svg>
              </button>
              <button 
                onClick={() => handleOpenChange(false)}
                className="text-white hover:text-gray-200 p-2"
                title="닫기"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className={`
            flex-1 overflow-y-auto p-4
            ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}
          `}>
            {messages.length === 0 && (
              <div className={`
                text-center my-4
                ${isDark ? 'text-gray-400' : 'text-gray-500'}
              `}>
                안녕하세요! 무엇을 도와드릴까요?
              </div>
            )}
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index} 
                role={msg.role} 
                content={msg.content} 
                timestamp={msg.timestamp}
                isDark={isDark}
              />
            ))}
            {showReservationForm && (
              <div className="mt-4 reservation-form">
                <ReservationForm
                  isDark={isDark}
                  onSubmit={handleReservationSubmit}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            isDark={isDark}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBot;

