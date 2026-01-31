'use client';
import { motion } from 'framer-motion';
import { useEditionStore, EditionId, editionConfigs } from '@/store/editionStore';

export default function EditionSelector() {
    const { currentEdition, setEdition } = useEditionStore();

    const editions: EditionId[] = ['cyber', 'carbon', 'phantom'];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-4 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
                {editions.map((id) => {
                    const isActive = currentEdition === id;
                    const color = editionConfigs[id].colors.primary;

                    return (
                        <button
                            key={id}
                            onClick={() => setEdition(id)}
                            className="relative group w-12 h-12 flex items-center justify-center"
                        >
                            {/* Active Glow Ring */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-ring"
                                    className="absolute inset-0 rounded-full border-2"
                                    style={{ borderColor: color, boxShadow: `0 0 15px ${color}` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            )}

                            {/* Inner Circle */}
                            <div
                                className="w-8 h-8 rounded-full transition-all duration-300 relative z-10"
                                style={{
                                    backgroundColor: isActive ? color : 'rgba(255,255,255,0.1)',
                                    scale: isActive ? 1 : 0.8
                                }}
                            >
                                {/* Tooltip on Hover */}
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-white/10 pointer-events-none whitespace-nowrap">
                                    {editionConfigs[id].name}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
