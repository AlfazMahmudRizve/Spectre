'use client';

import { useState } from 'react';
import { Lock, Cpu, User, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Success
                window.location.href = '/login?registered=true';
            } else {
                setError(data.error || 'REGISTRATION FAILED');
                setLoading(false);
            }
        } catch (err) {
            setError('Is System Offline?');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                    >
                        <User className="text-[#00F0FF]" size={24} />
                        <div className="absolute inset-0 bg-[#00F0FF]/20 rounded-full blur-xl animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl font-grotesk font-bold text-white tracking-widest">NEW OPERATIVE</h1>
                    <p className="text-xs font-mono text-gray-500 mt-2">CREATE IDENTITY // JOIN_NETWORK</p>
                </div>

                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50" />

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center gap-2">
                            <AlertCircle size={12} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase">Operative Alias (Name)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-600" size={14} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 pl-9 text-xs font-mono text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                                    placeholder="V. Silverhand"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase">Comm Link (Email)</label>
                            <div className="relative">
                                <Cpu className="absolute left-3 top-3 text-gray-600" size={14} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 pl-9 text-xs font-mono text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                                    placeholder="runner@nightcity.net"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase">Access Key (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-600" size={14} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 pl-9 text-xs font-mono text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-bold font-mono text-xs py-3 rounded tracking-widest transition-all ${loading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {loading ? 'ENCRYPTING...' : 'INITIALIZE'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-[10px] font-mono text-gray-400 hover:text-[#00F0FF] transition-colors flex items-center justify-center gap-1 group">
                            ALREADY AN OPERATIVE? <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
