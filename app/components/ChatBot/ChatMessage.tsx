import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChatMessageProps {
  role: 'user' | 'bot';
  content: string;
  timestamp?: number;
  isDark?: boolean;
}

const ChatMessage = ({ role, content, timestamp, isDark }: ChatMessageProps) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        max-w-[80%] rounded-lg p-3
        ${role === 'user' 
          ? 'bg-blue-500 text-white' 
          : isDark 
            ? 'bg-gray-700 text-white' 
            : 'bg-gray-100 text-gray-800'
        }
      `}>
        <div className="whitespace-pre-wrap break-words">{content}</div>
        {timestamp && (
          <div className={`
            text-xs mt-1
            ${role === 'user' 
              ? 'text-blue-100' 
              : isDark 
                ? 'text-gray-400' 
                : 'text-gray-500'
            }
          `}>
            {format(timestamp, 'a h:mm', { locale: ko })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

