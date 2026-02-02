// ============================================
// Quiz/Learning Types - Ear Training Engine
// ============================================

/**
 * Quiz difficulty levels based on shruti count and complexity
 */
export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Type of quiz question
 */
export type QuestionType =
    | 'single-shruti'      // Identify a single shruti
    | 'shruti-sequence'    // Identify a sequence of shrutis
    | 'scale-aroha'        // Ascending scale pattern
    | 'scale-avaroha';     // Descending scale pattern

/**
 * A single stage in the learning journey
 */
export interface QuizStage {
    /** Unique identifier */
    id: string;

    /** Display name */
    name: string;

    /** Hindi name */
    hindiName: string;

    /** Brief description */
    description: string;

    /** Stage number for ordering */
    order: number;

    /** Type of questions in this stage */
    questionType: QuestionType;

    /** Available shruti IDs for this stage */
    availableShrutis: number[];

    /** Number of questions per round */
    questionsPerRound: number;

    /** Required correct answers to pass */
    requiredCorrect: number;

    /** Sequence length (for sequence types) */
    sequenceLength?: number;

    /** Whether this stage is unlocked */
    isUnlocked: boolean;

    /** Whether this stage is completed */
    isCompleted: boolean;

    /** Best score achieved */
    bestScore?: number;
}

/**
 * A single question in a quiz round
 */
export interface QuizQuestion {
    /** Question ID */
    id: string;

    /** The shruti(s) being played - answer */
    correctShrutis: number[];

    /** Available options to choose from */
    options: number[];

    /** User's selected answer(s) */
    userAnswer?: number[];

    /** Whether the answer was correct */
    isCorrect?: boolean;

    /** Timestamp when question was presented */
    presentedAt?: number;

    /** Timestamp when answered */
    answeredAt?: number;
}

/**
 * State of an active quiz session
 */
export interface QuizSession {
    /** Current stage being played */
    stageId: string;

    /** All questions in this round */
    questions: QuizQuestion[];

    /** Current question index */
    currentQuestionIndex: number;

    /** Number of correct answers so far */
    correctCount: number;

    /** Session start time */
    startedAt: number;

    /** Whether session is complete */
    isComplete: boolean;

    /** Whether the stage was passed */
    isPassed?: boolean;
}

/**
 * User's overall progress
 */
export interface UserProgress {
    /** Stages completed */
    completedStages: string[];

    /** Current unlocked stage */
    currentStageId: string;

    /** Total questions answered */
    totalQuestionsAnswered: number;

    /** Total correct answers */
    totalCorrect: number;

    /** Last played timestamp */
    lastPlayedAt?: number;

    /** Stage-specific progress */
    stageProgress: Record<string, StageProgress>;
}

/**
 * Progress within a single stage
 */
export interface StageProgress {
    /** Number of attempts */
    attempts: number;

    /** Best score (percentage) */
    bestScore: number;

    /** Whether completed */
    isCompleted: boolean;

    /** Last attempt timestamp */
    lastAttemptAt?: number;
}

/**
 * Feedback after answering a question
 */
export interface QuizFeedback {
    /** Whether the answer was correct */
    isCorrect: boolean;

    /** The correct answer(s) */
    correctShrutis: number[];

    /** User's answer(s) */
    userAnswer: number[];

    /** Encouraging message */
    message: string;
}

/**
 * Audio state for quiz playback
 */
export interface QuizAudioState {
    /** Whether audio is currently playing */
    isPlaying: boolean;

    /** Current shruti being played */
    currentShruti?: number;

    /** Whether replay is available */
    canReplay: boolean;

    /** Number of replays used */
    replayCount: number;

    /** Maximum replays allowed */
    maxReplays: number;
}
