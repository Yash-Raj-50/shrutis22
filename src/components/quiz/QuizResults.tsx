// ============================================
// Quiz Results Component - Shows results after completing a stage
// ============================================

'use client';

import React from 'react';
import { QuizSession, QuizStage } from '@/types/quiz';

interface QuizResultsProps {
    session: QuizSession;
    stage: QuizStage;
    onRetry: () => void;
    onContinue: () => void;
    onExit: () => void;
}

export function QuizResults({
    session,
    stage,
    onRetry,
    onContinue,
    onExit,
}: QuizResultsProps) {
    const score = Math.round((session.correctCount / session.questions.length) * 100);
    const isPassed = session.isPassed;

    // Calculate time taken
    const timeTaken = session.questions[session.questions.length - 1]?.answeredAt
        ? Math.round(((session.questions[session.questions.length - 1].answeredAt || 0) - session.startedAt) / 1000)
        : 0;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)] shadow-lg text-center">
                {/* Result Icon */}
                <div className={`
                    w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                    ${isPassed
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                        : 'bg-gradient-to-br from-orange-400 to-amber-500'
                    }
                `}>
                    {isPassed ? (
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )}
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                    {isPassed ? 'Stage Complete!' : 'Keep Practicing!'}
                </h2>

                <p className="text-[var(--text-muted)] mb-6">
                    {isPassed
                        ? 'शाबाश! You\'ve mastered this stage.'
                        : 'Almost there! Practice makes perfect.'
                    }
                </p>

                {/* Score Display */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 mb-6">
                    <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">
                        {score}%
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                        {session.correctCount} out of {session.questions.length} correct
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-2">
                        Required: {stage.requiredCorrect} correct to pass
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                        <div className="text-xs text-[var(--text-muted)] mb-1">Time</div>
                        <div className="text-lg font-semibold text-[var(--text-primary)]">
                            {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
                        </div>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                        <div className="text-xs text-[var(--text-muted)] mb-1">Stage</div>
                        <div className="text-lg font-semibold text-[var(--text-primary)]">
                            {stage.order}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {isPassed ? (
                        <>
                            <button
                                onClick={onContinue}
                                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--accent-saffron)] to-[var(--accent-rust)] text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Continue to Next Stage →
                            </button>
                            <button
                                onClick={onRetry}
                                className="w-full py-3 px-6 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                Practice Again
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onRetry}
                                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--accent-saffron)] to-[var(--accent-rust)] text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Try Again
                            </button>
                        </>
                    )}

                    <button
                        onClick={onExit}
                        className="w-full py-3 px-6 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        Back to Stages
                    </button>
                </div>
            </div>
        </div>
    );
}
