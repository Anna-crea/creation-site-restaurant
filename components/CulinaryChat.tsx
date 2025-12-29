
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Sparkles, ArrowUpRight, Loader2, MessageSquare, Send } from 'lucide-react';
import { culinaryConcierge } from '../geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const SUGGESTIONS = [
  "Quel est le menu signature ?",
  "Proposez-vous des accords mets-vins ?",
  "Comment réserver une loge privée ?",
  "Quels sont vos desserts phares ?"
];

export const CulinaryChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>([
    { role: 'bot', text: 'Bienvenue à L\'Éclat de Saveurs. Je suis votre majordome numérique. Comment puis-je rendre votre visite mémorable ?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isThinking]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isThinking) return;

    setHistory(prev => [...prev, { role: 'user', text }]);
    setMessage('');
    setIsThinking(true);

    try {
      const response = await culinaryConcierge(text);
      setHistory(prev => [...prev, { role: 'bot', text: response || 'Une erreur est survenue dans nos cuisines numériques.' }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'bot', text: 'Veuillez m\'excuser, je rencontre une difficulté technique.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[500] font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-amber-500/30 group hover:scale-110 transition-transform relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          <MessageSquare className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors" />
          <div className="absolute right-20 bg-white px-4 py-2 rounded-xl shadow-xl border border-stone-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Concierge en ligne</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[420px] h-[650px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-stone-100 gold-liquid-border paper-texture">
          {/* Header */}
          <div className="bg-stone-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Bot className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl leading-tight">L'Éclat Concierge</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">Prêt à vous servir</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-stone-50/30"
          >
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-amber-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white border border-stone-200 text-stone-900 rounded-tl-none shadow-sm'
                }`}>
                  {msg.role === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-3 h-3 text-amber-600" />
                       <span className="font-hand text-2xl text-amber-700">Majordome</span>
                    </div>
                  )}
                  <p className={msg.role === 'bot' ? 'italic font-serif' : 'font-medium'}>{msg.text}</p>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-stone-200 shadow-sm">
                  <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested Actions (uniquement si peu de messages ou fin de conversation) */}
          <div className="px-8 pb-4 pt-2 overflow-x-auto flex gap-3 scrollbar-hide">
             {SUGGESTIONS.map((s, i) => (
               <button 
                key={i}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2.5 bg-white border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm"
               >
                 {s}
               </button>
             ))}
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(message); }}
            className="p-8 border-t border-stone-100 bg-white"
          >
            <div className="relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre requête gastronomique..."
                className="w-full pl-6 pr-16 py-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium text-sm"
              />
              <button 
                type="submit"
                disabled={!message.trim() || isThinking}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-amber-600 transition-all disabled:opacity-20 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[8px] text-stone-400 font-black uppercase tracking-[0.3em] text-center mt-4">Intelligence Artificielle au service de l'Excellence</p>
          </form>
        </div>
      )}
    </div>
  );
};
