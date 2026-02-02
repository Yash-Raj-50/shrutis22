// ============================================
// 22 Shrutis App - Type Definitions
// ============================================

/**
 * Represents a single Shruti (microtonal note) in Indian Classical Music
 */
export interface Shruti {
    /** Unique identifier (1-22) */
    id: number;

    /** Sanskrit name of the shruti */
    name: string;

    /** Short notation (e.g., "S", "r1", "R1") */
    shortName: string;

    /** Frequency ratio relative to Sa (tonic) */
    ratio: [number, number]; // [numerator, denominator]

    /** Cents offset from Sa */
    cents: number;

    /** The parent swara this shruti belongs to */
    parentSwara: SwaraName;

    /** Western note approximation for reference */
    westernApprox: string;

    /** Whether this shruti is commonly used in ragas */
    isCommon: boolean;
}

/**
 * The 7 main swaras (notes) in Indian music
 */
export type SwaraName = 'Sa' | 'Re' | 'Ga' | 'Ma' | 'Pa' | 'Dha' | 'Ni';

/**
 * Shruti selection for tanpura strings
 * Each string can play any of the 22 shrutis
 */
export interface TanpuraString {
    /** String number (1-4, traditionally) */
    stringNumber: number;

    /** Currently assigned shruti ID */
    shrutiId: number;

    /** Octave offset (-1, 0, or 1) */
    octave: number;

    /** Whether this string is active */
    isActive: boolean;

    /** Individual volume (0-1) */
    volume: number;
}

/**
 * Configuration for the tanpura drone
 */
export interface TanpuraConfig {
    /** Base frequency for Sa (default: 261.63 Hz = C4) */
    baseFrequency: number;

    /** The four tanpura strings */
    strings: [TanpuraString, TanpuraString, TanpuraString, TanpuraString];

    /** Master volume (0-1) */
    masterVolume: number;

    /** Tempo in BPM for string plucking cycle */
    tempo: number;

    /** Resonance/sustain amount (0-1) */
    resonance: number;

    /** Whether the tanpura is currently playing */
    isPlaying: boolean;
}

/**
 * Audio engine state
 */
export interface AudioEngineState {
    /** Whether audio context is initialized */
    isInitialized: boolean;

    /** Whether audio is currently playing */
    isPlaying: boolean;

    /** Current base frequency */
    baseFrequency: number;

    /** Master volume (0-1) */
    masterVolume: number;
}

/**
 * UI State for the application
 */
export interface AppState {
    /** Current tanpura configuration */
    tanpuraConfig: TanpuraConfig;

    /** Audio engine state */
    audioState: AudioEngineState;

    /** Currently selected shruti for editing */
    selectedStringIndex: number | null;

    /** Whether the shruti selector modal is open */
    isSelectorOpen: boolean;

    /** Dark/Light mode */
    theme: 'light' | 'dark';
}

/**
 * Preset configuration for quick setup
 */
export interface TanpuraPreset {
    /** Preset name */
    name: string;

    /** Description */
    description: string;

    /** String configuration */
    strings: [number, number, number, number]; // Shruti IDs

    /** Octave offsets */
    octaves: [number, number, number, number];
}

/**
 * Keyboard shortcut mapping
 */
export interface KeyboardShortcut {
    /** Key combination */
    key: string;

    /** Modifier keys */
    modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];

    /** Action to perform */
    action: string;

    /** Description for help */
    description: string;
}

/**
 * Calculate frequency from shruti ratio and base frequency
 */
export function calculateFrequency(
    baseFrequency: number,
    ratio: [number, number],
    octaveOffset: number = 0
): number {
    const [numerator, denominator] = ratio;
    const frequency = baseFrequency * (numerator / denominator);
    return frequency * Math.pow(2, octaveOffset);
}

/**
 * Calculate cents from ratio
 */
export function ratioToCents(ratio: [number, number]): number {
    const [numerator, denominator] = ratio;
    return 1200 * Math.log2(numerator / denominator);
}
