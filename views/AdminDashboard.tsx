
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ShoppingBag, Users, TrendingUp, DollarSign, Calendar, Utensils, 
  ChartBar, CheckCircle, XCircle, Clock, Edit3, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { MENU_ITEMS } from '../constants';

const salesData = [
  { name: 'Lun', revenue: 4500 },
  { name: 'Mar', revenue: 5200 },
  { name: 'Mer', revenue: 4800 },
  { name: 'Jeu', revenue: 6100 },
  { name: 'Ven', revenue: 8900 },
  { name: 'Sam', revenue: 9500 },
  { name: 'Dim', revenue: 7800 },
];

const mockReservations = [
  { id: '1', name: 'Jean-Pierre Laurent', date: '2024-05-20', time: '20:00', guests: 4, status: 'Confirmé' },
  { id: '2', name: 'Sophie Bernard', date: '2024-05-20', time: '19:30', guests: 2, status: 'Confirmé' },
  { id: '3', name: 'Marc Antoine', date: '2024-05-21', time: '21:00', guests: 6, status: 'En attente' },
  { id: '4', name: 'Famille Durand', date: '2024-05-21', time: '12:30', guests: 8, status: 'Annulé' },
  { id: '5', name: 'Lucie Meunier', date: '2024-05-22', time: '20:15', guests: 2, status: 'En attente' },
  { id: '6', name: 'Thomas Dubois', date: '2024-05-22', time: '19:00', guests: 3, status: 'Confirmé' },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'reservations' | 'menu'>('stats');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(mockReservations.length / itemsPerPage);
  const currentReservations = mockReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-0.5 bg-amber-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Gestion Interne</span>
           </div>
          <h2 className="text-5xl font-serif font-bold text-stone-900 tracking-tighter">Administration</h2>
        </div>
        <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex items-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'stats' ? 'bg-white text-stone-900 shadow-md border-dashed border-stone-300' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
          >
            <ChartBar className="w-3.5 h-3.5 mr-2" /> Analyses
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'reservations' ? 'bg-white text-stone-900 shadow-md border-dashed border-stone-300' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
          >
            <Calendar className="w-3.5 h-3.5 mr-2" /> Réservations
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex items-center px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'menu' ? 'bg-white text-stone-900 shadow-md border-dashed border-stone-300' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
          >
            <Utensils className="w-3.5 h-3.5 mr-2" /> Carte
          </button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Revenu Hebdo', value: '46,800€', icon: <DollarSign />, color: 'amber' },
              { label: 'Commandes', value: '1,195', icon: <ShoppingBag />, color: 'stone' },
              { label: 'Visiteurs', value: '842', icon: <Users />, color: 'amber' },
              { label: 'Ticket Moyen', value: '39.16€', icon: <TrendingUp />, color: 'stone' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm paper-texture gold-liquid-border">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-stone-50 text-amber-600 shadow-sm`}>
                  {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
                </div>
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <h4 className="text-4xl font-black text-stone-900 tracking-tighter">{stat.value}</h4>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-sm paper-texture">
              <h3 className="text-2xl font-bold font-serif mb-12">Performance Commerciale</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 'bold'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: '#fafaf9'}}
                    />
                    <Bar dataKey="revenue" fill="#d97706" radius={[12, 12, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-sm paper-texture">
              <h3 className="text-2xl font-bold mb-12 font-serif">Plats Vedettes</h3>
              <div className="space-y-10">
                {MENU_ITEMS.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-stone-900">{Math.floor(Math.random() * 80) + 40}</p>
                      <p className="text-[8px] text-green-500 font-black uppercase tracking-tighter mt-1">Ventes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="bg-white rounded-[3.5rem] border border-stone-100 shadow-sm overflow-hidden paper-texture gold-liquid-border">
          <div className="p-12 border-b border-stone-100 bg-stone-50/30 flex justify-between items-center">
            <h3 className="text-3xl font-serif font-bold tracking-tight">Registre des Convives</h3>
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-stone-200">
               <AlertTriangle className="w-4 h-4 text-amber-600" />
               <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Données Locales (Simulation)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] border-b border-stone-100">
                  <th className="px-12 py-8">Client</th>
                  <th className="px-8 py-8 text-center">Date & Heure</th>
                  <th className="px-8 py-8 text-center">Couverts</th>
                  <th className="px-8 py-8">Statut</th>
                  <th className="px-12 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {currentReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center font-black text-stone-600 border border-stone-200 uppercase">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-stone-900 text-base">{res.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-10">
                      <div className="text-center">
                        <p className="font-black text-stone-900 text-sm">{res.date}</p>
                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-1">{res.time}</p>
                      </div>
                    </td>
                    <td className="px-8 py-10 text-center font-black text-xl text-stone-900">
                      {res.guests}
                    </td>
                    <td className="px-8 py-10">
                      <span className={`inline-flex items-center px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        res.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        res.status === 'En attente' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {res.status === 'Confirmé' && <CheckCircle className="w-3.5 h-3.5 mr-2" />}
                        {res.status === 'En attente' && <Clock className="w-3.5 h-3.5 mr-2" />}
                        {res.status === 'Annulé' && <XCircle className="w-3.5 h-3.5 mr-2" />}
                        {res.status}
                      </span>
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-amber-600 transition-all shadow-md">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-rose-600 transition-all shadow-md">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-12 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Base de données interne active</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentPage(1)} className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-900 transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentPage(1)} className="p-4 rounded-2xl border border-stone-900 bg-stone-900 text-white font-black text-xs">1</button>
              <button onClick={() => setCurrentPage(1)} className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-900 transition-all"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
