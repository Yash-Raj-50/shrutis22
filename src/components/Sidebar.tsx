// ============================================
// Sidebar Navigation Component
// ============================================

'use client';

import React from 'react';

export type SectionId = 'tanpura' | 'explore' | 'learn' | 'settings';

interface SidebarProps {
    activeSection: SectionId;
    onSectionChange: (section: SectionId) => void;
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    onToggleCollapse: () => void;
    tanpuraIsPlaying?: boolean;
    tanpuraIsInitialized?: boolean;
    onTanpuraToggle?: () => void | Promise<void>;
    onShowShortcuts?: () => void;
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
        label: 'Play Shrutis',
        hindiLabel: 'श्रुतियों को बजाएं',
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

export function Sidebar({
    activeSection,
    onSectionChange,
    isOpen,
    isCollapsed,
    onClose,
    onToggleCollapse,
    tanpuraIsPlaying = false,
    tanpuraIsInitialized = false,
    onTanpuraToggle,
    onShowShortcuts,
}: SidebarProps) {
    return (
        <>
            <div
                className={`
                    fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 lg:hidden
                    ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}
                `}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`
                    fixed right-0 top-0 z-40 h-screen bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex flex-col sidebar-motif-panel
                    transition-all duration-300 ease-out lg:static lg:z-10
                    ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'w-24' : 'w-72'}
                `}
                data-collapsed={isCollapsed}
            >
                {/* Logo/Header */}
                <div className={`border-b border-[var(--border-color)] ${isCollapsed ? 'p-4' : 'p-6'} text-center relative`}>
                    <div className="flex items-center justify-between lg:hidden mb-4">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">Navigation</span>
                        <button
                            onClick={onClose}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:inline-flex absolute top-4 left-4 items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isCollapsed ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>

                    <h1 className={`${isCollapsed ? 'text-2xl' : 'text-4xl'} font-bold text-[var(--accent-saffron)] font-serif transition-all duration-300`}>
                        {isCollapsed ? '२२' : '२२ श्रुति'}
                    </h1>
                    {!isCollapsed && (
                        <>
                            <p className="text-lg font-medium text-[var(--text-secondary)] mt-2">
                                22 Shrutis
                            </p>
                            <p className="text-sm text-[var(--text-muted)] mt-1 italic">
                                Learn to Identify Notes
                            </p>
                        </>
                    )}
                    {isCollapsed && (
                        <p className="text-xs text-[var(--text-muted)] mt-2">22</p>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => (
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    if (item.available) {
                                        onSectionChange(item.id);
                                        onClose();
                                    }
                                }}
                                disabled={!item.available}
                                className={`
                                w-full flex items-center justify-between px-4 py-3 rounded-lg
                                transition-all duration-200 text-left
                                ${isCollapsed ? 'justify-center' : ''}
                                ${activeSection === item.id
                                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold'
                                        : item.available
                                            ? 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                            : 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
                                    }
                            `}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeSection === item.id ? 'text-[var(--accent-saffron)]' : ''}>
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && (
                                        <div>
                                            <div className={`${activeSection === item.id ? 'font-semibold' : 'font-medium'} text-sm`}>{item.label}</div>
                                            <div className="text-xs opacity-70">{item.hindiLabel}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!item.available && !isCollapsed && (
                                        <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                                            Soon
                                        </span>
                                    )}
                                    {item.id === 'tanpura' && onTanpuraToggle && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTanpuraToggle();
                                            }}
                                            className={`
                                                flex-shrink-0 w-10 h-10 rounded-xl border-2 border-[var(--accent-saffron)] flex items-center justify-center transition-all
                                                ${tanpuraIsPlaying
                                                    ? 'bg-[var(--accent-saffron)] text-white'
                                                    : tanpuraIsInitialized
                                                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                                                        : 'bg-[var(--bg-tertiary)] text-[var(--accent-saffron)] ring-1 ring-[var(--accent-saffron)]/30 hover:bg-[var(--border-color)]'
                                                }
                                            `}
                                            title={tanpuraIsPlaying ? 'Stop tanpura' : tanpuraIsInitialized ? 'Play tanpura' : 'Initialize and play tanpura'}
                                            aria-label={tanpuraIsPlaying ? 'Pause tanpura' : 'Play tanpura'}
                                        >
                                            {tanpuraIsPlaying ? (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <rect x="6" y="4" width="4" height="16" />
                                                    <rect x="14" y="4" width="4" height="16" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </button>

                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className={`px-4 pb-4 ${isCollapsed ? 'pt-3' : 'pt-0'}`}>
                    <button
                        onClick={onShowShortcuts}
                        className={`
                            w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]/45 px-3 py-2 text-left text-[var(--text-muted)] transition-colors
                            hover:bg-[var(--bg-tertiary)]/70 hover:text-[var(--text-primary)]
                            ${isCollapsed ? 'flex h-10 items-center justify-center px-0' : 'flex h-10 items-center gap-2'}
                        `}
                        title="Keyboard shortcuts"
                        aria-label="Open keyboard shortcuts"
                    >
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5" />
                            <path strokeWidth="1.5" strokeLinecap="round" d="M7 9h1M10 9h1M13 9h1M16 9h1M6.5 13h11M8 16h8" />
                        </svg>
                        {!isCollapsed && (
                            <div className="text-sm font-medium">Keyboard Shortcuts</div>
                        )}
                    </button>
                </div>
                <div className={`border-t border-[var(--border-color)] ${isCollapsed ? 'p-3' : 'p-4'}`}>
                    {isCollapsed ? (
                        <div className="text-center text-[10px] text-[var(--text-muted)] leading-tight">
                            <p>v0.7</p>
                            <p className="mt-1 opacity-70">HC</p>
                        </div>
                    ) : (
                        <div className="text-xs text-[var(--text-muted)] space-y-1">
                            <p>Version 0.7.0</p>
                            <p className="opacity-70">Hindustani Classical Music</p>
                            <p className="opacity-70">Built with ♪ for music learners. By Yash</p>
                        </div>
                    )}
                </div>

                {/* Decorative Indian pattern */}
                <div className="h-2 bg-gradient-to-r from-[var(--accent-saffron)] via-[var(--accent-rust)] to-[var(--accent-maroon)]" />
            </aside>
        </>
    );
}
