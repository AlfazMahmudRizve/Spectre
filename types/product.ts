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
    slug?: string; // Optional for now to support old/new overlap
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
    createdAt?: Date;
    updatedAt?: Date;
}
