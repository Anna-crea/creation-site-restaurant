
import React from 'react';

interface MenuFilterProps {
  activeCategory: string;
  onFilterChange: (category: string) => void;
}

export const MenuFilter: React.FC<MenuFilterProps> = ({ activeCategory, onFilterChange }) => {
  const categories = [
    { id: 'All', label: 'Tout' },
    { id: 'Starters', label: 'Entrées' },
    { id: 'Mains', label: 'Plats' },
    { id: 'Desserts', label: 'Desserts' },
    { id: 'Drinks', label: 'Boissons' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.id)}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
            activeCategory === cat.id
              ? 'bg-stone-900 text-white border-dashed border-stone-300 shadow-2xl scale-105'
              : 'bg-white text-stone-500 border-stone-100 hover:border-amber-500 hover:text-amber-600'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
