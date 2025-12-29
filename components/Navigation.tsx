
import React, { useState, useEffect } from 'react';
// Fix: Added missing Loader2 import to resolve "Cannot find name 'Loader2'" error
import { Menu, X, UtensilsCrossed, LayoutDashboard, Home, BookOpen, CalendarCheck, ShoppingCart, Sparkles, Share2, Check, Info, Code2, Cpu, QrCode, Copy, ExternalLink, Github, Mail, AlertCircle, Globe, Zap, Loader2 } from 'lucide-react';

interface NavigationProps {
  currentView: 'home' | 'menu' | 'reserve' | 'admin';
  setView: (view: 'home' | 'menu' | 'reserve' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, cartCount, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Initialisation propre de l'URL de partage
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Nettoyer l'URL actuelle (enlever les query params de session qui causent des 404)
    const cleanUrl = window.location.origin + window.location.pathname;
    setShareUrl(cleanUrl);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Détections d'environnements
  const isLocal = shareUrl.includes('localhost') || shareUrl.includes('127.0.0.1');
  const isSandbox = shareUrl.includes('stackblitz') || shareUrl.includes('webcontainer') || shareUrl.includes('codesandbox');

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("L'Éclat de Saveurs | Projet Restaurant");
    const body = encodeURIComponent(`Bonjour,\n\nDécouvrez mon projet de restaurant immersif ici :\n${shareUrl}\n\n(Note: Si le lien affiche une erreur 404, assurez-vous que le projet est en ligne et public).`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "L'Éclat de Saveurs",
          text: "Découvrez mon projet de restaurant immersif.",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const navItems = [
    { id: 'home', label: 'Accueil', icon: <Home className="w-4 h-4 mr-2" /> },
    { id: 'menu', label: 'La Carte', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { id: 'reserve', label: 'Réservations', icon: <CalendarCheck className="w-4 h-4 mr-2" /> },
    { id: 'admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
  ] as const;

  return (
    <nav className={`fixed w-full z-[150] transition-all duration-500 ${
      scrolled 
        ? 'py-4 bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-stone-100' 
        : 'py-8 bg-transparent'
    }`}>
      {/* Modal Partage & QR Code Anti-404 */}
      {showShareModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl" onClick={() => setShowShareModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl border border-stone-100 paper-texture gold-liquid-border overflow-hidden">
             <button onClick={() => setShowShareModal(false)} className="absolute top-8 right-8 p-3 hover:bg-stone-100 rounded-full transition-colors z-20">
               <X className="w-5 h-5 text-stone-400" />
             </button>
             
             <div className="text-center mb-10 relative z-10">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
                   <QrCode className="w-8 h-8 text-amber-600 gold-glow" />
                </div>
                <h3 className="text-3xl font-serif font-bold shimmer-text">Partage Universel</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-2">Éviter les erreurs 404 sur mobile</p>
             </div>

             <div className="space-y-6 relative z-10">
                {/* QR Code Section avec fallback */}
                <div className="bg-stone-50 rounded-[2.5rem] p-8 flex flex-col items-center border border-stone-100 relative">
                   <div className="bg-white p-4 rounded-3xl shadow-xl border border-stone-200 mb-6 group transition-transform hover:scale-105">
                      {shareUrl ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}&color=926d0b&bgcolor=ffffff`} 
                          alt="QR Code"
                          className="w-48 h-48"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center bg-stone-50 text-stone-300">
                           <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                      )}
                   </div>
                   
                   {/* Alertes d'accessibilité */}
                   {(isLocal || isSandbox) && (
                     <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800">
                           <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                           <div className="text-[10px] font-bold leading-tight uppercase tracking-tight">
                              <p className="mb-1">Environnement {isLocal ? 'Local' : 'Temporaire'} détecté.</p>
                              <p className="opacity-70 normal-case font-medium">Pour que le QR Code fonctionne sur votre téléphone, saisissez ci-dessous l'adresse **publique** de votre site (ex: sur Vercel ou Netlify).</p>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* URL Input Area - Crucial pour corriger le 404 */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Lien à partager
                      </label>
                      <button 
                        onClick={() => setShareUrl(window.location.origin + window.location.pathname)}
                        className="text-[8px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                      >
                         <Zap className="w-2.5 h-2.5" /> Détection Auto
                      </button>
                   </div>
                   <div className="relative group">
                     <input 
                       type="text"
                       value={shareUrl}
                       onChange={(e) => setShareUrl(e.target.value)}
                       className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-[11px] font-bold focus:outline-none focus:border-amber-500 transition-all text-stone-700 pr-12 shadow-inner"
                       placeholder="Saisissez votre URL publique ici..."
                     />
                     <button 
                       onClick={handleCopyLink}
                       className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-stone-200 rounded-xl transition-all text-stone-400 hover:text-amber-600"
                     >
                       {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                     </button>
                   </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={handleEmailShare}
                    className="flex items-center justify-center gap-3 p-5 bg-white border-2 border-stone-100 hover:border-amber-500 text-stone-600 hover:text-amber-600 rounded-3xl transition-all shadow-sm"
                   >
                      <Mail className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                   </button>
                   <button 
                    onClick={handleNativeShare}
                    className="flex items-center justify-center gap-3 p-5 bg-stone-900 text-white rounded-3xl border-2 border-stone-900 hover:bg-amber-600 hover:border-amber-600 transition-all shadow-xl"
                   >
                      <Share2 className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Partager</span>
                   </button>
                </div>
             </div>
             
             {/* Décoration Or */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"></div>
          </div>
        </div>
      )}

      {/* Info Project Modal (Pour le professeur) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={() => setShowInfoModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl border border-stone-100 paper-texture gold-liquid-border">
             <button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 p-3 hover:bg-stone-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-stone-900 rounded-2xl text-amber-500 shadow-xl"><Code2 className="w-8 h-8" /></div>
                <div>
                   <h3 className="text-2xl font-serif font-bold">Architecture du Projet</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Environnement de Développement Maîtrisé</p>
                </div>
             </div>
             <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-100 group hover:border-amber-200 transition-colors">
                   <Cpu className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                   <div>
                      <h4 className="font-bold text-sm">IA Gemini 3 (SDK Natif)</h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">Génération d'images HD et concierge conversationnel. Utilisation de `@google/genai` pour une réactivité maximale.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-100 group hover:border-amber-200 transition-colors">
                   <Zap className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                   <div>
                      <h4 className="font-bold text-sm">UI High-End "Stitch"</h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">Design immersif utilisant des bordures dorées statiques, des textures de papier organique et des composants 100% React.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setView('home')}>
            <div className={`bg-stone-900 p-3 rounded-2xl shadow-xl transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}>
              <UtensilsCrossed className="h-6 w-6 text-amber-500" />
            </div>
            <div className={`flex flex-col transition-all duration-500 ${scrolled ? 'opacity-0 scale-90 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-black tracking-tighter text-stone-900 leading-none">L'ÉCLAT</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] text-amber-600 leading-none mt-2 uppercase">De Saveurs</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="bg-stone-100/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-stone-200/50 flex items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 border ${
                    currentView === item.id 
                      ? 'bg-stone-900 text-white shadow-xl border-dashed border-stone-400' 
                      : 'text-stone-600 border-transparent hover:text-amber-600 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowInfoModal(true)}
                className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  scrolled ? 'bg-stone-100 text-amber-600 border border-amber-200' : 'bg-white/10 text-amber-400 backdrop-blur-md border border-white/20'
                }`}
              >
                <Info className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setShowShareModal(true)}
                className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  scrolled ? 'bg-stone-100 text-stone-900 border border-stone-200' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onOpenCart}
                className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-300 ${
                  scrolled ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-stone-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-stone-900">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="p-3 bg-stone-100 rounded-xl">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 p-8 space-y-4 shadow-2xl">
           {navItems.map((item) => (
             <button
               key={item.id}
               onClick={() => { setView(item.id); setIsOpen(false); }}
               className={`w-full flex items-center p-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                 currentView === item.id ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-600'
               }`}
             >
               {item.icon} {item.label}
             </button>
           ))}
           <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <button onClick={() => { setShowShareModal(true); setIsOpen(false); }} className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400">
                <Share2 className="w-4 h-4 mr-2" /> Partager
              </button>
              <button onClick={() => { setShowInfoModal(true); setIsOpen(false); }} className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-400">
                <Info className="w-4 h-4 mr-2" /> Infos
              </button>
           </div>
        </div>
      )}
    </nav>
  );
};
