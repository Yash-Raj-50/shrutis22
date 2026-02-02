// ============================================
// 22 Shrutis - Constants and Data
// Based on traditional Indian music theory
// ============================================

import { Shruti, TanpuraPreset, KeyboardShortcut } from '@/types';

/**
 * The 22 Shrutis with their traditional ratios
 * 
 * These ratios are based on the traditional Indian music theory,
 * derived from the cycle of fifths and the harmonic series.
 * 
 * Reference: Various musicological sources including
 * - Natya Shastra
 * - Sangita Ratnakara
 * - Modern computational musicology
 */
export const SHRUTIS: Shruti[] = [
    // Sa (Shadja) - The tonic, always 1:1
    {
        id: 1,
        name: 'Shadja',
        shortName: 'S',
        ratio: [1, 1],
        cents: 0,
        parentSwara: 'Sa',
        westernApprox: 'C',
        isCommon: true,
    },

    // Re (Rishabh) - 4 shrutis
    {
        id: 2,
        name: 'Komal Rishabh 1',
        shortName: 'r1',
        ratio: [256, 243],
        cents: 90.22,
        parentSwara: 'Re',
        westernApprox: 'Db',
        isCommon: false,
    },
    {
        id: 3,
        name: 'Komal Rishabh 2',
        shortName: 'r2',
        ratio: [16, 15],
        cents: 111.73,
        parentSwara: 'Re',
        westernApprox: 'Db',
        isCommon: true,
    },
    {
        id: 4,
        name: 'Shuddha Rishabh 1',
        shortName: 'R1',
        ratio: [10, 9],
        cents: 182.40,
        parentSwara: 'Re',
        westernApprox: 'D',
        isCommon: false,
    },
    {
        id: 5,
        name: 'Shuddha Rishabh 2',
        shortName: 'R2',
        ratio: [9, 8],
        cents: 203.91,
        parentSwara: 'Re',
        westernApprox: 'D',
        isCommon: true,
    },

    // Ga (Gandhar) - 4 shrutis
    {
        id: 6,
        name: 'Komal Gandhar 1',
        shortName: 'g1',
        ratio: [32, 27],
        cents: 294.13,
        parentSwara: 'Ga',
        westernApprox: 'Eb',
        isCommon: false,
    },
    {
        id: 7,
        name: 'Komal Gandhar 2',
        shortName: 'g2',
        ratio: [6, 5],
        cents: 315.64,
        parentSwara: 'Ga',
        westernApprox: 'Eb',
        isCommon: true,
    },
    {
        id: 8,
        name: 'Shuddha Gandhar 1',
        shortName: 'G1',
        ratio: [5, 4],
        cents: 386.31,
        parentSwara: 'Ga',
        westernApprox: 'E',
        isCommon: true,
    },
    {
        id: 9,
        name: 'Shuddha Gandhar 2',
        shortName: 'G2',
        ratio: [81, 64],
        cents: 407.82,
        parentSwara: 'Ga',
        westernApprox: 'E',
        isCommon: false,
    },

    // Ma (Madhyam) - 4 shrutis
    {
        id: 10,
        name: 'Shuddha Madhyam 1',
        shortName: 'm1',
        ratio: [4, 3],
        cents: 498.04,
        parentSwara: 'Ma',
        westernApprox: 'F',
        isCommon: true,
    },
    {
        id: 11,
        name: 'Shuddha Madhyam 2',
        shortName: 'm2',
        ratio: [27, 20],
        cents: 519.55,
        parentSwara: 'Ma',
        westernApprox: 'F',
        isCommon: false,
    },
    {
        id: 12,
        name: 'Teevra Madhyam 1',
        shortName: 'M1',
        ratio: [45, 32],
        cents: 590.22,
        parentSwara: 'Ma',
        westernApprox: 'F#',
        isCommon: false,
    },
    {
        id: 13,
        name: 'Teevra Madhyam 2',
        shortName: 'M2',
        ratio: [729, 512],
        cents: 611.73,
        parentSwara: 'Ma',
        westernApprox: 'F#',
        isCommon: true,
    },

    // Pa (Pancham) - The perfect fifth, always 3:2
    {
        id: 14,
        name: 'Pancham',
        shortName: 'P',
        ratio: [3, 2],
        cents: 701.96,
        parentSwara: 'Pa',
        westernApprox: 'G',
        isCommon: true,
    },

    // Dha (Dhaivat) - 4 shrutis
    {
        id: 15,
        name: 'Komal Dhaivat 1',
        shortName: 'd1',
        ratio: [128, 81],
        cents: 792.18,
        parentSwara: 'Dha',
        westernApprox: 'Ab',
        isCommon: false,
    },
    {
        id: 16,
        name: 'Komal Dhaivat 2',
        shortName: 'd2',
        ratio: [8, 5],
        cents: 813.69,
        parentSwara: 'Dha',
        westernApprox: 'Ab',
        isCommon: true,
    },
    {
        id: 17,
        name: 'Shuddha Dhaivat 1',
        shortName: 'D1',
        ratio: [5, 3],
        cents: 884.36,
        parentSwara: 'Dha',
        westernApprox: 'A',
        isCommon: true,
    },
    {
        id: 18,
        name: 'Shuddha Dhaivat 2',
        shortName: 'D2',
        ratio: [27, 16],
        cents: 905.87,
        parentSwara: 'Dha',
        westernApprox: 'A',
        isCommon: false,
    },

    // Ni (Nishad) - 4 shrutis
    {
        id: 19,
        name: 'Komal Nishad 1',
        shortName: 'n1',
        ratio: [16, 9],
        cents: 996.09,
        parentSwara: 'Ni',
        westernApprox: 'Bb',
        isCommon: false,
    },
    {
        id: 20,
        name: 'Komal Nishad 2',
        shortName: 'n2',
        ratio: [9, 5],
        cents: 1017.60,
        parentSwara: 'Ni',
        westernApprox: 'Bb',
        isCommon: true,
    },
    {
        id: 21,
        name: 'Shuddha Nishad 1',
        shortName: 'N1',
        ratio: [15, 8],
        cents: 1088.27,
        parentSwara: 'Ni',
        westernApprox: 'B',
        isCommon: true,
    },
    {
        id: 22,
        name: 'Shuddha Nishad 2',
        shortName: 'N2',
        ratio: [243, 128],
        cents: 1109.78,
        parentSwara: 'Ni',
        westernApprox: 'B',
        isCommon: false,
    },
];

