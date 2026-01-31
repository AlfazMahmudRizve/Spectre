'use client';
import { motion } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';
import { useEditionStore } from '@/store/editionStore';

interface GhostButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'ghost' | 'outline' | 'solid';
    size?: 'sm' | 'md' | 'lg';
    strength?: number; // For magnetic effect
}

export default function GhostButton({
    children,
    onClick,
    className = '',
    variant = 'outline',
    size = 'md',
    strength = 30
}: GhostButtonProps) {
    const { config } = useEditionStore();
    const accentColor = config.colors.primary;
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const x = (clientX - centerX) / strength;
        const y = (clientY - centerY) / strength;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    // Variant Styles
    const baseStyles = "relative font-mono tracking-widest transition-all duration-300 backdrop-blur-md flex items-center justify-center group overflow-hidden";

    const sizeStyles = {
        sm: "px-4 py-1 text-xs",
        md: "px-6 py-2 text-xs",
        lg: "px-8 py-3 text-sm"
    };

    const variantStyles = {
        ghost: "bg-transparent hover:text-[var(--accent)]",
        outline: "border border-white/20 bg-white/5 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]",
        solid: "bg-[var(--accent)] text-black border border-[var(--accent)] hover:bg-white hover:text-black hover:border-white"
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            style={{ '--accent': accentColor } as React.CSSProperties}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Glow Effect for Outline/Ghost */}
            {variant !== 'solid' && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, ${accentColor}20 0%, transparent 70%)`
                    }}
                />
            )}
        </motion.button>
    );
}
