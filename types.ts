
export type Category = 'Starters' | 'Mains' | 'Desserts' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  aiImage?: string;
  generationPrompt: string;
  calories: number;
  isVegetarian: boolean;
}

export interface MealOption {
  id: string;
  label: string;
  price?: number;
}

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface SelectedOptions {
  cuisson?: string;
  accompagnement?: string;
  extras?: string[]; // Storing labels or IDs of selected extras
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  selectedOptions: SelectedOptions;
  quantity: number;
  totalPrice?: number; // Calculated price with extras
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Received' | 'Preparing' | 'Out for Delivery' | 'Completed';
  timestamp: string;
}
