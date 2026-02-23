'use client';
import { useState } from 'react';
import { useSound } from './SoundManager';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { ShoppingBag, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import GhostButton from './ui/GhostButton';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
    const { playHover, playClick, isMuted, toggleMute } = useSound();
    const { setActiveProduct, setView } = useProductStore();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogoClick = () => {
        playClick();
        setView('product');
        setActiveProduct('spectre-carbon');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileOpen(false);
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

    if (session?.user?.role === 'admin') {
        navLinks.push({
            label: 'DASHBOARD',
            action: () => {
                window.location.href = '/dashboard';
            }
        });
    }

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-black/70 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                    onMouseEnter={playHover}
                    onClick={handleLogoClick}
                >
                    <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                        <Image
                            src="/images/logo.png"
                            alt="Spectre Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-all duration-300"
                        />
                    </div>
                    <span className="font-grotesk font-bold text-lg md:text-xl tracking-[0.2em] text-white group-hover:text-[#00F0FF] transition-colors duration-300">
                        SPECTRE
                    </span>
                </div>

                {/* Desktop Nav Links */}
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
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mute Toggle — desktop only */}
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
                        <ShoppingBag size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                        {useCartStore((state) => state.cart.length > 0) && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#00F0FF] rounded-full shadow-[0_0_8px_#00F0FF]" />
                        )}
                    </GhostButton>

                    {/* Auth — desktop */}
                    <div className="hidden md:flex items-center">
                        {session ? (
                            <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mr-2">
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

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                        onClick={() => { setMobileOpen(!mobileOpen); playClick(); }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-0 top-[56px] z-40 bg-black/95 backdrop-blur-xl flex flex-col md:hidden"
                    >
                        <div className="flex flex-col gap-1 p-6 pt-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => { playClick(); link.action(); setMobileOpen(false); }}
                                    className="text-left text-sm font-mono tracking-widest text-gray-300 hover:text-[#00F0FF] py-4 border-b border-white/5 transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Auth */}
                        <div className="mt-auto p-6 border-t border-white/10">
                            {session ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                        <User size={14} />
                                        <span className="truncate max-w-[150px]">{session.user?.name || session.user?.email}</span>
                                    </div>
                                    <button
                                        onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }}
                                        className="text-xs font-mono text-red-400 hover:text-red-300 tracking-widest"
                                    >
                                        LOGOUT
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full text-center py-3 font-mono tracking-widest text-sm text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 transition-colors"
                                >
                                    LOGIN
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
