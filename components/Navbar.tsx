'use client';
import { useSound } from './SoundManager';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { ShoppingBag, LogIn, LogOut, User } from 'lucide-react';
import GhostButton from './ui/GhostButton';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
    const { playHover, playClick, isMuted, toggleMute } = useSound();
    const { setActiveProduct, setView } = useProductStore();
    const { data: session } = useSession();

    const handleLogoClick = () => {
        playClick();
        setView('product');
        setActiveProduct('spectre-carbon'); // Reset to default
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navLinks = [
        {
            label: 'HEADSET',
            action: () => {
                setActiveProduct('spectre-carbon');
                setView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        {
            label: 'KEYBOARD',
            action: () => {
                setActiveProduct('spectre-one');
                setView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        {
            label: 'PRODUCTS',
            action: () => {
                setView('grid');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
    ];

    // @ts-ignore
    if (session?.user?.role === 'admin') {
        navLinks.push({
            label: 'DASHBOARD',
            action: () => {
                window.location.href = '/dashboard';
            }
        });
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
            {/* Logo */}

            <div
                className="flex items-center gap-3 cursor-pointer group"
                onMouseEnter={playHover}
                onClick={handleLogoClick}
            >
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <Image
                        src="/images/logo.png"
                        alt="Spectre Logo"
                        fill
                        className="object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-all duration-300"
                    />
                </div>
                <span className="font-grotesk font-bold text-xl tracking-[0.2em] text-white group-hover:text-[#00F0FF] transition-colors duration-300">
                    SPECTRE
                </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex gap-8">
                {navLinks.map((link) => (
                    <button
                        key={link.label}
                        onClick={() => { playClick(); link.action(); }}
                        className="text-xs font-mono tracking-widest text-gray-400 hover:text-white transition-colors relative group"
                    >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00F0FF] group-hover:w-full transition-all duration-300" />
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Mute Toggle */}
                <GhostButton
                    variant="ghost"
                    size="sm"
                    onClick={() => { toggleMute(); playClick(); }}
                    className="text-xs hidden md:flex"
                >
                    {isMuted ? '[UNMUTE]' : '[MUTE]'}
                </GhostButton>

                {/* Cart Toggle */}
                <GhostButton
                    variant="ghost"
                    size="sm"
                    onClick={() => { useCartStore.getState().toggleCart(); playClick(); }}
                    className="relative group"
                >
                    <ShoppingBag size={20} className="text-gray-300 group-hover:text-white transition-colors" />
                    {useCartStore((state) => state.cart.length > 0) && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#00F0FF] rounded-full shadow-[0_0_8px_#00F0FF]" />
                    )}
                </GhostButton>

                {/* Auth Actions */}
                {session ? (
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-400 mr-2">
                            <User size={12} />
                            <span className="truncate max-w-[100px]">{session.user?.name || session.user?.email}</span>
                        </div>
                        <GhostButton
                            variant="ghost"
                            size="sm"
                            onClick={() => { signOut({ callbackUrl: '/' }); playClick(); }}
                            className="text-gray-400 hover:text-red-500"
                            title="LOGOUT"
                        >
                            <LogOut size={16} />
                        </GhostButton>
                    </div>
                ) : (
                    <Link href="/login" onClick={playClick}>
                        <GhostButton
                            variant="ghost"
                            size="sm"
                            className="text-xs font-mono tracking-widest text-[#00F0FF] border border-[#00F0FF]/20 hover:bg-[#00F0FF]/10 ml-2"
                        >
                            LOGIN
                        </GhostButton>
                    </Link>
                )}
            </div>
        </nav>
    );
}
