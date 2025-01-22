'use client'

import Image from 'next/image'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MyValues from './components/MyValues'
import History from './components/Career'
import FadeInSection from './components/FadeInSection'
import { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from './components/LanguageToggle'
import AutoSlider from './components/AutoSlider'
import { useLanguage } from './hooks/useLanguage'
import { translate } from './utils/translations'
import ContactOptions from './components/ContactOptions'
import type { PostData } from './types/post'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
const [isMenuOpen, setIsMenuOpen] = useState(false)
const { language } = useLanguage();
const [posts, setPosts] = useState<PostData[]>([
  { 
    id: 1, 
    title: {
      ko: '(사)대한청년을세계로 미래전략포럼 개최',
      en: 'Future Strategy Forum held by Korean Youth to the World Association',
      ja: '(社)大韓青年を世界へ 未来戦略フォーラム開催',
      zh: '(社)韩国青年走向世界协会举办未来战略论坛',
    },
    date: '2024.12.3', 
    hit: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AF%B8%EB%9E%98%EC%A0%84%EB%9E%B5%ED%8F%AC%EB%9F%BC.jpg-lobjD33dLn9HHvFaqwYC57KhFIHDJb.jpeg',
    description: {
      ko: '기술혁신의 시대속에서 청년들의 미래를 위한 전략을 논의하는 포럼을 개최합니다.',
      en: 'Hosting a forum to discuss strategies for the future of youth in the era of technological innovation.',
      ja: '技術革新の時代における若者の未来のための戦略を議論するフォーラムを開催します。',
      zh: '举办论坛，讨论技术创新时代青年未来的战略。',
    }
  },
  { 
    id: 2, 
    title: {
      ko: '이노커브 InnoCard',
      en: 'Innocurve InnoCard',
      ja: 'イノカーブ InnoCard',
      zh: 'InnoCurve InnoCard',
    },
    date: '2024-03-01', 
    hit: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%A0%9C%EB%AA%A9%20%EC%97%86%EC%9D%8C%20(300%20x%20200%20px)-YqEdcEhhDJYNijbTp5DIM9uER4sZNS.png',
    description: {
      ko: '종이 명함을 넘어 자신만의 웹사이트로 나를 표현하고, 연결하며, 확장할 수 있는 AI 전자명함 서비스를 소개합니다. 당신의 이야기를 담고, 네트워크를 스마트하게 이어주는 디지털 공간을 만나보세요.',
      en: 'Introducing AI digital business cards that go beyond paper, allowing you to express, connect, and expand through your own website. Discover a digital space that holds your story and smartly connects your network.',
      ja: '紙の名刺を超え、自分だけのウェブサイトで自己表現、つながり、拡張できるAIデジタル名刺サービスをご紹介します。あなたのストーリーを込め、ネットワークをスマートにつなぐデジタル空間をご体験ください。',
      zh: '介绍一款超越纸质名片的AI电子名片服务，您可以通过自己的网站来表达、连接和扩展自己。探索一个承载您的故事并智能连接您的网络的数字空间。',
    }
  },
  { 
    id: 3, 
    title: {
      ko: '이노커브 AIConnect',
      en: 'Innocurve AIConnect',
      ja: 'イノカーブ AIConnect',
      zh: 'InnoCurve AIConnect',
    },
    date: '2024-02-15', 
    hit: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INNOCURVE-UEJ6P4SmjI6dvCbd6jXEsOFWMdMjqW.png',
    description: {
      ko: '기술 발전의 혜택을 누구나 누릴 수 있도록, 각 산업별 맞춤형 AI 컨설팅과 최적화된 솔루션을 제공합니다.',
      en: 'We provide customized AI consulting and optimized solutions for each industry to ensure everyone can enjoy the benefits of technological advancement.',
      ja: '技術発展の恩恵を誰もが享受できるよう、各産業別にカスタマイズされたAIコンサルティングと最適化されたソリューションを提供します。',
      zh: '我们为各个行业提供定制的AI咨询和优化的解决方案，以确保每个人都能享受到技术进步的益处。',
    }
  },
  { 
    id: 4, 
    title: {
      ko: '이노커브 마케팅',
      en: 'Innocurve Marketing',
      ja: 'イノカーブマーケティング',
      zh: 'InnoCurve营销',
    },
    date: '2024-01-10', 
    hit: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%A0%9C%EB%AA%A9%20%EC%97%86%EC%9D%8C%20(300%20x%20200%20px)%20(1)-NxaNNp6obIPVIlOTroVTYrMKQeS8Z2.png',
    description: {
      ko: 'AI를 활용한 홈페이지, 이미지, 영상 등 다양한 디지털 콘텐츠 제작을 통해 비용은 효율적으로 절감하고, 최상의 퀄리티로 효과적인 홍보를 지원합니다.',
      en: 'We support effective promotion with top quality while efficiently reducing costs through the production of various digital content such as AI-powered websites, images, and videos.',
      ja: 'AIを活用したホームページ、画像、動画など、さまざまなデジタルコンテンツの制作を通じてコストを効率的に削減し、最高の品質で効果的なプロモーションをサポートします。',
      zh: '通过制作AI驱动的网站、图像和视频等各种数字内容，有效降低成本，并以最高质量支持有效的推广。',
    }
  },
  {
    id: 5,
    title: {
      ko: '금강샤론',
      en: 'Geumgang Sharon',
      ja: '金剛シャロン',
      zh: '金刚沙龙',
    },
    date: '2024-01-05',
    hit: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%A0%9C%EB%AA%A9%20%EC%97%86%EB%8A%94%20%EB%94%94%EC%9E%90%EC%9D%B8-FGdqIT95etjPBkIXDiG4NcAKWr8gZC.png',
    description: {
      ko: '40년의 전통과 장인 정신으로 빚어낸 유리 공예의 아름다움, 금강샤론그라스는 고급스러운 디자인과 뛰어난 품질로 담금주의 깊은 맛과 멋을 완성하는 대한민국 대표 유리 용기 브랜드입니다.',
      en: 'With 40 years of tradition and craftsmanship, Geumgang Sharon Glass is Korea\'s leading glass container brand that completes the deep taste and style of liquor with luxurious design and excellent quality.',
      ja: '40年の伝統と職人精神で作り上げたガラス工芸の美しさ、金剛シャロングラスは高級なデザインと優れた品質で漬け込み酒の深い味わいと風情を完成させる韓国を代表するガラス容器ブランドです。',
      zh: '拥有40年传统和工艺精神的金刚沙龙玻璃，以其奢华的设计和卓越的品质，完成了韩国顶级玻璃容器品牌的深厚口感和格调。',
    }
  },
]);

const router = useRouter();

// 초기 데이터 로드
useEffect(() => {
  const loadInitialData = () => {
    const storedPosts = localStorage.getItem('posts');
    if (!storedPosts) {
      // 초기 데이터 설정
      const initialPosts = [
        {
          id: 1,
          title: {
            ko: '(사)대한청년을세계로 미래전략포럼 개최',
            en: 'Future Strategy Forum held by Korean Youth to the World Association',
            ja: '(社)大韓青年を世界へ 未来戦略フォーラム開催',
            zh: '(社)韩国青年走向世界协会举办未来战略论坛',
          },
          date: '2024.12.3',
          hit: 0,
          image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AF%B8%EB%9E%98%EC%A0%84%EB%9E%B5%ED%8F%AC%EB%9F%BC.jpg-lobjD33dLn9HHvFaqwYC57KhFIHDJb.jpeg',
          description: {
            ko: '기술혁신의 시대속에서 청년들의 미래를 위한 전략을 논의하는 포럼을 개최합니다.',
            en: 'Hosting a forum to discuss strategies for the future of youth in the era of technological innovation.',
            ja: '技術革新の時代における若者の未来のための戦略を議論するフォーラムを開催します。',
            zh: '举办论坛，讨论技术创新时代青年未来的战略。',
          }
        },
        // ... 다른 포스트들 ...
      ];
      localStorage.setItem('posts', JSON.stringify(initialPosts));
      setPosts(initialPosts);
    } else {
      setPosts(JSON.parse(storedPosts));
    }
  };

  loadInitialData();
}, []); // 컴포넌트 마운트 시 한 번만 실행

// localStorage 데이터 변경 감지 및 상태 업데이트
useEffect(() => {
  const handleStorageChange = () => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []); // 컴포넌트 마운트 시 이벤트 리스너 등록

// 페이지 포커스 시 데이터 새로고침
useEffect(() => {
  const handleFocus = () => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  };

  window.addEventListener('focus', handleFocus);
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}, []); // 컴포넌트 마운트 시 이벤트 리스너 등록

const handlePostClick = (postId: number) => {
  router.push(`/post/${postId}`);
};

const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100; // 네비게이션 바 높이 + 여유 공간
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

return (
  <div className="font-sans min-h-screen flex flex-col">
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
    `}</style>
    <header className="bg-white py-4 px-6 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JymWzMj03WzfKjFdaw3DwGyH0stbgn.png" 
            alt="이노커브 로고" 
            width={120} 
            height={48} 
            priority
            className="object-contain w-auto h-auto cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <Link href="#profile" onClick={(e) => handleScrollTo(e, 'profile')} className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">{translate('profile', language)}</Link>
            <Link href="#smart-options" onClick={(e) => handleScrollTo(e, 'smart-options')} className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">{translate('smartOptions', language)}</Link>
            <Link href="#values" onClick={(e) => handleScrollTo(e, 'values')} className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">{translate('values', language)}</Link>
            <Link href="#history" onClick={(e) => handleScrollTo(e, 'history')} className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">{translate('history', language)}</Link>
            <Link href="#community" onClick={(e) => handleScrollTo(e, 'community')} className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">{translate('activities', language)}</Link>
          </nav>
          <LanguageToggle />
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {isMenuOpen && (
        <motion.nav
          className="md:hidden bg-white fixed top-[72px] left-0 right-0 z-40 shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col">
            <Link href="#profile" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'profile'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('profile', language)}</Link>
            <Link href="#smart-options" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'smart-options'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('smartOptions', language)}</Link>
            <Link href="#values" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'values'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('values', language)}</Link>
            <Link href="#history" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'history'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('history', language)}</Link>
            <Link href="#community" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'community'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('activities', language)}</Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
    <main className="w-full max-w-4xl mx-auto p-5 pt-24 flex-grow overflow-x-hidden">
      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="profile" className="mb-8 bg-white rounded-xl p-6 sm:p-10 shadow-lg overflow-hidden relative">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-40 h-40 sm:w-56 sm:h-56 relative">
                <Image 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JTSehNl2EKBQk7qe2rhkhmUTpPGYrW.png"
                  alt={translate('name', language)} 
                  fill
                  sizes="(max-width: 640px) 160px, 224px"
                  priority
                  className="rounded-full object-cover w-auto h-auto" 
                />
              </div>
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-3">{translate('name', language)}</h2>
                <p className="text-2xl sm:text-3xl text-gray-600 mb-6">{translate('title', language)}</p>
              </div>
              <div className="w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ProfileItem label={translate('birth', language)} value={[translate('birthDate', language)]} className="text-center" />
                  <ProfileItem label={translate('mbti', language)} value={[translate('mbtiType', language)]} className="text-center" />
                  <ProfileItem 
                    label={translate('affiliation', language)} 
                    value={translate('affiliationDescription', language).split('\n')} 
                    className="text-center"
                  />
                  <ProfileItem 
                    label={translate('education', language)} 
                    value={translate('educationDescription', language).split('\n')} 
                    className="text-center"
                  />
                  <ProfileItem 
                    label={translate('field', language)} 
                    value={[translate('fieldDescription', language)]} 
                    className="text-center"
                  />
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>

      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="smart-options" className="mb-8">
            <ContactOptions language={language} />
          </section>
        </FadeInSection>
      </div>

      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="values" className="mb-8 pt-8">
            <MyValues language={language} />
          </section>
        </FadeInSection>
      </div>
      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="history" className="mb-8 bg-white rounded-xl p-8 shadow-lg overflow-hidden relative">
            <History />
          </section>
        </FadeInSection>
      </div>
      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="community" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {translate('community', language)}
              </h2>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="mySwiper"
              >
                {posts.map((post) => (
                  <SwiperSlide key={post.id}>
                    <div
                      onClick={() => handlePostClick(post.id)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
                    >
                      <div className="relative h-48">
                        <Image
                          src={post.image}
                          alt={post.title[language]}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{post.title[language]}</h3>
                        <p className="text-gray-600 mb-2">{post.description[language]}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{post.date}</span>
                          <span>{translate('views', language)}: {post.hit || 0}</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>

    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('contact', language)}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-5 h-5" />
              <p>hjpw96@naver.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <p>010-9037-4458</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('affiliation', language)}</h3>
            <div className="space-y-2">
              <Link 
                href="https://www.daecheongse.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block hover:text-blue-400 transition duration-300"
              >
                (사)대한청년을세계로
              </Link>
              <p>이노커브</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('socialMedia', language)}</h3>
            <div className="space-y-2">
              <Link href="https://www.instagram.com/cpmw_mk/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-400 transition duration-300">
                <span>Instagram</span>
              </Link>
              <Link href="https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=18661100&qvt=0&query=%EC%A0%95%EB%AF%BC%EA%B8%B0" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-400 transition duration-300">
                <span>Naver</span>
              </Link>
              <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-400 transition duration-300">
                <span>Facebook</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
)
}

function ProfileItem({ label, value, className = '' }: { label: string, value: string[], className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <span className="font-bold text-blue-600 block mb-2 text-xl">{label}</span>}
      {(value ?? []).map((item, index) => (
        <p key={index} className="text-lg text-black">{item}</p>
      ))}
    </div>
  )
}

