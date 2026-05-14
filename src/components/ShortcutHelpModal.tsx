'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ShortcutEntry {
    action: string;
    mac: string[];
    windows: string[];
}

interface ShortcutSection {
    title: string;
    entries: ShortcutEntry[];
}

interface ShortcutHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SYSTEM_SHORTCUTS: ShortcutSection[] = [
    {
        title: 'Global',
        entries: [
            { action: 'Open Tanpura', mac: ['Option', '1'], windows: ['Alt', '1'] },
            { action: 'Open Play Shrutis', mac: ['Option', '2'], windows: ['Alt', '2'] },
            { action: 'Open Learn & Quiz', mac: ['Option', '3'], windows: ['Alt', '3'] },
            { action: 'Open Settings', mac: ['Option', '4'], windows: ['Alt', '4'] },
            { action: 'Close modal', mac: ['Esc'], windows: ['Esc'] },
        ],
    },
];

const PAGE_SHORTCUTS: ShortcutSection[] = [
    {
        title: 'Tanpura',
        entries: [
            { action: 'Play or pause autoplay', mac: ['Option', 'T'], windows: ['Alt', 'T'] },
            { action: 'Increase volume', mac: ['↑'], windows: ['↑'] },
            { action: 'Decrease volume', mac: ['↓'], windows: ['↓'] },
            { action: 'Mute or unmute', mac: ['M'], windows: ['M'] },
            { action: 'Pluck strings', mac: ['1', '2', '3', '4'], windows: ['1', '2', '3', '4'] },
            { action: 'Open string selector', mac: ['Click note icon'], windows: ['Click note icon'] },
        ],
    },
    {
        title: 'Play Shrutis',
        entries: [
            { action: 'Stop current note', mac: ['Space'], windows: ['Space'] },
            { action: 'Set lower octave', mac: ['Shift', '1'], windows: ['Shift', '1'] },
            { action: 'Set middle octave', mac: ['Shift', '2'], windows: ['Shift', '2'] },
            { action: 'Set upper octave', mac: ['Shift', '3'], windows: ['Shift', '3'] },
        ],
    },
];

function ShortcutPills({ keys }: { keys: string[] }) {
    return (
        <div className="flex flex-wrap gap-1">
            {keys.map((key) => (
                <span
                    key={key}
                    className="inline-flex min-w-6 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-primary)]"
                >
                    {key}
                </span>
            ))}
        </div>
    );
}

function ShortcutTable({ section }: { section: ShortcutSection }) {
    return (
        <section className="space-y-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{section.title}</h3>
            <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]">
                {section.entries.map((entry) => (
                    <div
                        key={`${section.title}-${entry.action}`}
                        className="grid gap-2 border-b border-[var(--border-light)] px-3 py-2 last:border-b-0 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]"
                    >
                        <div className="text-[12px] leading-5 text-[var(--text-primary)]">{entry.action}</div>
                        <div className="space-y-1">
                            <div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Mac</div>
                            <ShortcutPills keys={entry.mac} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Windows</div>
                            <ShortcutPills keys={entry.windows} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function ShortcutHelpModal({ isOpen, onClose }: ShortcutHelpModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[120]" onClick={onClose}>
            <div
                className="absolute bottom-24 left-4 right-4 max-h-[48vh] overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl lg:left-auto lg:right-24 lg:w-[28rem]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Keyboard shortcuts"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</div>
                    <button
                        onClick={onClose}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                        aria-label="Close keyboard shortcuts"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3 p-3">
                    {SYSTEM_SHORTCUTS.map((section) => (
                        <ShortcutTable key={section.title} section={section} />
                    ))}
                    {PAGE_SHORTCUTS.map((section) => (
                        <ShortcutTable key={section.title} section={section} />
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}
