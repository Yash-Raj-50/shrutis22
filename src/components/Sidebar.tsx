// ============================================
// Sidebar Navigation Component
// ============================================

'use client';

import React from 'react';

export type SectionId = 'tanpura' | 'explore' | 'learn' | 'settings';

interface SidebarProps {
    activeSection: SectionId;
    onSectionChange: (section: SectionId) => void;
}

interface NavItem {
    id: SectionId;
    label: string;
    hindiLabel: string;
    icon: React.ReactNode;
    available: boolean;
}

const navItems: NavItem[] = [
    {
        id: 'tanpura',
        label: 'Tanpura',
        hindiLabel: 'तानपुरा',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <ellipse cx="12" cy="18" rx="6" ry="3" />
                <path d="M6 18V6c0-1.5 2.5-3 6-3s6 1.5 6 3v12" />
                <line x1="9" y1="6" x2="9" y2="18" />
                <line x1="12" y1="6" x2="12" y2="18" />
                <line x1="15" y1="6" x2="15" y2="18" />
            </svg>
        ),
        available: true,
    },
    {
        id: 'explore',
        label: 'Explore Shrutis',
        hindiLabel: 'श्रुति देखें',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        ),
        available: true,
    },
    {
        id: 'learn',
        label: 'Learn & Quiz',
        hindiLabel: 'सीखें',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <path d="M12 3L2 9l10 6 10-6-10-6z" />
                <path d="M2 17l10 6 10-6" />
                <path d="M2 13l10 6 10-6" />
            </svg>
        ),
        available: true,
    },
    {
        id: 'settings',
        label: 'Settings',
        hindiLabel: 'सेटिंग्स',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
        ),
        available: true,
    },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
    return (
        <aside className="w-72 h-screen bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex flex-col relative z-10">
            {/* Logo/Header */}
            <div className="p-6 border-b border-[var(--border-color)] text-center">
                <h1 className="text-4xl font-bold text-[var(--accent-saffron)] font-serif">
                    २२ श्रुति
                </h1>
                <p className="text-lg font-medium text-[var(--text-secondary)] mt-2">
                    22 Shrutis
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1 italic">
                    Learn to Identify Notes
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => item.available && onSectionChange(item.id)}
                        disabled={!item.available}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-lg
                            transition-all duration-200 text-left
                            ${activeSection === item.id
                                ? 'bg-[var(--accent-saffron)]/20 text-[var(--accent-saffron)] border border-[var(--accent-saffron)]/30'
                                : item.available
                                    ? 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    : 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
                            }
                        `}
                    >
                        <span className={activeSection === item.id ? 'text-[var(--accent-saffron)]' : ''}>
                            {item.icon}
                        </span>
                        <div>
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs opacity-70">{item.hindiLabel}</div>
                        </div>
                        {!item.available && (
                            <span className="ml-auto text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                                Soon
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <div className="text-xs text-[var(--text-muted)]">
                    <p>Version 0.5.0</p>
                    <p className="mt-1 opacity-70">Hindustani Classical</p>
                </div>
            </div>

            {/* Decorative Indian pattern */}
            <div className="h-2 bg-gradient-to-r from-[var(--accent-saffron)] via-[var(--accent-rust)] to-[var(--accent-maroon)]" />
        </aside>
    );
}
