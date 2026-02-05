'use client';

import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '/images/spectre-one/20.webp',
            quantity: 1,
            edition: 'STANDARD ISSUE'
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`w-full md:w-auto px-8 py-4 bg-[#00F0FF] hover:bg-white text-black font-bold font-mono text-sm rounded flex items-center justify-center gap-3 transition-all ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
            <ShoppingCart size={18} />
            {product.stock <= 0 ? 'OUT OF STOCK' : added ? 'ASSET SECURED' : 'ADD TO CART'}
        </button>
    );
}
