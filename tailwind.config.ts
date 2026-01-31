import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'spectre-black': '#000000',
                'spectre-cyan': '#00F0FF',
                'spectre-grey': '#1A1A1A',
                'spectre-dark-grey': '#888888',
            },
            fontFamily: {
                grotesk: ['var(--font-space-grotesk)'],
                inter: ['var(--font-inter)'],
            },
        },
    },
    plugins: [],
};
export default config;