/**
 * Get shruti by ID
 */
export function getShrutiById(id: number): Shruti | undefined {
    return SHRUTIS.find(s => s.id === id);
}

/**
 * Get shrutis by parent swara
 */
export function getShrutisBySwara(swara: string): Shruti[] {
    return SHRUTIS.filter(s => s.parentSwara === swara);
}

/**
 * Common base frequencies for Sa
 */
export const BASE_FREQUENCIES = {
    C3: 130.81,
    'C#3': 138.59,
    D3: 146.83,
    'D#3': 155.56,
    E3: 164.81,
    F3: 174.61,
    'F#3': 185.00,
    G3: 196.00,
    'G#3': 207.65,
    A3: 220.00,
    'A#3': 233.08,
    B3: 246.94,
    C4: 261.63,
    'C#4': 277.18,
    D4: 293.66,
    'D#4': 311.13,
    E4: 329.63,
    F4: 349.23,
    'F#4': 369.99,
    G4: 392.00,
    'G#4': 415.30,
    A4: 440.00,
    'A#4': 466.16,
    B4: 493.88,
} as const;

/**
 * Default tanpura presets
 */
export const TANPURA_PRESETS: TanpuraPreset[] = [
    {
        name: 'Standard (Pa-Sa-Sa-Sa)',
        description: 'Traditional male voice tanpura tuning',
        strings: [14, 1, 1, 1], // Pa, Sa, Sa, Sa
        octaves: [0, 0, 0, -1], // Last Sa in lower octave
    },
    {
        name: 'Standard (Ma-Sa-Sa-Sa)',
        description: 'Alternative tuning for certain ragas',
        strings: [10, 1, 1, 1], // Ma, Sa, Sa, Sa
        octaves: [0, 0, 0, -1],
    },
    {
        name: 'Female Voice (Ni-Sa-Sa-Sa)',
        description: 'Higher pitch tuning for female vocalists',
        strings: [21, 1, 1, 1], // Ni, Sa, Sa, Sa
        octaves: [-1, 0, 0, -1],
    },
    {
        name: 'Instrumental (Pa-Sa-Pa-Sa)',
        description: 'Rich harmonic tuning for instruments',
        strings: [14, 1, 14, 1],
        octaves: [0, 0, -1, -1],
    },
];

/**
 * Keyboard shortcuts for the application
 */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
    {
        key: ' ',
        action: 'togglePlay',
        description: 'Play/Pause tanpura',
    },
    {
        key: 'ArrowUp',
        action: 'volumeUp',
        description: 'Increase volume',
    },
    {
        key: 'ArrowDown',
        action: 'volumeDown',
        description: 'Decrease volume',
    },
    {
        key: '1',
        action: 'selectString1',
        description: 'Select string 1',
    },
    {
        key: '2',
        action: 'selectString2',
        description: 'Select string 2',
    },
    {
        key: '3',
        action: 'selectString3',
        description: 'Select string 3',
    },
    {
        key: '4',
        action: 'selectString4',
        description: 'Select string 4',
    },
    {
        key: 'Escape',
        action: 'closeModal',
        description: 'Close modal/deselect',
    },
    {
        key: 'm',
        action: 'mute',
        description: 'Mute/unmute',
    },
];

/**
 * Swara colors for UI
 */
export const SWARA_COLORS: Record<string, string> = {
    Sa: '#E53935', // Red
    Re: '#FB8C00', // Orange
    Ga: '#FDD835', // Yellow
    Ma: '#43A047', // Green
    Pa: '#1E88E5', // Blue
    Dha: '#5E35B1', // Purple
    Ni: '#D81B60', // Pink
};

/**
 * Default application settings
 */
export const DEFAULT_SETTINGS = {
    baseFrequency: 261.63, // C4
    masterVolume: 0.7,
    tempo: 60, // BPM
    theme: 'dark' as const,
};
