import { create } from 'zustand';

interface StoreState {
  isOnline: boolean;
  cart: any[];
  setOnlineStatus: (status: boolean) => void;
  addToCart: (product: any) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isOnline: navigator.onLine,
  cart: [],
  setOnlineStatus: (status) => set({ isOnline: status }),
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  clearCart: () => set({ cart: [] })
}));
