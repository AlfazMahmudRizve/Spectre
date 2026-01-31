import { create } from 'zustand';

export type EditionId = 'cyber' | 'carbon' | 'phantom';

export interface EditionConfig {
    name: string;
    colors: {
        primary: string; // Main accent (e.g., #00F0FF)
        bg: string;      // Background tint/overlay
    };
    sequencePath: string; // Path to image sequence folder
}

interface EditionState {
    currentEdition: EditionId;
    config: EditionConfig;
    setEdition: (id: EditionId) => void;
}

export const editionConfigs: Record<EditionId, EditionConfig> = {
    cyber: {
        name: 'CYBER',
        colors: { primary: '#00F0FF', bg: 'rgba(0, 240, 255, 0.05)' },
        sequencePath: '/images/cyber', // Placeholder: using copy of sequence
    },
    carbon: {
        name: 'CARBON',
        colors: { primary: '#555555', bg: 'rgba(85, 85, 85, 0.05)' },
        sequencePath: '/images/carbon',
    },
    phantom: {
        name: 'PHANTOM',
        colors: { primary: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.05)' },
        sequencePath: '/images/phantom',
    },
};

export const useEditionStore = create<EditionState>((set) => ({
    currentEdition: 'cyber',
    config: editionConfigs['cyber'],
    setEdition: (id) => set({
        currentEdition: id,
        config: editionConfigs[id]
    }),
}));
