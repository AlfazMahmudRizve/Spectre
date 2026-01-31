
export interface ProductSpec {
    layout: string;
    switch: string;
    material: string;
    actuation: string;
    connectivity: string;
}

export interface Product {
    id: string;
    name: string;
    tagline: string;
    price: number;
    folder: string;         // Folder containing 0.webp - 119.webp
    mobileVideo: string;    // Mobile optimized video path
    accentColor: string;    // Hex color
    specs: ProductSpec;
}

export const products: Product[] = [
    {
        id: 'spectre-one',
        name: 'SPECTRE ONE',
        tagline: 'THE ORIGINAL.',
        price: 299,
        folder: '/images/spectre-one',
        mobileVideo: '/videos/cyber_mobile.mp4', // Placeholder: using cyber for now
        accentColor: '#00F0FF', // Cyan
        specs: {
            layout: '65%',
            switch: 'Tactile',
            material: 'Aluminum',
            actuation: '45g',
            connectivity: 'Tri-Mode'
        }
    },
    {
        id: 'spectre-carbon',
        name: 'SPECTRE CARBON',
        tagline: 'PURE STEALTH.',
        price: 349,
        folder: '/images/spectre-carbon',
        mobileVideo: '/videos/cyber_mobile.mp4', // Placeholder
        accentColor: '#10b981', // Emerald/Carbon Green
        specs: {
            layout: '65%',
            switch: 'Linear',
            material: 'Carbon Fiber',
            actuation: '35g',
            connectivity: 'Tri-Mode'
        }
    }
];
