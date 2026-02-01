'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, CheckCircle, Cpu, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

type FormData = {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
};

export default function CheckoutForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { cart } = useCartStore();

    const onSubmit = async (data: FormData) => {
        setIsProcessing(true);

        try {
            const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    total: subtotal,
                    email: data.email,
                    shippingDetails: data
                })
            });

            const result = await response.json();

            if (result.success) {
                setIsProcessing(false);
                setIsSuccess(true);
                // Optionally clear cart here
                useCartStore.getState().cart.forEach(item => useCartStore.getState().removeFromCart(item.id));
            } else {
                alert('TRANSACTION FAILED');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-black/40 border border-[#00F0FF]/30 p-12 text-center rounded-lg backdrop-blur-md relative overflow-hidden"
            >
                {/* Background Grid Animation */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-24 h-24 mb-8 text-[#00F0FF]"
                    >
                        <ShieldCheck size={96} strokeWidth={1} />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-grotesk font-bold text-white mb-4 tracking-tight">EQUIPMENT SECURED</h2>
                    <p className="font-mono text-[#00F0FF] mb-8">ORDER_ID: #SPC-2077-{Math.floor(Math.random() * 999)}</p>

                    <div className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed border-t border-white/10 pt-8">
                        MISSION BRIEF_
                        <br /><br />
                        Your requisitions have been logged in the secure manufacturing queue.
                        You will receive an encrypted transmission (email) containing tracking protocols shortly.
                        <br /><br />
                        <span className="text-white">WELCOME TO THE ELITE.</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/'}
                        className="mt-12 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-mono text-xs tracking-[0.2em] transition-all"
                    >
                        RETURN_TO_BASE
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-[#00F0FF]/80">
                    <Cpu size={16} />
                    <h3 className="font-mono text-sm tracking-wider">CONTACT_PROTOCOL</h3>
                </div>
                <InputGroup
                    label="EMAIL ADDRESS"
                    id="email"
                    register={register}
                    required
                    error={errors.email}
                    placeholder="operative@spectre.net"
                />
            </section>

            {/* Shipping */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-[#00F0FF]/80">
                    <div className="w-4 h-4 border border-current rounded-full flex items-center justify-center text-[10px]">2</div>
                    <h3 className="font-mono text-sm tracking-wider">DROP_COORDINATES</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="FIRST NAME" id="firstName" register={register} required error={errors.firstName} />
                    <InputGroup label="LAST NAME" id="lastName" register={register} required error={errors.lastName} />
                </div>
                <InputGroup label="ADDRESS" id="address" register={register} required error={errors.address} />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="CITY" id="city" register={register} required error={errors.city} />
                    <InputGroup label="ZIP / POSTAL" id="zip" register={register} required error={errors.zip} />
                </div>
                <InputGroup label="COUNTRY" id="country" register={register} required error={errors.country} />
            </section>

            {/* Payment */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-[#00F0FF]/80">
                    <CreditCard size={16} />
                    <h3 className="font-mono text-sm tracking-wider">PAYMENT_GATEWAY</h3>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded mb-4 flex items-center gap-3">
                    <Lock size={16} className="text-[#00F0FF]" />
                    <span className="text-xs text-gray-400 font-mono">256-BIT ENCRYPTED CONNECTION ESTABLISHED</span>
                </div>
                <InputGroup label="CARD NUMBER" id="cardNumber" register={register} required error={errors.cardNumber} placeholder="0000 0000 0000 0000" />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="EXPIRY (MM/YY)" id="expiry" register={register} required error={errors.expiry} />
                    <InputGroup label="CVC" id="cvc" register={register} required error={errors.cvc} />
                </div>
            </section>

            {/* Authorize Button */}
            <button
                type="submit"
                disabled={isProcessing}
                className={`w-full relative overflow-hidden h-14 bg-gradient-to-r from-[#00F0FF] to-[#00C0CC] text-black font-bold font-mono tracking-widest text-lg transition-all
                    ${isProcessing ? 'opacity-80 cursor-wait' : 'hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-[1.01] active:scale-[0.99]'}
                `}
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                        <span className="animate-pulse">COMPILING_TRANSACTION...</span>
                        <div className="h-1 w-24 bg-black/20 overflow-hidden">
                            <motion.div
                                className="h-full bg-black/50"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "linear" }}
                            />
                        </div>
                    </div>
                ) : (
                    "AUTHORIZE TRANSACTON"
                )}
            </button>
        </form>
    );
}

// Reusable Input Component
const InputGroup = ({ label, id, register, required, error, placeholder }: any) => (
    <div className="relative group">
        <input
            {...register(id, { required })}
            placeholder={placeholder}
            className={`peer w-full bg-black/50 border ${error ? 'border-red-500' : 'border-white/10'} hover:border-white/30 focus:border-[#00F0FF] rounded-sm py-3 px-4 text-white placeholder-transparent focus:outline-none transition-all font-mono text-sm`}
        />
        <label
            htmlFor={id}
            className={`absolute left-4 top-3 text-[10px] text-gray-500 transition-all pointer-events-none
                peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-500
                peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#00F0FF] peer-focus:bg-black peer-focus:px-1
                ${!placeholder && 'peer-valid:-top-2.5 peer-valid:text-[10px] peer-valid:bg-black peer-valid:px-1'}
            `}
        >
            {label}
        </label>
        {error && <span className="absolute right-2 top-3.5 text-[10px] text-red-500 font-mono">INVALID_INPUT</span>}
    </div>
);
