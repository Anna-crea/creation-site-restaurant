
import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, SelectedOptions, CartItem } from '../types';
import { MENU_ITEMS, EXTRA_OPTIONS } from '../constants';
import { MenuFilter } from '../components/MenuFilter';
import { generateFoodImage } from '../geminiService';
import { Search, CheckCircle2, Plus, X, Trash2, Heart, Sparkles, Loader2, Wand2, Key, AlertCircle, Share2, Check, RefreshCcw } from 'lucide-react';

interface MenuViewProps {
  onAddToCart: (item: CartItem) => void;
  onSelectKey: () => void;
  hasKey: boolean;
}

const GENERATION_STEPS = [
  "Curation des produits d'exception...",
  "Analyse de la structure architecturale...",
  "Optimisation du rendu 2K Haute Définition...",
  "Dressage artistique à la pince numérique...",
  "Sublimation par l'éclairage Chiaroscuro..."
];

export const MenuView: React.FC<MenuViewProps> = ({ onAddToCart, onSelectKey, hasKey }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedMeal, setSelectedMeal] = useState<MenuItem | null>(null);
  const [currentOptions, setCurrentOptions] = useState<SelectedOptions>({});
  const [isAdding, setIsAdding] = useState(false);

  const [aiImages, setAiImages] = useState<Record<string, string>>({});
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (generatingIds.size > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % GENERATION_STEPS.length);
      }, 3000);
    } else {
      setCurrentStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [generatingIds]);

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenSelection = (item: MenuItem) => {
    setSelectedMeal(item);
    setCurrentOptions({});
    setIsAdding(false);
    setError(null);
  };

  const handleShare = async (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    const currentUrl = window.location.origin + window.location.pathname;
    const shareData = {
      title: `L'Éclat de Saveurs - ${item.name}`,
      text: `Découvrez cette création culinaire : ${item.description}`,
      url: currentUrl,
    };

    try {
      if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(currentUrl);
          setShareToast(item.name);
          setTimeout(() => setShareToast(null), 3000);
        } else {
          // Fallback
          const input = document.createElement('input');
          input.value = currentUrl;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          setShareToast(item.name);
          setTimeout(() => setShareToast(null), 3000);
        }
      }
    } catch (err) {
      console.log("Share failed", err);
    }
  };

  const handleGenerateAIImage = async (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (generatingIds.has(item.id)) return;

    if (!hasKey) {
      onSelectKey();
      return;
    }

    setGeneratingIds(prev => new Set(prev).add(item.id));
    setError(null);
    
    try {
      const generatedUrl = await generateFoodImage(item.generationPrompt);
      if (generatedUrl) {
        setAiImages(prev => ({ ...prev, [item.id]: generatedUrl }));
      }
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      if (err.message?.includes("not found")) {
        setError("Clé API invalide ou expirée. Veuillez re-sélectionner.");
        onSelectKey();
      } else {
        setError("L'art prend du temps... réessayez dans un instant.");
      }
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const currentTotal = useMemo(() => {
    if (!selectedMeal) return 0;
    const extrasPrice = (currentOptions.extras || []).reduce((acc, label) => {
      const extra = EXTRA_OPTIONS.find(e => e.label === label);
      return acc + (extra?.price || 0);
    }, 0);
    return selectedMeal.price + extrasPrice;
  }, [selectedMeal, currentOptions]);

  const handleConfirmAdd = () => {
    if (!selectedMeal || isAdding) return;
    setIsAdding(true);
    const cartItem: CartItem = {
      cartId: Math.random().toString(36).substr(2, 9),
      menuItem: {
        ...selectedMeal,
        aiImage: aiImages[selectedMeal.id] || undefined
      },
      selectedOptions: currentOptions,
      quantity: 1,
      totalPrice: currentTotal
    };
    setTimeout(() => {
      onAddToCart(cartItem);
      setSelectedMeal(null);
      setIsAdding(false);
    }, 600);
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-4 bg-stone-900 text-white px-8 py-4 rounded-2xl shadow-2xl border-dashed border-amber-500 border">
          <Check className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Invitation copiée ({shareToast})</span>
        </div>
      )}

      {/* Modal Selection */}
      {selectedMeal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl" onClick={() => !isAdding && setSelectedMeal(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden gold-liquid-border paper-texture border border-stone-100">
            <button 
              disabled={isAdding}
              onClick={() => setSelectedMeal(null)} 
              className="absolute top-8 right-8 p-4 bg-stone-100/50 backdrop-blur-xl rounded-full hover:bg-white transition-all z-20 shadow-xl border border-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-80 md:h-[600px] relative p-10 bg-stone-50 overflow-hidden">
                <div className="w-full h-full rounded-[3rem] overflow-hidden gold-liquid-border shadow-2xl relative bg-stone-200">
                  {(aiImages[selectedMeal.id] || selectedMeal.image) ? (
                    <img 
                      src={aiImages[selectedMeal.id] || selectedMeal.image} 
                      alt={selectedMeal.name} 
                      className={`w-full h-full object-cover ${generatingIds.has(selectedMeal.id) ? 'opacity-30 grayscale blur-sm' : ''}`}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center">
                       <Sparkles className="w-16 h-16 mb-6 opacity-20 gold-glow" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em]">Vision Gastronomique HD</p>
                    </div>
                  )}

                  {generatingIds.has(selectedMeal.id) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/90 backdrop-blur-3xl text-white p-8">
                      <div className="relative mb-6">
                         <div className="w-16 h-16 border-t-2 border-amber-400 rounded-full animate-spin"></div>
                         <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-amber-400 gold-glow" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] shimmer-text text-center leading-loose max-w-[200px]">
                        {GENERATION_STEPS[currentStepIndex]}
                      </span>
                    </div>
                  )}

                  {aiImages[selectedMeal.id] && !generatingIds.has(selectedMeal.id) && (
                    <div className="absolute top-8 left-8 flex items-center gap-3">
                      <div className="bg-amber-600/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl border border-white/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Vision 2K Ultra-Réaliste
                      </div>
                      <button 
                        onClick={(e) => handleGenerateAIImage(e, selectedMeal)}
                        className="bg-stone-900/90 backdrop-blur-md text-white p-2.5 rounded-full shadow-2xl border border-white/10 hover:bg-stone-800 transition-all group/regen"
                        title="Régénérer l'œuvre"
                      >
                        <RefreshCcw className="w-4 h-4 group-hover/regen:rotate-180 transition-transform duration-500" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={(e) => handleShare(e, selectedMeal)}
                    className="absolute bottom-8 right-8 p-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl hover:bg-white transition-all border border-amber-500/20 text-stone-900 flex items-center gap-3 active:scale-95"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Partager l'Art</span>
                  </button>
                </div>
              </div>
              
              <div className="p-12 paper-texture max-h-[85vh] overflow-y-auto stitched-card scrollbar-hide">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-4 h-4 text-amber-500 gold-glow" />
                    <p className="text-amber-600 font-black text-[10px] uppercase tracking-[0.4em]">{selectedMeal.category}</p>
                  </div>
                  <h3 className="text-5xl font-serif font-bold mb-6 leading-tight shimmer-text">{selectedMeal.name}</h3>
                  <p className="text-stone-500 italic font-serif text-lg leading-relaxed mb-8">"{selectedMeal.description}"</p>
                  <div className="h-0.5 w-24 bg-amber-600 gold-glow"></div>
                </div>
                
                <div className="space-y-12 mb-12">
                  {(selectedMeal.name.includes('Bœuf') || selectedMeal.id === '7') && (
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                        Précision de cuisson <span className="text-amber-600 font-hand text-3xl gold-glow">Signature</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Bleu', 'Saignant', 'À Point', 'Bien Cuit'].map(option => (
                          <button 
                            key={option}
                            onClick={() => setCurrentOptions({...currentOptions, cuisson: option})}
                            className={`py-5 px-6 rounded-2xl text-[10px] uppercase tracking-widest font-black border-2 transition-all ${currentOptions.cuisson === option ? 'bg-stone-900 text-white border-dashed border-amber-400 shadow-2xl gold-glow' : 'bg-white border-stone-100 hover:border-amber-200 text-stone-500'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex justify-between items-center">
                      Accords & Suppléments <span className="text-amber-600 font-hand text-3xl gold-glow">Prestige</span>
                    </label>
                    <div className="space-y-4">
                      {EXTRA_OPTIONS.map(option => (
                        <button 
                          key={option.id}
                          onClick={() => {
                            const currentExtras = currentOptions.extras || [];
                            const nextExtras = currentExtras.includes(option.label) 
                              ? currentExtras.filter(e => e !== option.label) 
                              : [...currentExtras, option.label];
                            setCurrentOptions({...currentOptions, extras: nextExtras});
                          }}
                          className={`w-full text-left py-5 px-8 rounded-[2rem] text-xs font-bold border-2 transition-all flex items-center justify-between group ${
                            currentOptions.extras?.includes(option.label) 
                              ? 'bg-amber-50/50 border-amber-500 text-amber-900 shadow-lg' 
                              : 'bg-white border-stone-100 hover:border-stone-200 text-stone-600'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="flex items-center gap-2 font-black text-xs uppercase tracking-tight">
                              {option.label}
                              {option.price > 10 && <Sparkles className="w-3 h-3 text-amber-500 gold-glow" />}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${currentOptions.extras?.includes(option.label) ? 'text-amber-600' : 'text-stone-400'}`}>
                              +{option.price}€
                            </span>
                          </div>
                          {currentOptions.extras?.includes(option.label) ? (
                            <CheckCircle2 className="w-6 h-6 text-amber-600" />
                          ) : (
                            <Plus className="w-5 h-5 text-stone-200 group-hover:text-amber-400 transition-colors" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-amber-100 border-dashed">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Valeur Gastronomique</span>
                    <span className="text-4xl font-black text-stone-900 shimmer-text">{currentTotal}€</span>
                  </div>
                  <button 
                    onClick={handleConfirmAdd}
                    disabled={isAdding}
                    className={`brilliant-btn px-12 py-6 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl flex items-center gap-4 ${
                      isAdding 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-stone-900 text-white gold-liquid-border'
                    }`}
                  >
                    {isAdding ? 'Savouré' : 'Réserver'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-24 relative">
        <span className="shimmer-text font-hand text-6xl mb-4 block gold-glow">L'Art de la Table</span>
        <h2 className="text-6xl md:text-8xl font-serif font-bold mb-8 text-stone-900 tracking-tighter shimmer-text">Galerie Culinaire</h2>
        <p className="max-w-2xl mx-auto text-stone-500 italic text-xl font-serif">"Ici, la matière se fait émotion, le dressage devient poésie, et chaque saveur est un instant de grâce."</p>
        <div className="w-48 h-1 bg-amber-500 mx-auto mt-10 opacity-30 gold-glow"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center mb-32 gap-10">
        <MenuFilter activeCategory={filter} onFilterChange={setFilter} />
        <div className="relative w-full lg:w-[450px] group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-300 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Explorer par saveur (ex: Truffe, Miso...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:border-amber-400 transition-all shadow-xl stitched-border font-medium placeholder:text-stone-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
        {filteredItems.map((item) => {
          const itemAiImage = aiImages[item.id];
          const isGenerating = generatingIds.has(item.id);
          const hasImage = !!item.image || !!itemAiImage;
          const isRecentlyShared = shareToast === item.name;

          return (
            <div key={item.id} className="group flex flex-col relative bg-white rounded-[4rem] transition-all duration-500 gold-liquid-border paper-texture pb-12 shadow-2xl border border-stone-100">
              <div className="absolute -left-8 top-20 z-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-80">
                 <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-amber-500/10 max-w-[200px] -rotate-3">
                    <span className="text-amber-600 font-hand text-3xl block leading-tight gold-glow">Secret du Chef</span>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-2 block">Dressage sculpté</span>
                 </div>
              </div>

              <div className="relative -mt-12 px-10">
                <div className="relative h-80 rounded-[3.5rem] overflow-hidden shadow-2xl gold-liquid-border bg-stone-100">
                  {hasImage ? (
                    <img 
                      src={itemAiImage || item.image} 
                      alt={item.name} 
                      className={`w-full h-full object-cover transition-all duration-700 ${isGenerating ? 'opacity-30 grayscale blur-sm' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-200 bg-stone-50 border-2 border-dashed border-stone-100 rounded-[3rem]">
                      {isGenerating ? (
                         <div className="text-center p-8">
                            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Genèse d'Art HD</p>
                         </div>
                      ) : (
                         <Sparkles className="w-20 h-20 opacity-10 gold-glow" />
                      )}
                    </div>
                  )}

                  {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/90 backdrop-blur-3xl text-white p-8">
                      <div className="relative mb-6">
                         <div className="w-16 h-16 border-t-2 border-amber-400 rounded-full animate-spin"></div>
                         <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-amber-400 gold-glow" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] shimmer-text text-center leading-loose max-w-[200px]">
                        {GENERATION_STEPS[currentStepIndex]}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                     <button onClick={() => handleOpenSelection(item)} className="bg-white text-stone-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-stone-200 transition-transform active:scale-95 brilliant-btn">
                        Explorer l'Artiste
                     </button>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-2 bg-stone-900 text-white w-16 h-16 rounded-full flex items-center justify-center font-black shadow-2xl border border-amber-500/20 rotate-12 z-10">
                  <span className="text-sm shimmer-text">{item.price}€</span>
                </div>

                {itemAiImage && !isGenerating && (
                  <div className="absolute top-6 left-14 z-20 flex items-center gap-2">
                     <div className="bg-amber-600/95 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl border border-white/20 gold-glow">
                        <Sparkles className="w-3.5 h-3.5" />
                        HD 2K
                     </div>
                     <button 
                        onClick={(e) => handleGenerateAIImage(e, item)}
                        className="bg-stone-900/90 backdrop-blur-md text-white p-2 rounded-full shadow-2xl border border-white/10 hover:bg-amber-600 transition-all group/regen-small"
                        title="Régénérer"
                      >
                        <RefreshCcw className="w-3 h-3 group-hover/regen-small:rotate-180 transition-transform duration-500" />
                      </button>
                  </div>
                )}
              </div>
              
              <div className="px-14 pt-16 pb-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-bold text-stone-900 font-serif leading-tight tracking-tighter mb-2 shimmer-text">{item.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.isVegetarian ? 'Végétal d\'Art' : 'Signature du Maître'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleShare(e, item)}
                      className={`p-3 rounded-2xl transition-all border group/share active:scale-90 ${isRecentlyShared ? 'bg-amber-500 text-white border-amber-500' : 'bg-stone-50 border-stone-100 text-stone-400 hover:text-amber-600 hover:bg-amber-50'}`}
                      title="Partager cette création"
                    >
                      {isRecentlyShared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5 group-hover/share:scale-110 transition-transform" />}
                    </button>
                    {!itemAiImage && !isGenerating && (
                      <button 
                        onClick={(e) => handleGenerateAIImage(e, item)}
                        className={`p-3 rounded-2xl transition-all border gold-glow flex flex-col items-center gap-1 ${!hasKey ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-stone-50 border-stone-100 text-stone-400 hover:text-amber-500'}`}
                        title={!hasKey ? "Sélectionnez une clé pour générer l'HD" : "Générer une vision gastronomique 2K"}
                      >
                        {hasKey ? <Wand2 className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                      </button>
                    )}
                    <button className="p-3 bg-stone-50 rounded-2xl hover:bg-rose-50 text-stone-200 hover:text-rose-500 transition-all border border-stone-100">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[10px] text-red-600 font-bold uppercase tracking-widest">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                
                <p className="text-stone-500 text-base mb-14 leading-relaxed line-clamp-2 italic font-serif">
                  "{item.description}"
                </p>
                
                <div className="flex justify-between items-center mt-auto pt-10 border-t border-stone-100 border-dashed">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 gold-glow" />
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.calories} ECLATS</span>
                    </div>
                    <span className="text-amber-600 font-hand text-3xl gold-glow">L'Éclat Pur</span>
                  </div>
                  <button 
                    onClick={() => handleOpenSelection(item)}
                    className="brilliant-btn bg-stone-900 text-white px-12 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-amber-500/10"
                  >
                    Déguster
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
