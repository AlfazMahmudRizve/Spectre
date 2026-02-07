import { create } from 'zustand';
import { Product } from '@/types/product';

interface ProductState {
    products: Product[];
    activeProduct: Product | null;
    view: 'product' | 'grid'; // 'product' shows 3D sequence, 'grid' shows static accessories
    hasIntroPlayed: boolean;
    setProducts: (products: Product[]) => void;
    setActiveProduct: (id: string) => void;
    setView: (view: 'product' | 'grid') => void;
    setHasIntroPlayed: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [], // Initial empty state
    activeProduct: null,
    view: 'product',
    hasIntroPlayed: false,
    setProducts: (products) => set({ products, activeProduct: products[0] }), // Auto-select first
    setActiveProduct: (id) => {
        const { products } = get();
        const product = products.find(p => p.id === id);
        if (product) {
            set({ activeProduct: product, view: 'product' }); // Switching product forces view to 'product'
        }
    },
    setView: (view) => set({ view }),
    setHasIntroPlayed: () => set({ hasIntroPlayed: true })
}));
