import { Card, CardContent } from "@/components/ui/card"
import { Language, translate } from '../utils/translations'

interface ContactOptionProps {
  title: string
  icon: React.ReactNode
  onClick?: () => void
}

const ContactOption: React.FC<ContactOptionProps> = ({ title, icon, onClick }) => (
  <Card 
    className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 shadow-md"
    onClick={onClick}
  >
    <CardContent className="h-[150px] flex flex-col justify-between p-4 relative">
      <h3 className="font-bold text-lg md:text-xl text-left text-black break-keep">{title}</h3>
      <div className="self-end text-blue-500">
        {icon}
      </div>
    </CardContent>
  </Card>
)

interface ContactOptionsProps {
  language: Language;
  onOpenChatBot?: () => void;
}

const ContactOptions: React.FC<ContactOptionsProps> = ({ language, onOpenChatBot }) => {
  const handleOptionClick = (key: string) => {
    if (key === 'aiClone' && onOpenChatBot) {
      onOpenChatBot();
    } else {
      console.log(`Clicked: ${key}`);
    }
  };

  const options = [
    { 
      key: 'aiClone',
      title: translate('aiClone', language),
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="20" r="12" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          <path d="M32 36C18.7452 36 8 46.7452 8 60" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
          <path d="M56 60C56 46.7452 45.2548 36 32 36" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 60V48" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
          <path d="M24 56H40" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="32" cy="20" r="4" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      key: 'phone',
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="4" width="28" height="56" rx="4" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          <line x1="18" y1="12" x2="46" y2="12" stroke="#3B82F6" strokeWidth="2"/>
          <line x1="18" y1="52" x2="46" y2="52" stroke="#3B82F6" strokeWidth="2"/>
          <circle cx="32" cy="56" r="2" fill="#3B82F6"/>
          <rect x="26" y="6" width="12" height="4" rx="2" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      key: 'oneOnOneInquiry',
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16H36C38.2091 16 40 17.7909 40 20V32C40 34.2091 38.2091 36 36 36H26L16 46V36H8C5.79086 36 4 34.2091 4 32V20C4 17.7909 5.79086 16 8 16Z" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          <path d="M28 48H56C58.2091 48 60 46.2091 60 44V32C60 29.7909 58.2091 28 56 28H48" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          <circle cx="16" cy="26" r="2" fill="#3B82F6"/>
          <circle cx="24" cy="26" r="2" fill="#3B82F6"/>
          <circle cx="32" cy="26" r="2" fill="#3B82F6"/>
          <circle cx="48" cy="38" r="2" fill="#3B82F6"/>
          <circle cx="40" cy="38" r="2" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      key: 'innoCardInquiry',
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 54L14 42L50 6L58 14L22 50L10 54Z" stroke="#3B82F6" strokeWidth="2" fill="none"/>
          <path d="M42 14L50 22" stroke="#3B82F6" strokeWidth="2"/>
          <path d="M10 54L14 42" stroke="#3B82F6" strokeWidth="2"/>
          <path d="M8 58H56" stroke="#3B82F6" strokeWidth="2"/> 
        </svg>
      )
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {options.map((option) => (
        <ContactOption
          key={option.key}
          title={translate(option.key, language)}
          icon={option.icon}
          onClick={() => handleOptionClick(option.key)}
        />
      ))}
    </div>
  )
}

export default ContactOptions

