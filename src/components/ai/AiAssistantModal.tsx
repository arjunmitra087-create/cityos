import React, { useState, useRef, useEffect } from 'react';
import { campusService } from '../../services/campusService';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronRight, 
  RotateCcw,
  Zap,
  Droplet,
  Users,
  AlertTriangle
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Greetings, Administrator. I am CITYOS AI, connected to 248 real-time IoT nodes across North Apex Campus. How can I assist you with energy load balancing, water telemetry, crowd management, or predictive operations today?",
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    "Which building is consuming the most electricity?",
    "Why is energy consumption high today?",
    "Predict tomorrow's campus crowd.",
    "Which areas need attention?",
    "Show me water consumption for the last 7 days.",
    "What can we do to reduce energy consumption?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Formulate response using campus service intelligence
    setTimeout(() => {
      const responseText = campusService.queryCampusKnowledge(text);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: "Chat context refreshed. What campus telemetry or prediction would you like to explore?",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] md:w-[500px] bg-[#FFFFFF] border-l border-[#E2E8F0] z-50 flex flex-col shadow-2xl transition-all">
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#2563EB] text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
              Ask CITYOS AI
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-mono font-medium">
                ONLINE
              </span>
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Trained on 248 IoT edge streams & facility models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#64748B] mb-2">
          Recommended Queries
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 text-[11px] text-[#1E293B] hover:text-[#2563EB] whitespace-nowrap transition-colors shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-3 h-3 text-[#64748B]" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#2563EB] text-white font-medium rounded-tr-none shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#1E293B] rounded-tl-none whitespace-pre-line shadow-xs'
              }`}
            >
              {msg.text}
              <div
                className={`text-[10px] mt-1.5 font-mono ${
                  msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-[#64748B]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-[#1E293B] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#64748B] p-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] w-fit">
            <Bot className="w-4 h-4 text-[#2563EB] animate-spin" />
            <span>CITYOS Neural Model evaluating campus telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#FFFFFF]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about electricity, water, crowd forecasts..."
            className="flex-1 py-2 px-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] disabled:opacity-40 disabled:hover:bg-[#2563EB] text-white transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
