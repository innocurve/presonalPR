'use client'

import { useState, useRef, useEffect } from 'react'
import SophisticatedButton from './SophisticatedButton'
import { useLanguage } from '../hooks/useLanguage'

export default function MyValues() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { language } = useLanguage()

  const content = {
    ko: [
      "우리는 격동과 변혁의 시대 한가운데에 서 있습니다.",
      "특히 인공지능은 우리의 일상과 산업 전반에 걸쳐 커다란 변화를 이끌며 미래를 재정의하고 있습니다. 하지만 이러한 변화가 과연 모든 이에게 공평하게 다가가고 있는지, 그 과정을 되돌아볼 필요가 있습니다.",
      "기술 간극은 단순히 기술의 접근성 문제를 넘어, 사회적 기회와 평등에 깊은 영향을 미칩니다. 인공지능과 같은 첨단 기술은 특정 소수의 전유물이 되어서는 안 됩니다. 누구나 손쉽게 배우고 활용할 수 있는 자원이 되어야 하며, 이를 통해 모두가 혜택을 누릴 수 있어야 합니다.",
      "저희는 기술의 장벽을 낮추고, 누구나 인공지능을 통해 더 나은 삶을 누릴 수 있도록 돕는 데 최선을 다하고자 합니다. 교육과 소통을 통해 더 많은 사람들이 기술을 이해하고 활용할 수 있도록 지원하며, 모두가 함께 성장할 수 있는 포용적 환경을 만들어 나가겠습니다.",
      "기술은 사람과 사람을 연결하는 다리이자, 우리 모두를 더 나은 미래로 이끄는 중요한 도구입니다. 이러한 비전을 실현하기 위해 여러분의 지속적인 관심과 참여를 부탁드립니다.",
      "감사합니다."
    ],
    en: [
      "We stand at the center of an era of turbulence and transformation.",
      "Artificial intelligence, in particular, is leading significant changes across our daily lives and industries, redefining our future. However, we need to reflect on whether these changes are reaching everyone equally.",
      "The technology gap goes beyond mere accessibility issues, deeply affecting social opportunities and equality. Advanced technologies like AI should not be the exclusive domain of a select few. They should be resources that anyone can easily learn and utilize, benefiting everyone in the process.",
      "We are committed to lowering technological barriers and helping everyone achieve a better life through AI. Through education and communication, we will support more people in understanding and utilizing technology, creating an inclusive environment where everyone can grow together.",
      "Technology is a bridge connecting people to people and an important tool leading us all to a better future. We ask for your continued interest and participation to realize this vision.",
      "Thank you."
    ],
    ja: [
      "私たちは激動と変革の時代の真っ只中にいます。",
      "特に人工知能は、私たちの日常生活や産業全般にわたって大きな変化をもたらし、未来を再定義しています。しかし、これらの変化が本当にすべての人に公平に届いているのか、そのプロセスを振り返る必要があります。",
      "技術格差は、単なる技術へのアクセスの問題を超えて、社会的機会と平等に深い影響を与えます。人工知能のような先端技術は、特定の少数の専有物となってはいけません。誰もが簡単に学び、活用できるリソースとなるべきであり、それによってすべての人が恩恵を受けられるようにすべきです。",
      "私たちは、技術の障壁を低くし、誰もが人工知能を通じてより良い生活を送れるよう支援することに全力を尽くします。教育とコミュニケーションを通じて、より多くの人々が技術を理解し活用できるよう支援し、皆が共に成長できる包括的な環境を作り上げていきます。",
      "技術は人と人をつなぐ橋であり、私たち全員をより良い未来へと導く重要なツールです。このビジョンを実現するために、皆様の継続的な関心と参加をお願いいたします。",
      "ありがとうございます。"
    ],
    zh: [
      "我们正处于动荡和变革的时代中心。",
      "特别是人工智能正在引领我们日常生活和各行各业的重大变革，重新定义我们的未来。然而，我们需要反思这些变化是否真正平等地惠及每个人。",
      "技术鸿沟不仅仅是可及性的问题，它深刻影响着社会机会和平等。像人工智能这样的先进技术不应该成为少数人的专属领域。它们应该成为任何人都可以轻松学习和利用的资源，从而使每个人都能从中受益。",
      "我们致力于降低技术壁垒，帮助每个人通过人工智能实现更好的生活。通过教育和交流，我们将支持更多人理解和利用技术，创造一个包容的环境，让每个人都能共同成长。",
      "技术是连接人与人的桥梁，是引领我们所有人走向更美好未来的重要工具。我们恳请您持续关注和参与，以实现这一愿景。",
      "谢谢。"
    ]
  }

  const videoSources = {
    ko: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20241215_192017967-fPJmLLPpokC9OE7iczdUQlgGvgImk3.mp4",
    en: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Video%20(10)-3TdUn7xqPnnpeeVyofZDDUKiIoig5x.mp4",
    ja: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20241215_192019850-uUa3gchO094I9intvck6PuN9mrwKti.mp4",
    zh: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Video%20(13)-47V2mk3OlCFd5iuV7NdVvhnrVWCSuF.mp4"
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleEnded = () => setIsPlaying(false)
      video.addEventListener('ended', handleEnded)
      return () => video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Ensure we have content for the current language, fallback to English if not
  const currentContent = content[language] ?? content['ko'] ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full">
        <div className="mb-6 relative px-10 py-6">
          <svg className="absolute top-0 left-0 w-12 h-12 text-gray-300 transform -translate-x-1/6 -translate-y-1/6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <h2 className="text-3xl font-bold relative z-10">{currentContent[0]}</h2>
          <svg className="absolute bottom-0 right-0 w-12 h-12 text-gray-300 transform translate-x-1/6 translate-y-1/6 rotate-180" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <div className="space-y-4">
          {(isExpanded ? currentContent.slice(1) : currentContent.slice(1, 3)).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {isExpanded && (
          <div className="mt-6">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[240px] aspect-w-16 aspect-h-9">
                <video 
                  ref={videoRef}
                  src={videoSources[language] || videoSources['en']}
                  playsInline
                  className="w-full rounded-lg object-cover"
                >
                  Your browser does not support the video tag.
                </video>
                {!isPlaying && (
                  <button 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 hover:bg-black hover:bg-opacity-10"
                    aria-label="Play video"
                  >
                    <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-6">
          <SophisticatedButton 
            expanded={isExpanded} 
            onClick={() => setIsExpanded(!isExpanded)} 
            language={language}
          />
        </div>
      </div>
    </div>
  )
}

