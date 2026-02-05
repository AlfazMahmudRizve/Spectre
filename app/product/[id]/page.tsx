import { getProducts } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Shield, Truck, Zap } from 'lucide-react';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton'; // We'll create a client component for this

// Generate Static Params for SSG/ISR
export async function generateStaticParams() {
    const products = await getProducts();
    // Exclude the hero products if they don't have detail pages yet, 
    // or include them if we want pages for them too.
    return products.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const products = await getProducts();
    const product = products.find(p => p.id === params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-[#00F0FF] selection:text-black">
            {/* Header */}
            <header className="fixed top-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Link href="/" className="pointer-events-auto flex items-center gap-2 group text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    RETURN TO BASE
                </Link>
            </header>

            <div className="max-w-7xl mx-auto pt-32 pb-20 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[80vh]">
                {/* Left: Image */}
                <div className="relative aspect-square w-full max-w-lg mx-auto bg-white/5 rounded-2xl border border-white/10 overflow-hidden group">
                    <div className="absolute inset-0 bg-[#00F0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Image
                        src={product.image || '/images/spectre-one/20.webp'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    {/* Data Overlay */}
                    <div className="absolute bottom-6 left-6 flex gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
                        <div className="bg-black/80 backdrop-blur px-3 py-1 border border-white/10 rounded">
                            ID: {product.id.slice(0, 8)}
                        </div>
                        <div className="bg-black/80 backdrop-blur px-3 py-1 border border-white/10 rounded">
                            STOCK: {product.stock > 0 ? 'AVAILABLE' : 'DEPLETED'}
                        </div>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-grotesk font-bold text-white mb-2">{product.name}</h1>
                        <p className="text-xl text-[#00F0FF] font-mono">${product.price}</p>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-mono leading-relaxed">
                        <p>{product.description || "No classified data available for this asset."}</p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Shield size={14} className="text-[#00F0FF]" />
                            MIL-SPEC DURABILITY VERIFIED
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Zap size={14} className="text-[#00F0FF]" />
                            NEXT-GEN PERFORMANCE TUNED
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Truck size={14} className="text-[#00F0FF]" />
                            GLOBAL SECURE SHIPPING
                        </div>
                    </div>

                    <div className="pt-8">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
