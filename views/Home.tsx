
import React from 'react';
import { Quote, Sparkles, Utensils, GlassWater, ChefHat, Camera } from 'lucide-react';

interface HomeProps {
  onOrderNow: () => void;
}

const RESTAURANT_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    caption: "L'Espace Visionnaire",
    note: "Modernité & Lumières",
    size: "large"
  },
  {
    url: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=800&auto=format&fit=crop",
    caption: "L'Art de la Table Minimaliste",
    note: "Pureté du design",
    size: "small"
  },
  {
    url: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?q=80&w=1200&auto=format&fit=crop",
    caption: "Le Geste Culinaire",
    note: "L'instant cinématique",
    size: "small"
  }
];

export const Home: React.FC<HomeProps> = ({ onOrderNow }) => {
  return (
    <div className="pt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop" 
            alt="Ambiance Cinématique L'Éclat" 
            className="w-full h-full object-cover grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/40 to-transparent"></div>
          
          <div className="absolute inset-0 opacity-10 paper-texture pointer-events-none"></div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10 py-20">
          <div className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 backdrop-blur-3xl border border-amber-500/30 rounded-full mb-10 stitched-border shadow-2xl">
            <Sparkles className="w-3 h-3 text-amber-400 gold-glow" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-200">Gastronomie Contemporaine</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-serif font-bold mb-10 leading-none">
            <span className="shimmer-text">L'Éclat d'</span> <br />
            <span className="shimmer-text italic font-hand font-normal normal-case translate-y-4 inline-block gold-glow">Avant-Garde.</span>
          </h1>
          <p className="text-xl text-stone-200 mb-14 max-w-2xl leading-relaxed italic">
            "Une fusion entre héritage classique et vision futuriste, où chaque plat est une œuvre cinématographique."
          </p>
          <div className="flex flex-col sm:flex-row gap-8">
            <button 
              onClick={onOrderNow}
              className="brilliant-btn bg-amber-600 hover:bg-amber-500 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl gold-liquid-border"
            >
              Expérience Culinaire
            </button>
            <button className="brilliant-btn gold-shimmer-btn bg-white/5 backdrop-blur-md border-2 border-amber-500/40 hover:bg-white/10 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl group">
              <span className="relative z-10 gold-glow group-hover:text-amber-300 transition-colors">Réserver une Loge</span>
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-16 right-16 hidden lg:flex flex-col items-end">
           <span className="shimmer-text font-hand text-5xl mb-2 -rotate-6 gold-glow">Intemporel</span>
           <div className="bg-stone-900/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-amber-500/20 max-w-sm stitched-card shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <Quote className="w-10 h-10 text-amber-400 mb-6 opacity-40 gold-glow" />
              <p className="text-stone-100 italic text-lg leading-relaxed mb-6 font-serif">"Nous ne servons pas des plats, nous mettons en scène des émotions gravées dans la matière."</p>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-amber-400"></div>
                <span className="text-[10px] text-amber-200 font-black uppercase tracking-widest">Manifeste Gastronomique</span>
              </div>
           </div>
        </div>
      </section>

      {/* Galerie des Sens */}
      <section className="py-40 px-4 sm:px-6 lg:px-8 bg-white marble-texture relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-32 relative">
          <div className="inline-flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-amber-500 opacity-30"></div>
            <Camera className="w-6 h-6 text-amber-600 gold-glow" />
            <div className="h-px w-12 bg-amber-500 opacity-30"></div>
          </div>
          <span className="shimmer-text font-hand text-5xl mb-4 block gold-glow">L'Objectif d'Or</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-8 tracking-tighter shimmer-text">Immersion Visuelle</h2>
          <p className="max-w-xl mx-auto text-stone-500 italic font-serif text-lg">Un voyage à travers les lignes épurées et les contrastes de notre sanctuaire moderne.</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Photo Large - Gauche (Style Moderne Haut de Gamme) */}
            <div className="md:col-span-7 group relative">
              <div className="gold-liquid-border rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/3]">
                <img src={RESTAURANT_PHOTOS[0].url} alt={RESTAURANT_PHOTOS[0].caption} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                   <div className="text-white">
                      <p className="font-hand text-4xl shimmer-text mb-2 gold-glow">{RESTAURANT_PHOTOS[0].note}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{RESTAURANT_PHOTOS[0].caption}</span>
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2rem] shadow-2xl border border-amber-500/10 -rotate-3 z-20">
                 <ChefHat className="w-8 h-8 text-amber-600 mb-3 gold-glow" />
                 <p className="font-hand text-3xl text-amber-700 leading-none">Scénographie</p>
                 <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-2 block">L'art de l'espace</span>
              </div>
            </div>

            {/* Deux photos petites - Droite */}
            <div className="md:col-span-5 flex flex-col gap-10">
              <div className="group relative">
                <div className="gold-liquid-border rounded-[3.5rem] overflow-hidden shadow-2xl aspect-video">
                  <img src={RESTAURANT_PHOTOS[1].url} alt={RESTAURANT_PHOTOS[1].caption} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-4 -right-4 bg-stone-900 text-white p-4 rounded-xl shadow-2xl rotate-6 text-center stitched-card">
                  <span className="text-[9px] font-black uppercase tracking-widest block shimmer-text">Détail d'Acier</span>
                </div>
              </div>

              <div className="group relative">
                <div className="gold-liquid-border rounded-[3.5rem] overflow-hidden shadow-2xl aspect-video">
                  <img src={RESTAURANT_PHOTOS[2].url} alt={RESTAURANT_PHOTOS[2].caption} className="w-full h-full object-cover" />
                </div>
                <p className="mt-4 font-hand text-3xl text-stone-400 text-right pr-6 italic group-hover:text-amber-600 transition-colors">"{RESTAURANT_PHOTOS[2].note}"</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
