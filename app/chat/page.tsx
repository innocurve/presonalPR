'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Moon, Sun, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../hooks/useLanguage'
import { translate } from '../utils/translations'
import ChatInput, { Message } from '../components/ChatBot/ChatInput'
import ChatMessage from '../components/ChatBot/ChatMessage'
import Navigation from '../components/Navigation'

const initialMessages = {
  ko: "안녕하세요! 저는 정민기's Clone입니다. 무엇을 도와드릴까요?",
  en: "Hello! I'm Minki Jeong's Clone. How can I help you?",
  ja: "こんにちは！鄭玟基のクローンです。どのようにお手伝いできますか？",
  zh: "你好！我是郑玟基的克隆。我能为您做些什么？"
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      if (parsedMessages.length > 0) {
        setMessages(parsedMessages)
      } else {
        setMessages([{
          role: 'assistant',
          content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
        }])
      }
    } else {
      setMessages([{
        role: 'assistant',
        content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
      }])
    }
  }, [language])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          language,
          previousMessages: messages
        })
      });

      if (!response.ok) {
        throw new Error(translate('apiError', language));
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = { 
        role: 'assistant', 
        content: data.response 
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: translate(
          error instanceof Error ? error.message : 'chatError',
          language
        )
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const clearMessages = () => {
    setMessages([{
      role: 'assistant',
      content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
    }])
    localStorage.removeItem('chatMessages')
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/innocurve-logo-Yx0QZGtTGVhGHQUFVTxQtXVuYWBqrE.png"
                alt="InnocurveLogo"
                width={120}
                height={30}
                priority
              />
            </Link>
            <Navigation language={language} />
          </div>
        </div>
      </div>

      <div className={`max-w-3xl mx-auto shadow-sm min-h-[calc(100vh-80px)] ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <header className={`flex items-center px-4 py-3 border-b ${
          isDarkMode ? 'border-gray-700' : ''
        }`}>
          <div className="flex items-center gap-2">
            <Link href="/" className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } flex items-center gap-2`}>
              <ArrowLeft className="w-5 h-5" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Back</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 relative rounded-full overflow-hidden mb-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JTSehNl2EKBQk7qe2rhkhmUTpPGYrW.png"
                alt={translate('name', language)}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-medium">{translate('name', language)}{translate('cloneTitle', language)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={clearMessages}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 h-[calc(100vh-280px)]">
          {messages.length === 0 ? (
            <div className={`flex items-center justify-center h-full`}>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} isDarkMode={isDarkMode} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <footer className={`border-t p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <ChatInput onSendMessage={handleSendMessage} isDarkMode={isDarkMode} placeholder={translate('chatInputPlaceholder', language)} />
        </footer>
      </div>
    </div>
  )
} 