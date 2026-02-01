'use client';

import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00F0FF] selection:text-black relative">
            {/* Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8">
                            <Image src="/images/logo.png" alt="Spectre" fill className="object-contain" />
                        </div>
                        <span className="font-grotesk font-bold text-lg tracking-widest group-hover:text-[#00F0FF] transition-colors">SPECTRE</span>
                    </Link>

                    <div className="flex items-center gap-2 text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
                        <Lock size={14} />
                        <span className="font-mono text-[10px] font-bold tracking-wider">SECURE_CONNECTION</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7">
                        <div className="mb-8">
                            <nav className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-4">
                                <span className="hover:text-white cursor-pointer transition-colors">CART</span>
                                <span>/</span>
                                <span className="text-[#00F0FF]">TERMINAL</span>
                                <span>/</span>
                                <span className="opacity-50">EXECUTE</span>
                            </nav>
                            <h1 className="text-3xl md:text-4xl font-grotesk font-bold mb-2">SECURE CHECKOUT</h1>
                            <p className="text-gray-400 text-sm">Complete the encrypted form below to authorize procurement.</p>
                        </div>

                        <CheckoutForm />
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-12">
                            <OrderSummary />

                            {/* Trust Signals */}
                            <div className="mt-6 grid grid-cols-2 gap-4 opacity-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-px bg-white/20" />
                                    <span className="text-[10px] font-mono text-gray-500">256-BIT SSL</span>
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-[10px] font-mono text-gray-500">ENCRYPTED</span>
                                    <div className="w-8 h-px bg-white/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Minimal */}
            <footer className="py-8 text-center border-t border-white/5 mt-20 relative z-10 bg-black">
                <p className="text-[10px] font-mono text-gray-600">
                    © 2077 SPECTRE INDUSTRIES. ALL RIGHTS RESERVED. <br />
                    SECURE TERMINAL ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
            </footer>
        </div>
    );
}
