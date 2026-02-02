// ============================================
// Quiz Player Component - Active quiz gameplay
// ============================================

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizStage, QuizSession, QuizQuestion, QuizFeedback } from '@/types/quiz';
import { createQuizSession, checkAnswer, getStageById } from '@/engine/quizEngine';
import { getQuizAudioEngine } from '@/audio/QuizAudioEngine';
import { getShrutiById } from '@/constants/shrutis';

interface QuizPlayerProps {
    stageId: string;
    baseFrequency: number;
    volume: number;
    onComplete: (session: QuizSession) => void;
    onExit: () => void;
}

export function QuizPlayer({
    stageId,
    baseFrequency,
    volume,
    onComplete,
    onExit,
}: QuizPlayerProps) {
    const [session, setSession] = useState<QuizSession | null>(null);
    const [stage, setStage] = useState<QuizStage | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showingFeedback, setShowingFeedback] = useState(false);
    const [replayCount, setReplayCount] = useState(0);
    const audioRef = useRef(getQuizAudioEngine(baseFrequency, volume));

    const maxReplays = 3;

    // Initialize session
    useEffect(() => {
        const foundStage = getStageById(stageId);
        if (foundStage) {
            setStage(foundStage);
            setSession(createQuizSession(foundStage));
        }
    }, [stageId]);

    // Update audio settings
    useEffect(() => {
        audioRef.current.setBaseFrequency(baseFrequency);
        audioRef.current.setVolume(volume);
    }, [baseFrequency, volume]);

    // Get current question
    const currentQuestion = session?.questions[session.currentQuestionIndex];

    // Play the question audio
    const playQuestion = useCallback(async () => {
        if (!currentQuestion || isPlaying) return;

        setIsPlaying(true);

        const audio = audioRef.current;
        await audio.initialize();

        if (currentQuestion.correctShrutis.length === 1) {
            // Single shruti
            await audio.playShruti(currentQuestion.correctShrutis[0]);
        } else {
            // Sequence
            await audio.playSequence(currentQuestion.correctShrutis, 600);
        }

        // Wait for sound to fade
        setTimeout(() => setIsPlaying(false), 800);
    }, [currentQuestion, isPlaying]);

    // Auto-play question on new question
    useEffect(() => {
        if (currentQuestion && !showingFeedback) {
            const timer = setTimeout(() => playQuestion(), 500);
            return () => clearTimeout(timer);
        }
    }, [currentQuestion?.id, showingFeedback]);

    // Handle replay
    const handleReplay = useCallback(() => {
        if (replayCount < maxReplays && !isPlaying) {
            setReplayCount(r => r + 1);
            playQuestion();
        }
    }, [replayCount, isPlaying, playQuestion]);

    // Handle shruti selection for single-shruti questions
    const handleSingleSelect = useCallback(async (shrutiId: number) => {
        if (!currentQuestion || !session || !stage || showingFeedback) return;

        // Play the selected note for auditory feedback
        const audio = audioRef.current;
        await audio.playShruti(shrutiId);

        // Check answer
        const result = checkAnswer(currentQuestion, [shrutiId]);
        setFeedback(result);
        setSelectedAnswers([shrutiId]);
        setShowingFeedback(true);

        // Update question with answer
        const updatedQuestions = [...session.questions];
        updatedQuestions[session.currentQuestionIndex] = {
            ...currentQuestion,
            userAnswer: [shrutiId],
            isCorrect: result.isCorrect,
            answeredAt: Date.now(),
        };

        const newCorrectCount = session.correctCount + (result.isCorrect ? 1 : 0);

        // If wrong, replay the correct answer
        if (!result.isCorrect) {
            setTimeout(() => {
                audio.playShruti(currentQuestion.correctShrutis[0]);
            }, 800);
        }

        // Move to next question or complete
        setTimeout(() => {
            const nextIndex = session.currentQuestionIndex + 1;

            if (nextIndex >= session.questions.length) {
                // Session complete
                const finalSession: QuizSession = {
                    ...session,
                    questions: updatedQuestions,
                    correctCount: newCorrectCount,
                    isComplete: true,
                    isPassed: newCorrectCount >= stage.requiredCorrect,
                };
                setSession(finalSession);
                onComplete(finalSession);
            } else {
                // Next question
                setSession({
                    ...session,
                    questions: updatedQuestions,
                    currentQuestionIndex: nextIndex,
                    correctCount: newCorrectCount,
                });
                setFeedback(null);
                setSelectedAnswers([]);
                setShowingFeedback(false);
                setReplayCount(0);
            }
        }, result.isCorrect ? 1200 : 2000);
    }, [currentQuestion, session, stage, showingFeedback, onComplete]);

    // Handle sequence selection (for multi-note questions)
    const handleSequenceToggle = useCallback(async (shrutiId: number) => {
        if (!currentQuestion || showingFeedback) return;

        // Play the note
        const audio = audioRef.current;
        await audio.playShruti(shrutiId);

        // Toggle selection
        setSelectedAnswers(prev => {
            if (prev.includes(shrutiId)) {
                return prev.filter(id => id !== shrutiId);
            }
            return [...prev, shrutiId];
        });
    }, [currentQuestion, showingFeedback]);

    // Submit sequence answer
    const handleSubmitSequence = useCallback(() => {
        if (!currentQuestion || !session || !stage || selectedAnswers.length === 0) return;

        const result = checkAnswer(currentQuestion, selectedAnswers);
        setFeedback(result);
        setShowingFeedback(true);

        // Update and continue similar to single select...
        const updatedQuestions = [...session.questions];
        updatedQuestions[session.currentQuestionIndex] = {
            ...currentQuestion,
            userAnswer: selectedAnswers,
            isCorrect: result.isCorrect,
            answeredAt: Date.now(),
        };

        const newCorrectCount = session.correctCount + (result.isCorrect ? 1 : 0);

        // Replay correct sequence if wrong
        if (!result.isCorrect) {
            const audio = audioRef.current;
            setTimeout(() => {
                audio.playSequence(currentQuestion.correctShrutis, 600);
            }, 800);
        }

        setTimeout(() => {
            const nextIndex = session.currentQuestionIndex + 1;

            if (nextIndex >= session.questions.length) {
                const finalSession: QuizSession = {
                    ...session,
                    questions: updatedQuestions,
                    correctCount: newCorrectCount,
                    isComplete: true,
                    isPassed: newCorrectCount >= stage.requiredCorrect,
                };
                setSession(finalSession);
                onComplete(finalSession);
            } else {
                setSession({
                    ...session,
                    questions: updatedQuestions,
                    currentQuestionIndex: nextIndex,
                    correctCount: newCorrectCount,
                });
                setFeedback(null);
                setSelectedAnswers([]);
                setShowingFeedback(false);
                setReplayCount(0);
            }
        }, result.isCorrect ? 1200 : 2500);
    }, [currentQuestion, session, stage, selectedAnswers, onComplete]);

    if (!session || !stage || !currentQuestion) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-[var(--text-muted)]">Loading...</div>
            </div>
        );
    }

    const isSingleShruti = stage.questionType === 'single-shruti';
    const progress = ((session.currentQuestionIndex) / session.questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Exit
                </button>

                <div className="text-center">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">{stage.name}</h2>
                    <p className="text-sm text-[var(--accent-rust)]">{stage.hindiName}</p>
                </div>

                <div className="text-right">
                    <div className="text-sm text-[var(--text-muted)]">Score</div>
                    <div className="text-lg font-bold text-[var(--text-primary)]">
                        {session.correctCount}/{session.currentQuestionIndex}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-[var(--bg-tertiary)] rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[var(--accent-saffron)] to-[var(--accent-rust)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Display */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-8 mb-6 border border-[var(--border-color)] shadow-sm">
                {/* Question number */}
                <div className="text-center mb-6">
                    <span className="text-sm text-[var(--text-muted)]">
                        Question {session.currentQuestionIndex + 1} of {session.questions.length}
                    </span>
                </div>

                {/* Play/Replay Button */}
                <div className="flex flex-col items-center mb-8">
                    <button
                        onClick={handleReplay}
                        disabled={isPlaying || replayCount >= maxReplays}
                        className={`
                            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200
                            ${isPlaying
                                ? 'bg-[var(--accent-saffron)] animate-pulse'
                                : replayCount >= maxReplays
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : 'bg-gradient-to-br from-[var(--accent-saffron)] to-[var(--accent-rust)] hover:scale-105 active:scale-95'
                            }
                        `}
                    >
                        {isPlaying ? (
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    <div className="mt-3 text-sm text-[var(--text-muted)]">
                        {isPlaying
                            ? 'Listen...'
                            : replayCount >= maxReplays
                                ? 'No replays left'
                                : `Tap to replay (${maxReplays - replayCount} left)`
                        }
                    </div>

                    {/* Instruction */}
                    <p className="mt-4 text-center text-[var(--text-secondary)]">
                        {isSingleShruti
                            ? 'Which shruti did you hear?'
                            : `Select the ${currentQuestion.correctShrutis.length} notes in order`
                        }
                    </p>
                </div>

                {/* Feedback Display */}
                {feedback && (
                    <div className={`
                        text-center py-4 px-6 rounded-xl mb-6 transition-all duration-300
                        ${feedback.isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }
                    `}>
                        <div className={`text-2xl mb-2 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {feedback.isCorrect ? '✓' : '✗'}
                        </div>
                        <p className={`font-medium ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {feedback.message}
                        </p>
                        {!feedback.isCorrect && (
                            <p className="text-sm text-[var(--text-muted)] mt-2">
                                Correct: {feedback.correctShrutis.map(id => getShrutiById(id)?.shortName).join(' → ')}
                            </p>
                        )}
                    </div>
                )}

                {/* Answer Options */}
                <div className={`
                    grid gap-3
                    ${currentQuestion.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4'}
                `}>
                    {currentQuestion.options.map(shrutiId => {
                        const shruti = getShrutiById(shrutiId);
                        if (!shruti) return null;

                        const isSelected = selectedAnswers.includes(shrutiId);
                        const isCorrectAnswer = feedback?.correctShrutis.includes(shrutiId);
                        const isWrongSelected = feedback && isSelected && !isCorrectAnswer;

                        return (
                            <button
                                key={shrutiId}
                                onClick={() => isSingleShruti
                                    ? handleSingleSelect(shrutiId)
                                    : handleSequenceToggle(shrutiId)
                                }
                                disabled={showingFeedback}
                                className={`
                                    p-4 rounded-xl border-2 transition-all duration-200 relative
                                    ${showingFeedback
                                        ? isCorrectAnswer
                                            ? 'bg-green-100 border-green-400'
                                            : isWrongSelected
                                                ? 'bg-red-100 border-red-400'
                                                : 'bg-[var(--bg-tertiary)] border-[var(--border-light)] opacity-50'
                                        : isSelected
                                            ? 'bg-[var(--accent-cream)] border-[var(--accent-saffron)]'
                                            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-saffron)] hover:bg-[var(--bg-card)]'
                                    }
                                `}
                            >
                                <div className="text-xl font-bold text-[var(--text-primary)]">
                                    {shruti.shortName}
                                </div>
                                <div className="text-xs text-[var(--text-muted)] mt-1">
                                    {shruti.name.split(' ')[0]}
                                </div>

                                {/* Selection order for sequences */}
                                {!isSingleShruti && isSelected && !showingFeedback && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--accent-saffron)] text-white text-xs flex items-center justify-center font-bold">
                                        {selectedAnswers.indexOf(shrutiId) + 1}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Submit button for sequences */}
                {!isSingleShruti && !showingFeedback && selectedAnswers.length > 0 && (
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={() => setSelectedAnswers([])}
                            className="px-6 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleSubmitSequence}
                            disabled={selectedAnswers.length !== currentQuestion.correctShrutis.length}
                            className="px-8 py-2 rounded-lg bg-gradient-to-r from-[var(--accent-saffron)] to-[var(--accent-rust)] text-white font-medium hover:opacity-90 disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
