// src/components/common/AIAssistant.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Minimize2 } from 'lucide-react';

interface AIAssistantProps {
  locale: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// Sample FAQ responses - expand as needed
const getAIResponse = (query: string, isPersian: boolean): string => {
  const q = query.toLowerCase().trim();
  
  const responses = {
    en: {
      shipping: "We offer free shipping on all US orders over $50. International shipping rates vary by destination. Orders typically ship within 1-2 business days.",
      return: "We accept returns within 30 days of purchase. Products must be unused and in original packaging. Please contact our support team to initiate a return.",
      ingredients: "All our products are carefully selected for quality and efficacy. We provide detailed ingredient lists on each product page. Most products are cruelty-free and vegan-friendly.",
      tracking: "You'll receive a tracking number via email once your order ships. You can also track your order in your account dashboard.",
      payment: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely.",
      skin: "We offer products for all skin types! You can filter by skin type on our shop page or take our skincare quiz for personalized recommendations.",
      default: "I'm here to help! Feel free to ask about shipping, returns, products, or anything else about AlluraCare."
    },
    fa: {
      shipping: "ما ارسال رایگان برای تمام سفارش‌های بالای ۵۰ دلار در ایالات متحده ارائه می‌دهیم. هزینه ارسال بین‌المللی بسته به مقصد متفاوت است. سفارش‌ها معمولاً در عرض ۱-۲ روز کاری ارسال می‌شوند.",
      return: "ما بازگشت کالا را تا ۳۰ روز پس از خرید می‌پذیریم. محصولات باید استفاده نشده و در بسته‌بندی اصلی باشند. لطفاً برای شروع بازگشت کالا با تیم پشتیبانی ما تماس بگیرید.",
      ingredients: "تمام محصولات ما با دقت برای کیفیت و اثربخشی انتخاب شده‌اند. ما لیست کامل مواد تشکیل‌دهنده را در صفحه هر محصول ارائه می‌دهیم. بیشتر محصولات بدون تست روی حیوانات و مناسب برای وگان هستند.",
      tracking: "شما شماره رهگیری را از طریق ایمیل پس از ارسال سفارش دریافت خواهید کرد. همچنین می‌توانید سفارش خود را در داشبورد حساب کاربری خود پیگیری کنید.",
      payment: "ما تمام کارت‌های اعتباری اصلی (ویزا، مسترکارت، امریکن اکسپرس) و پی‌پال را می‌پذیریم. تمام پرداخت‌ها به صورت امن پردازش می‌شوند.",
      skin: "ما محصولات برای تمام انواع پوست ارائه می‌دهیم! می‌توانید در صفحه فروشگاه بر اساس نوع پوست فیلتر کنید یا تست پوست ما را برای توصیه‌های شخصی‌سازی شده انجام دهید.",
      default: "من اینجا هستم تا کمک کنم! درباره ارسال، بازگشت کالا، محصولات یا هر چیز دیگری در مورد آلوراکیـر سوال دارید؟"
    }
  };

  const dict = isPersian ? responses.fa : responses.en;

  if (q.includes('ship') || q.includes('ارسال') || q.includes('delivery')) return dict.shipping;
  if (q.includes('return') || q.includes('بازگشت') || q.includes('refund')) return dict.return;
  if (q.includes('ingredient') || q.includes('material') || q.includes('مواد')) return dict.ingredients;
  if (q.includes('track') || q.includes('پیگیری') || q.includes('status')) return dict.tracking;
  if (q.includes('pay') || q.includes('پرداخت') || q.includes('card')) return dict.payment;
  if (q.includes('skin') || q.includes('نوع پوست') || q.includes('routine')) return dict.skin;
  
  return dict.default;
};

export default function AIAssistant({ locale }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPersian = locale === 'fa';

  useEffect(() => {
    // Show after a delay for page load
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Add welcome message if no messages
      if (messages.length === 0) {
        setMessages([
          {
            id: 'welcome',
            type: 'assistant',
            text: isPersian 
              ? 'سلام! 👋 من دستیار هوشمند آلوراکیـر هستم. چگونه می‌توانم به شما کمک کنم؟'
              : 'Hi! 👋 I\'m the AlluraCare AI assistant. How can I help you today?',
            timestamp: new Date(),
          },
        ]);
      }
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isPersian, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(userMessage.text, isPersian);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500 + Math.random() * 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#874A58] to-[#C397A0] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label={isPersian ? 'دستیار هوشمند' : 'AI Assistant'}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-brand-secondary/20 transition-all duration-300 ${
          isOpen 
            ? isMinimized 
              ? 'h-[60px] scale-100 opacity-100' 
              : 'h-[500px] scale-100 opacity-100'
            : 'h-0 scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-secondary/20 bg-gradient-to-r from-[#EDEDFA] to-[#C1EODF] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#874A58]" />
            <span className="font-semibold text-[#2D2D2D]">
              {isPersian ? 'دستیار هوشمند' : 'AI Assistant'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-[#8A8A8A] hover:text-[#874A58] transition rounded-lg hover:bg-white/50"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#8A8A8A] hover:text-red-500 transition rounded-lg hover:bg-white/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-120px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-[#874A58] text-white rounded-br-none'
                        : 'bg-[#EDEDFA] text-[#2D2D2D] rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className="text-[10px] opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString(isPersian ? 'fa-IR' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-up">
                  <div className="bg-[#EDEDFA] text-[#2D2D2D] px-4 py-2.5 rounded-2xl rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#874A58] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#874A58] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#874A58] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-brand-secondary/20 bg-white rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isPersian ? 'سوال خود را بپرسید...' : 'Ask a question...'}
                  className="flex-1 px-4 py-2.5 border border-brand-secondary/30 rounded-xl focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-sm text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-[#874A58] text-white rounded-xl hover:bg-[#C397A0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}