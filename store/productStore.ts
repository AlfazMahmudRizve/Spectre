import { create } from 'zustand';
import { Product, products } from '@/data/products';

interface ProductState {
    activeProduct: Product;
    view: 'product' | 'grid'; // 'product' shows 3D sequence, 'grid' shows static accessories
    hasIntroPlayed: boolean;
    setActiveProduct: (id: string) => void;
    setView: (view: 'product' | 'grid') => void;
    setHasIntroPlayed: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    activeProduct: products[0], // Default to Spectre One
    view: 'product',
    hasIntroPlayed: false,
    setActiveProduct: (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            set({ activeProduct: product, view: 'product' }); // Switching product forces view to 'product'
        }
    },
    setView: (view) => set({ view }),
    setHasIntroPlayed: () => set({ hasIntroPlayed: true })
}));
