
export interface ProductSpec {
    label: string;
    value: string;
}

export interface ProductPhase {
    title: string;
    subtitle: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    heroName: string; // e.g. "SPECTRE ONE" (Used in ModelSelector and Overlay)
    modelName: string; // e.g. "PRIME EDITION" (Used in Overlay) 
    tagline: string;
    subHeadline: string; // New field
    price: number;
    folder: string;
    fileExtension: string;
    frameCount: number; // New field
    accentColor: string;
    specs: ProductSpec[]; // Generic array
    phases: ProductPhase[]; // Storytelling phases
    visuals?: {
        yOffset?: number; // Shift image vertically (0-1 range relative to height)
        scale?: number;   // Zoom multiplier (1 = default)
        textAlignment?: 'left' | 'right'; // Force hero text side
        shadowOpacity?: number; // Custom shadow intensity
    };
}

export const products: Product[] = [
    {
        id: 'spectre-one',
        name: 'SPECTRE ONE',
        heroName: 'SPECTRE',
        modelName: 'ONE',
        tagline: 'THE ORIGINAL.',
        subHeadline: 'PRECISION ENGINEERED GASKET MOUNT. ACOUSTIC PERFECTION.',
        price: 299,
        folder: '/images/spectre-one',
        fileExtension: 'webp',
        frameCount: 218,
        accentColor: '#00F0FF',
        specs: [
            { label: 'LAYOUT', value: '65%' },
            { label: 'SWITCH', value: 'TACTILE' },
            { label: 'MATERIAL', value: 'ALUMINUM' },
            { label: 'ACTUATION', value: '45G' },
            { label: 'CONNECTIVITY', value: 'TRI-MODE' }
        ],
        phases: [
            {
                title: 'ZERO GRAVITY',
                subtitle: 'MOUNTING',
                description: 'PRECISION ENGINEERED GASKET SYSTEM ELIMINATES VIBRATION FOR PURE SOUND.'
            },
            {
                title: 'ACOUSTIC',
                subtitle: 'PERFECTION',
                description: 'LAYERED SOUND DAMPENING FOR THOCK.'
            },
            {
                title: 'READY?',
                subtitle: 'ASSEMBLE',
                description: 'JOIN THE CULT.'
            }
        ],
        visuals: {
            yOffset: 0,   // Reset to 0 for perfect centering
            scale: 0.95,  // Slight zoom out to fit, but keep it substantial
            textAlignment: 'left'
        }
    },
    {
        id: 'spectre-carbon',
        name: 'SPECTRE CARBON',
        heroName: 'SPECTRE', // Keeping generic brand
        modelName: 'CARBON', // Model
        tagline: 'FORGED IN SHADOW.',
        subHeadline: "THE WORLD'S FIRST FORGED CARBON FIBER CHASSIS WITH QUANTUM-LATENCY WIRELESS. LIGHTWEIGHT. INDESTRUCTIBLE. UNHEARD OF.",
        price: 349,
        folder: '/images/spectre-carbon',
        fileExtension: 'webp',
        frameCount: 120,
        accentColor: '#10b981',
        specs: [
            { label: 'MATERIAL', value: 'FORGED CARBON' },
            { label: 'DRIVERS', value: '50MM GRAPHENE' },
            { label: 'FREQ RESP', value: '10HZ - 40KHZ' },
            { label: 'CONNECTIVITY', value: 'FLUXSTREAM™' },
            { label: 'BATTERY', value: '80 HOURS' },
            { label: 'WEIGHT', value: '240G' },
            { label: 'MIC', value: 'AI NOISE CANCEL' }
        ],
        phases: [
            {
                title: 'THE CHASSIS',
                subtitle: 'FORGED CARBON',
                description: 'LIGHTER THAN TITANIUM. STRONGER THAN STEEL. MATTE BLACK FINISH ABSORBS LIGHT WHILE EMERALD ACCENTS SIGNAL STATUS.'
            },
            {
                title: 'THE INTERNALS',
                subtitle: '50MM GRAPHENE',
                description: 'PURE SONIC PRECISION. PROPRIETARY V2 DIAPHRAGMS ELIMINATE DISTORTION FOR BONE-SHAKING BASS AND SURGICAL CLARITY.'
            },
            {
                title: 'CONNECTIVITY',
                subtitle: 'FLUXSTREAM™',
                description: 'ZERO LAG. INFINITE FREEDOM. QUANTUM-LATENCY WIRELESS WITH WIRED-GRADE SPEED.'
            }
        ],
        visuals: {
            yOffset: 0.05, // Reduced gap (closer to top)
            scale: 1,
            textAlignment: 'left'
        }
    }
];
