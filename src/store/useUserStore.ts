import { create } from "zustand";

/* ---------------- User Store ---------------- */
type UserStore = {
  user: boolean;
  setUser: (value: boolean) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: false,
  setUser: (value) => set({ user: value }),
  logout: () => set({ user: false }),
}));

/* ---------------- Cart Store ---------------- */
export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  rating?: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    })),

  clearCart: () => set({ cart: [] }),
}));

/* ---------------- Wishlist Store ---------------- */
export type ProductItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  rating?: number;
  description?: string;
};

type WishStore = {
  wishlist: ProductItem[];
  addToWishlist: (item: ProductItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
};

export const useWishStore = create<WishStore>((set, get) => ({
  wishlist: [],

  addToWishlist: (item) =>
    set((state) => {
      const exists = state.wishlist.some((i) => i.id === item.id);
      if (exists) return state; // avoid duplicates
      return { wishlist: [...state.wishlist, item] };
    }),

  removeFromWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    })),

  clearWishlist: () => set({ wishlist: [] }),

  isInWishlist: (id) => get().wishlist.some((item) => item.id === id),
}));
