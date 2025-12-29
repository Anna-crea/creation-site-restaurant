
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Mail, User, CheckCircle2, ChevronRight, Loader2, Info, Star, ShieldCheck, MapPin, Phone, MessageCircle } from 'lucide-react';

type Availability = 'Available' | 'Limited' | 'Full';

interface TimeSlot {
  time: string;
  status: Availability;
}

export const ReservationView: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
  });
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formState.date) {
      setCheckingAvailability(true);
      // Simulation d'une vérification de disponibilité locale
      const timer = setTimeout(() => {
        const times = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
        const slots: TimeSlot[] = times.map(t => {
          const rand = Math.random();
          let status: Availability = 'Available';
          if (rand > 0.8) status = 'Full';
          else if (rand > 0.5) status = 'Limited';
          return { time: t, status };
        });
        setAvailableSlots(slots);
        setCheckingAvailability(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [formState.date, formState.guests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Prêt pour votre future intégration manuelle ici
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center border border-stone-100 paper-texture gold-liquid-border">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Réservation Enregistrée</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">Merci, {formState.name}. Votre demande de table pour le <span className="font-bold text-stone-900">{formState.date}</span> à <span className="font-bold text-stone-900">{formState.time}</span> a bien été reçue par notre Maître d'Hôtel.</p>
          <div className="space-y-4 text-left p-8 bg-stone-50 rounded-3xl mb-8 border border-stone-100">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
              <span>Couverts</span>
              <span className="text-stone-900">{formState.guests} Personnes</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
              <span>Référence</span>
              <span className="text-amber-600 font-mono">ECLAT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
            </div>
          </div>
          <button 
            onClick={() => { setSubmitted(false); setStep(1); setFormState({ ...formState, time: '', name: '', email: '', date: '' }); }}
            className="w-full py-5 bg-stone-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl"
          >
            Nouvelle Réservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="w-12 h-0.5 bg-amber-500"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 shimmer-text">Expériences Privées</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-serif font-bold leading-tight text-stone-900 tracking-tighter">Réserver votre <br /> instant de grâce.</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Colonne Gauche : Ambiance & Infos */}
        <div className="lg:sticky lg:top-40 space-y-12">
          <div className="bg-stone-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 stitched-card">
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-4 bg-amber-600 rounded-2xl shadow-xl shadow-amber-600/20"><Star className="w-8 h-8" /></div>
                   <div>
                      <h4 className="text-2xl font-serif font-bold">L'Exclusivité</h4>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Un service sur-mesure</p>
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="flex items-start gap-6">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-500"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-sm">Emplacement de Choix</p>
                        <p className="text-stone-400 text-xs mt-1">Choisissez entre notre salle panoramique ou le jardin d'hiver.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-500"><Phone className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-sm">Conciergerie Dédiée</p>
                        <p className="text-stone-400 text-xs mt-1">Pour toute demande particulière, notre équipe est à votre écoute.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-500"><MessageCircle className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-sm">Confirmation Directe</p>
                        <p className="text-stone-400 text-xs mt-1">Recevez un récapitulatif instantané de votre réservation.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex gap-4">
             <Info className="w-6 h-6 text-amber-600 shrink-0" />
             <p className="text-xs text-amber-800 leading-relaxed font-medium italic">
               "Chaque table est dressée avec le plus grand soin 15 minutes avant votre arrivée pour vous garantir une immersion totale dès le premier regard."
             </p>
          </div>
        </div>

        {/* Colonne Droite : Formulaire */}
        <div>
          <div className="bg-white p-12 sm:p-16 rounded-[3.5rem] shadow-2xl border border-stone-100 relative paper-texture gold-liquid-border">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Date de visite</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-600 pointer-events-none" />
                    <input 
                      required
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={formState.date}
                      onChange={(e) => setFormState({...formState, date: e.target.value})}
                      className="w-full pl-14 pr-4 py-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Convives</label>
                  <div className="relative group">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-600 pointer-events-none" />
                    <select 
                      value={formState.guests}
                      onChange={(e) => setFormState({...formState, guests: e.target.value})}
                      className="w-full pl-14 pr-4 py-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-medium appearance-none"
                    >
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Personnes</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {formState.date && (
                <div className="space-y-8 pt-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Sélection de l'horaire</label>
                  {checkingAvailability ? (
                    <div className="flex items-center justify-center p-12">
                       <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {availableSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.time}
                          disabled={slot.status === 'Full'}
                          onClick={() => setFormState({...formState, time: slot.time})}
                          className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                            formState.time === slot.time 
                              ? 'bg-stone-900 border-stone-900 text-white shadow-xl scale-[1.02] border-dashed border-stone-300' 
                              : slot.status === 'Full'
                                ? 'bg-stone-50 border-stone-100 opacity-40 cursor-not-allowed'
                                : 'bg-white border-stone-100 hover:border-amber-500 hover:text-amber-600'
                          }`}
                        >
                          <span className="font-bold text-sm">{slot.time}</span>
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                            slot.status === 'Available' ? 'bg-green-500' : 'bg-amber-500'
                          }`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formState.time && (
                <div className="space-y-8 pt-10 border-t border-stone-100">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nom du Réservant</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input 
                          required
                          type="text" 
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          className="w-full pl-14 pr-4 py-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-medium"
                          placeholder="Ex: Jean Dupont"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email de Contact</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input 
                          required
                          type="email" 
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          className="w-full pl-14 pr-4 py-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-amber-500 transition-all font-medium"
                          placeholder="exemple@mail.com"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="brilliant-btn w-full py-6 bg-stone-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 group"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmer la Demande'}
                    {!isLoading && <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
