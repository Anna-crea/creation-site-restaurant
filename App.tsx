
import React, { useState, useMemo, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './views/Home';
import { MenuView } from './views/MenuView';
import { ReservationView } from './views/ReservationView';
import { AdminDashboard } from './views/AdminDashboard';
import { CulinaryChat } from './components/CulinaryChat';
import { 
  Facebook, Instagram, Twitter, UtensilsCrossed, Send, ShoppingBag, 
  Trash2, X, ArrowRight, Minus, Plus, CreditCard, ShieldCheck, 
  CheckCircle2, ChevronLeft, Loader2, Share2, Utensils, Sparkles, MessageSquare, Bot, ArrowUpRight, Key
} from 'lucide-react';
import { CartItem } from './types';

type CheckoutStep = 'cart' | 'payment' | 'success';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'reserve' | 'admin'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  
  // Key Management
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onOrderNow={() => setCurrentView('menu')} />;
      case 'menu':
        return <MenuView onAddToCart={addToCart} onSelectKey={handleOpenKeySelector} hasKey={hasApiKey} />;
      case 'reserve':
        return <ReservationView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home onOrderNow={() => setCurrentView('menu')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-amber-100 selection:text-amber-900">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
      />
      
      {/* AI Assistant Widget */}
      <CulinaryChat />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col paper-texture">
            <div className="p-10 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-7 h-7 text-amber-600" />
                <h3 className="text-2xl font-serif font-bold">Votre Collection</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-stone-100 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-8 border border-stone-100 shadow-inner">
                    <ShoppingBag className="w-12 h-12 text-stone-200" />
                  </div>
                  <p className="text-stone-400 font-serif italic text-lg">Votre collection de saveurs est vide...</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="flex gap-6 group">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 gold-liquid-border shadow-lg">
                      <img src={item.menuItem.aiImage || item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-stone-900 text-lg leading-tight">{item.menuItem.name}</h4>
                         <button onClick={() => removeFromCart(item.cartId)} className="p-2 text-stone-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center gap-3 mt-auto">
                         <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                            <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1.5 hover:bg-white rounded-lg transition-all"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="px-4 font-black text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1.5 hover:bg-white rounded-lg transition-all"><Plus className="w-3.5 h-3.5" /></button>
                         </div>
                         <span className="font-black text-lg ml-auto">{item.menuItem.price * item.quantity}€</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 bg-stone-50 border-t border-stone-200 space-y-8">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-stone-400 uppercase tracking-widest">Sous-Total</span>
                    <span className="text-2xl font-black text-stone-900">{cartTotal}€</span>
                 </div>
                 <button className="brilliant-btn w-full bg-stone-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 group">
                    Confirmer l'Expérience
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow">
        {renderView()}
      </main>

      <footer className="bg-stone-900 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
             <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-4 mb-10">
                   <div className="bg-amber-600 p-3 rounded-2xl">
                      <UtensilsCrossed className="h-8 w-8 text-white" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-4xl font-serif font-black tracking-tighter">L'ÉCLAT</span>
                      <span className="text-xs font-bold tracking-[0.5em] text-amber-500 uppercase">De Saveurs</span>
                   </div>
                </div>
                <p className="text-stone-400 text-lg leading-relaxed max-w-md italic font-serif">"La haute gastronomie est un art de l'instant, capturé pour l'éternité dans chaque assiette que nous servons."</p>
             </div>
             
             <div>
                <h4 className="text-xl font-bold mb-10 font-serif border-b border-white/10 pb-4 inline-block">Visite Privée</h4>
                <ul className="space-y-6 text-stone-400 text-sm font-medium">
                   <li className="flex flex-col"><span className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">Adresse</span>12 Avenue des Gastronomes, Paris VIII</li>
                   <li className="flex flex-col"><span className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">Contact</span>+33 (0)1 23 45 67 89</li>
                   <li className="flex flex-col"><span className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">Directeur</span>concierge@leclat.fr</li>
                </ul>
             </div>

             <div>
                <h4 className="text-xl font-bold mb-10 font-serif border-b border-white/10 pb-4 inline-block">S'émerveiller</h4>
                <p className="text-stone-400 text-sm mb-8">Rejoignez le Cercle Privé pour des invitations exclusives.</p>
                <div className="relative">
                   <input type="email" placeholder="Votre email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:border-amber-500 transition-all" />
                   <button className="absolute right-2 top-2 bottom-2 px-6 bg-amber-600 rounded-xl hover:bg-amber-500 transition-all flex items-center justify-center">
                      <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 text-center text-stone-500 text-[10px] font-black uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} L'Éclat de Saveurs — L'Excellence comme unique Horizon.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
