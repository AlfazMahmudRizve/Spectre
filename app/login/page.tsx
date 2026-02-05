'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { Lock, Cpu, Chrome, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                console.error("Login Error:", res.error);
                setError(`ACCESS DENIED: ${res.error}`);
                setLoading(false);
            } else {
                // Successful Login

                // Universal Redirect: Everyone goes to Home
                // Admins will see the Dashboard link in the Navbar
                window.location.assign('/');

                // Fallback in UI if it hangs
                setError('REDIRECTING... CLICK HERE IF STUCK');
                // @ts-ignore
                if (window) window.dashboardFallback = () => window.location.href = '/';
            }
        } catch (err) {
            console.error("Sign In Exception:", err);
            setError('SYSTEM ERROR: SEE CONSOLE');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                    >
                        <Lock className="text-[#00F0FF]" size={24} />
                        <div className="absolute inset-0 bg-[#00F0FF]/20 rounded-full blur-xl animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl font-grotesk font-bold text-white tracking-widest">MAINFRAME ACCESS</h1>
                    <p className="text-xs font-mono text-gray-500 mt-2">SECURE GATEWAY // ADMIN_ONLY</p>
                </div>

                {/* Terminal Card */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50" />

                    {error && (
                        <div
                            onClick={() => error.includes('REDIRECTING') ? window.location.href = '/dashboard' : null}
                            className={`mb-6 p-3 border text-xs font-mono flex items-center gap-2 ${error.includes('REDIRECTING') ? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-pointer hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}
                        >
                            <AlertCircle size={12} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-gray-500 uppercase">System ID (Email)</label>
                            <div className="relative">
                                <Cpu className="absolute left-3 top-3 text-gray-600" size={14} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 pl-9 text-xs font-mono text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                                    placeholder="admin@spectre.net"
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
                            {loading ? 'AUTHENTICATING...' : 'INITIATE SESSION'}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6 opacity-50">
                        <div className="h-px bg-white/20 flex-1" />
                        <span className="text-[10px] font-mono text-gray-500">OR</span>
                        <div className="h-px bg-white/20 flex-1" />
                    </div>

                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs py-3 rounded flex items-center justify-center gap-3 transition-all"
                    >
                        {/* Chrome icon as placeholder for Google */}
                        <Chrome size={14} />
                        ACCESS WITH GMAIL
                    </button>
                    <div className="mt-6 text-center">
                        <Link href="/signup" className="text-[10px] font-mono text-gray-400 hover:text-[#00F0FF] transition-colors flex items-center justify-center gap-1 group">
                            NEW HERE? CREATE IDENTITY <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
