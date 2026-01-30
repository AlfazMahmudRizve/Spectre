'use client';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none select-none">
            <div className="flex items-center gap-2 pointer-events-auto cursor-pointer group">
                <div className="w-6 h-6 bg-spectre-cyan rounded-sm shadow-[0_0_10px_#00F0FF] group-hover:scale-110 transition-transform duration-300" />
                <span className="font-grotesk font-bold text-xl tracking-widest group-hover:text-spectre-cyan transition-colors">SPECTRE</span>
            </div>
            <div className="hidden md:flex gap-10 font-mono text-xs pointer-events-auto">
                {['SPECS', 'GALLERY', 'SUPPORT'].map((item) => (
                    <a key={item} href="#" className="hover:text-spectre-cyan transition-colors tracking-[0.2em] relative group">
                        {item}
                        <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-spectre-cyan group-hover:w-full transition-all duration-300" />
                    </a>
                ))}
            </div>
            <button className="hidden md:block pointer-events-auto px-6 py-2 border border-white/20 bg-white/5 hover:bg-spectre-cyan hover:text-black hover:border-spectre-cyan transition-all duration-300 font-mono text-xs tracking-widest backdrop-blur-md">
                PRE-ORDER
            </button>
        </nav>
    )
}
