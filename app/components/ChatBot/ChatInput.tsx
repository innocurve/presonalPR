import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDark?: boolean;
}

const ChatInput = ({ onSendMessage, isDark }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        p-4 border-t
        ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
      `}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className={`
            flex-1 p-2 rounded-lg border
            ${isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        />
        <button
          type="submit"
          className={`
            px-4 py-2 rounded-lg
            ${isDark 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            text-white transition-colors
          `}
        >
          전송
        </button>
      </div>
    </form>
  );
};

export default ChatInput;

