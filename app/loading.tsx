export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Pulse */}
            <div className="absolute inset-0 bg-spectre-green/5 animate-pulse" />

            {/* Central Loader */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-spectre-green/30 border-t-spectre-green rounded-full animate-spin" />
                <h2 className="text-spectre-green font-mono text-sm tracking-[0.2em] animate-pulse">
                    INITIALIZING_SYSTEM
                </h2>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
    );
}
