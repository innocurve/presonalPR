import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export default function Contact() {
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { language } = context;

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
      <Link href="#" className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] relative">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-center">{language === 'ko' ? 'AI 클론' : 'AI Clone'}</h3>
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
          <Image src="/icons/ai-clone.svg" alt="AI Clone" width={48} height={48} className="w-full h-full object-contain" />
        </div>
      </Link>
      <Link href="#" className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] relative">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-center">{language === 'ko' ? '전화' : 'Phone'}</h3>
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
          <Image src="/icons/phone.svg" alt="Phone" width={48} height={48} className="w-full h-full object-contain" />
        </div>
      </Link>
      <Link href="#" className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] relative">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-center">{language === 'ko' ? '일대일 문의' : 'One-on-One Inquiry'}</h3>
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
          <Image src="/icons/chat.svg" alt="Chat" width={48} height={48} className="w-full h-full object-contain" />
        </div>
      </Link>
      <Link href="#" className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col items-center justify-center min-h-[200px] relative">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-center">{language === 'ko' ? 'InnoCard 문의' : 'InnoCard Inquiry'}</h3>
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
          <Image src="/icons/pencil.svg" alt="Pencil" width={48} height={48} className="w-full h-full object-contain" />
        </div>
      </Link>
    </div>
  );
} 