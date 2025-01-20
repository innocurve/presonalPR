'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Language, translate } from '../utils/translations'
import LanguageToggle from './LanguageToggle'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  language: Language;
}

export default function Navigation({ language }: NavigationProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const path = window.location.pathname;
    if (path !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white py-4 px-6 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JymWzMj03WzfKjFdaw3DwGyH0stbgn.png" 
              alt="이노커브 로고" 
              width={120} 
              height={48} 
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <Link href="/#profile" onClick={(e) => handleScrollTo(e, 'profile')} className="text-gray-600 hover:text-blue-600 transition duration-300">{translate('profile', language)}</Link>
            <Link href="/#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="text-gray-600 hover:text-blue-600 transition duration-300">{translate('smartOptions', language)}</Link>
            <Link href="/#values" onClick={(e) => handleScrollTo(e, 'values')} className="text-gray-600 hover:text-blue-600 transition duration-300">{translate('values', language)}</Link>
            <Link href="/#history" onClick={(e) => handleScrollTo(e, 'history')} className="text-gray-600 hover:text-blue-600 transition duration-300">{translate('history', language)}</Link>
            <Link href="/#community" onClick={(e) => handleScrollTo(e, 'community')} className="text-gray-600 hover:text-blue-600 transition duration-300">{translate('activities', language)}</Link>
          </nav>
          <LanguageToggle />
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </div>

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
              <Link href="/#profile" onClick={(e) => { toggleMenu(); handleScrollTo(e, 'profile'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('profile', language)}</Link>
              <Link href="/#contact" onClick={(e) => { toggleMenu(); handleScrollTo(e, 'contact'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('smartOptions', language)}</Link>
              <Link href="/#values" onClick={(e) => { toggleMenu(); handleScrollTo(e, 'values'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('values', language)}</Link>
              <Link href="/#history" onClick={(e) => { toggleMenu(); handleScrollTo(e, 'history'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('history', language)}</Link>
              <Link href="/#community" onClick={(e) => { toggleMenu(); handleScrollTo(e, 'community'); }} className="block p-4 text-gray-600 hover:bg-gray-100 transition duration-300">{translate('activities', language)}</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
} 