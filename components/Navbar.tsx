'use client';
import { useSound } from './SoundManager';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { ShoppingBag } from 'lucide-react';
import GhostButton from './ui/GhostButton';

export default function Navbar() {
    const { playHover, playClick, isMuted, toggleMute } = useSound();
    const { activeProduct } = useProductStore();
    const accentColor = activeProduct.accentColor;

    return (
        <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white select-none pointer-events-none">
            {/* Logo */}
            <div
                className="flex items-center gap-2 pointer-events-auto cursor-pointer group"
                onMouseEnter={playHover}
                onClick={playClick}
            >
                <div
                    className="w-6 h-6 rounded-sm shadow-[0_0_10px_currentColor] group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: accentColor, color: accentColor }}
                />
                <span
                    className="font-grotesk font-bold text-xl tracking-widest transition-colors group-hover:text-[var(--accent)]"
                    style={{ '--accent': accentColor } as React.CSSProperties}
                >
                    SPECTRE
                </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex gap-4 font-mono text-xs pointer-events-auto">
                {['SPECS', 'GALLERY', 'SUPPORT'].map((item) => (
                    <GhostButton
                        key={item}
                        variant="ghost"
                        size="sm"
                        onClick={playClick}
                    >
                        {item}
                    </GhostButton>
                ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4 pointer-events-auto">
                {/* Mute Toggle */}
                <GhostButton
                    variant="ghost"
                    size="sm"
                    onClick={() => { toggleMute(); playClick(); }}
                    className="text-xs"
                >
                    {isMuted ? '[UNMUTE]' : '[MUTE]'}
                </GhostButton>

                {/* Cart Toggle */}
                <GhostButton
                    variant="ghost"
                    size="sm"
                    onClick={() => { useCartStore.getState().toggleCart(); playClick(); }}
                    className="relative"
                >
                    <ShoppingBag size={18} />
                    {useCartStore((state) => state.cart.length > 0) && (
                        <span
                            className="absolute top-1 right-1 w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]"
                            style={{ backgroundColor: accentColor, color: accentColor }}
                        />
                    )}
                </GhostButton>

                {/* Pre-Order Button */}
                <GhostButton
                    variant="outline"
                    size="md"
                    onClick={playClick}
                >
                    PRE-ORDER ${activeProduct.price}
                </GhostButton>
            </div>
        </nav>
    );
}
