// ============================================
// Learn Page - Main Learning/Quiz Section
// ============================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuizSession, UserProgress } from '@/types/quiz';
import {
    QUIZ_STAGES,
    getStagesWithProgress,
    getStageById,
    getNextStage,
    initializeProgress,
    updateProgress,
    createQuizSession
} from '@/engine/quizEngine';
import { StageList, QuizPlayer, QuizResults } from './quiz';

// Storage key for progress
const PROGRESS_STORAGE_KEY = '22shrutis-quiz-progress';

type LearnView = 'stages' | 'playing' | 'results';

interface LearnPageProps {
    baseFrequency: number;
    volume: number;
}

export function LearnPage({ baseFrequency, volume }: LearnPageProps) {
    const [view, setView] = useState<LearnView>('stages');
    const [progress, setProgress] = useState<UserProgress>(() => {
        // Try to load from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return initializeProgress();
                }
            }
        }
        return initializeProgress();
    });
    const [currentStageId, setCurrentStageId] = useState<string | null>(null);
    const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
        }
    }, [progress]);

    // Get stages with current progress
    const stages = getStagesWithProgress(progress);

    // Handle stage selection
    const handleStageSelect = useCallback((stageId: string) => {
        const stage = getStageById(stageId);
        if (stage && (stage.isUnlocked || progress.completedStages.includes(stageId) ||
            (stages.find(s => s.id === stageId)?.isUnlocked))) {
            setCurrentStageId(stageId);
            setView('playing');
            setCompletedSession(null);
        }
    }, [progress, stages]);

    // Handle quiz completion
    const handleQuizComplete = useCallback((session: QuizSession) => {
        const stage = getStageById(session.stageId);
        if (stage) {
            const newProgress = updateProgress(progress, session, stage);
            setProgress(newProgress);
        }
        setCompletedSession(session);
        setView('results');
    }, [progress]);

    // Handle retry
    const handleRetry = useCallback(() => {
        if (currentStageId) {
            setCompletedSession(null);
            setView('playing');
        }
    }, [currentStageId]);

    // Handle continue to next stage
    const handleContinue = useCallback(() => {
        if (currentStageId) {
            const nextStage = getNextStage(currentStageId);
            if (nextStage) {
                setCurrentStageId(nextStage.id);
                setCompletedSession(null);
                setView('playing');
            } else {
                // No more stages
                setView('stages');
            }
        }
    }, [currentStageId]);

    // Handle exit to stage list
    const handleExit = useCallback(() => {
        setView('stages');
        setCurrentStageId(null);
        setCompletedSession(null);
    }, []);

    // Calculate overall stats
    const totalCompleted = progress.completedStages.length;
    const totalStages = QUIZ_STAGES.length;
    const overallProgress = Math.round((totalCompleted / totalStages) * 100);

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto p-6">
                {view === 'stages' && (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                                Learn & Quiz
                            </h1>
                            <p className="text-lg text-[var(--accent-rust)]">
                                सीखें और अभ्यास करें
                            </p>
                            <p className="text-[var(--text-secondary)] mt-2">
                                Train your ears to recognize the 22 shrutis through progressive stages.
                                Listen carefully and identify the notes you hear.
                            </p>
                        </div>

                        {/* Progress Overview */}
                        <div className="bg-[var(--bg-card)] rounded-xl p-6 mb-8 border border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Progress</h2>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {totalCompleted} of {totalStages} stages completed
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-[var(--accent-saffron)]">
                                        {overallProgress}%
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[var(--accent-saffron)] to-[var(--accent-rust)] transition-all duration-500"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>

                            {/* Quick stats */}
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                                        {progress.totalQuestionsAnswered}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">Questions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {progress.totalCorrect}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">Correct</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                                        {progress.totalQuestionsAnswered > 0
                                            ? Math.round((progress.totalCorrect / progress.totalQuestionsAnswered) * 100)
                                            : 0
                                        }%
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Stage List */}
                        <StageList
                            stages={stages}
                            onStageSelect={handleStageSelect}
                        />

                        {/* Tips Section */}
                        <div className="mt-12 bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-light)]">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                🎵 Learning Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--accent-saffron)]">•</span>
                                    <span>Always listen with reference to Sa (the tonic). All notes are relative.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--accent-saffron)]">•</span>
                                    <span>Use headphones for better pitch perception.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--accent-saffron)]">•</span>
                                    <span>Practice regularly - even 10 minutes daily builds strong aural skills.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--accent-saffron)]">•</span>
                                    <span>If a stage feels difficult, go back and practice the previous one again.</span>
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {view === 'playing' && currentStageId && (
                    <QuizPlayer
                        stageId={currentStageId}
                        baseFrequency={baseFrequency}
                        volume={volume}
                        onComplete={handleQuizComplete}
                        onExit={handleExit}
                    />
                )}

                {view === 'results' && currentStageId && completedSession && (
                    <QuizResults
                        session={completedSession}
                        stage={getStageById(currentStageId)!}
                        onRetry={handleRetry}
                        onContinue={handleContinue}
                        onExit={handleExit}
                    />
                )}
            </div>
        </div>
    );
}
