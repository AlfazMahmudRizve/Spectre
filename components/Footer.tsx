export default function Footer() {
    return (
        <footer className="bg-black py-12 border-t border-white/10 text-center relative z-10">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 bg-spectre-grey/20 rotate-45" />
                <p className="font-mono text-spectre-dark-grey text-[10px] tracking-[0.3em] uppercase">
                    © 2026 Spectre Keyboards. Designed in the Void.
                </p>
                <a
                    href="https://whoisalfaz.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] tracking-[0.2em] text-spectre-dark-grey/50 hover:text-spectre-cyan transition-colors duration-300"
                >
                    DESIGNED & DEVELOPED BY ALFAZ MAHMUD RIZVE
                </a>
            </div>
        </footer>
    )
}
