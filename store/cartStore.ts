import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    edition: string;
}

interface CartState {
    cart: CartItem[];
    isOpen: boolean;
    toggleCart: () => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    addDummyItem: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            isOpen: false,
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            addToCart: (item) =>
                set((state) => {
                    const existing = state.cart.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            cart: state.cart.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                            isOpen: true, // Open cart on add
                        };
                    }
                    return { cart: [...state.cart, item], isOpen: true };
                }),
            removeFromCart: (id) =>
                set((state) => ({
                    cart: state.cart.filter((i) => i.id !== id),
                })),
            updateQuantity: (id, delta) =>
                set((state) => ({
                    cart: state.cart
                        .map((i) =>
                            i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
                        )
                        .filter((i) => i.quantity > 0),
                })),
            addDummyItem: () =>
                set((state) => {
                    const id = Math.random().toString(36).substr(2, 9);
                    return {
                        cart: [
                            ...state.cart,
                            {
                                id,
                                name: 'SPECTRE ONE',
                                price: 299,
                                image: '/spectre-render.png', // Placeholder
                                quantity: 1,
                                edition: 'CYBER EDITION',
                            },
                        ],
                        isOpen: true,
                    };
                }),
        }),
        {
            name: 'spectre-cart-storage',
        }
    )
);
