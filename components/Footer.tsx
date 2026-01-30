export default function Footer() {
    return (
        <footer className="bg-black py-12 border-t border-white/10 text-center relative z-10">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 bg-spectre-grey/20 rotate-45" />
                <p className="font-mono text-spectre-dark-grey text-[10px] tracking-[0.3em] uppercase">
                    © 2026 Spectre Keyboards. Designed in the Void.
                </p>
            </div>
        </footer>
    )
}
