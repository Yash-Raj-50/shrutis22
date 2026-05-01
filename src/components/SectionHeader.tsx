// ============================================
// SectionHeader - Shared page header for main sections
// ============================================

'use client';

import React from 'react';

interface SectionHeaderProps {
    title: string;
    hindiTitle: string;
    description?: string;
}

export function SectionHeader({ title, hindiTitle, description }: SectionHeaderProps) {
    return (
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                    {title}
                </h1>
                <p className="text-xl font-bold text-[var(--accent-rust)]">
                    {hindiTitle}
                </p>
            </div>
            {description && (
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                    {description}
                </p>
            )}
        </div>
    );
}
