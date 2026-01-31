import { create } from 'zustand';
import { Product, products } from '@/data/products';

interface ProductState {
    activeProduct: Product;
    setActiveProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    activeProduct: products[0], // Default to Spectre One
    setActiveProduct: (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            set({ activeProduct: product });
        }
    }
}));
