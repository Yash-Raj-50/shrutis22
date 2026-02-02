// ============================================
// Stage Card Component - Displays a single quiz stage
// ============================================

'use client';

import React from 'react';
import { QuizStage } from '@/types/quiz';
import { getShrutiById } from '@/constants/shrutis';

interface StageCardProps {
    stage: QuizStage;
    onClick: () => void;
}

export function StageCard({ stage, onClick }: StageCardProps) {
    const isLocked = !stage.isUnlocked;

    // Get shruti names for display
    const shrutiNames = stage.availableShrutis
        .slice(0, 4) // Show first 4
        .map(id => getShrutiById(id)?.shortName || '?')
        .join(' · ');

    const moreShrutis = stage.availableShrutis.length > 4
        ? `+${stage.availableShrutis.length - 4}`
        : '';

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={`
                w-full text-left p-5 rounded-xl border-2 transition-all duration-200
                ${isLocked
                    ? 'bg-[var(--bg-tertiary)] border-[var(--border-light)] opacity-60 cursor-not-allowed'
                    : stage.isCompleted
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-md'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-saffron)] hover:shadow-lg'
                }
            `}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    {/* Stage number and name */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`
                            text-xs font-semibold px-2 py-0.5 rounded-full
                            ${stage.isCompleted
                                ? 'bg-green-100 text-green-700'
                                : isLocked
                                    ? 'bg-gray-200 text-gray-500'
                                    : 'bg-[var(--accent-cream)] text-[var(--accent-rust)]'
                            }
                        `}>
                            Stage {stage.order}
                        </span>
                        {stage.isCompleted && (
                            <span className="text-green-600">✓</span>
                        )}
                    </div>

                    {/* Names */}
                    <h3 className={`
                        text-lg font-bold mb-1
                        ${isLocked ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}
                    `}>
                        {stage.name}
                    </h3>
                    <p className="text-sm text-[var(--accent-rust)] font-medium mb-2">
                        {stage.hindiName}
                    </p>

                    {/* Description */}
                    <p className={`
                        text-sm mb-3
                        ${isLocked ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}
                    `}>
                        {stage.description}
                    </p>

                    {/* Shrutis involved */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-[var(--text-muted)]">Notes:</span>
                        <span className={`
                            font-mono font-semibold
                            ${isLocked ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}
                        `}>
                            {shrutiNames} {moreShrutis}
                        </span>
                    </div>
                </div>

                {/* Status icon */}
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${isLocked
                        ? 'bg-gray-200'
                        : stage.isCompleted
                            ? 'bg-green-100'
                            : 'bg-[var(--accent-cream)]'
                    }
                `}>
                    {isLocked ? (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    ) : stage.isCompleted ? (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-[var(--accent-saffron)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Best score if available */}
            {stage.bestScore !== undefined && stage.bestScore > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">Best Score</span>
                        <span className={`font-bold ${stage.bestScore >= 80 ? 'text-green-600' : 'text-[var(--accent-rust)]'}`}>
                            {Math.round(stage.bestScore)}%
                        </span>
                    </div>
                </div>
            )}
        </button>
    );
}
