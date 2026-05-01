// ============================================
// Quiz Engine - Stage Definitions and Game Logic
// ============================================

import { QuizStage, QuizQuestion, QuizSession, QuizFeedback, UserProgress, StageProgress } from '@/types/quiz';

/**
 * All quiz stages - carefully designed learning progression
 * Based on Indian Classical Music pedagogy
 */
export const QUIZ_STAGES: QuizStage[] = [
    // === TIER 1: Foundation - Sa and Pa ===
    {
        id: 'stage-1-sa-pa',
        name: 'Sa & Pa',
        hindiName: 'षड्ज-पंचम',
        description: 'Learn the two most fundamental notes - Sa (tonic) and Pa (perfect fifth)',
        order: 1,
        questionType: 'single-shruti',
        availableShrutis: [1, 14], // Sa and Pa only
        questionsPerRound: 6,
        requiredCorrect: 5,
        isUnlocked: true,
        isCompleted: false,
    },

    // === TIER 2: Adding Shuddha swaras ===
    {
        id: 'stage-2-sa-re-pa',
        name: 'Sa, Re & Pa',
        hindiName: 'षड्ज-ऋषभ-पंचम',
        description: 'Add Shuddha Rishabh (Re) to your foundation',
        order: 2,
        questionType: 'single-shruti',
        availableShrutis: [1, 5, 14], // Sa, R2 (Shuddha Re), Pa
        questionsPerRound: 8,
        requiredCorrect: 6,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-3-sa-ga-pa',
        name: 'Sa, Ga & Pa',
        hindiName: 'षड्ज-गंधार-पंचम',
        description: 'Add Shuddha Gandhar (Ga) - the major third',
        order: 3,
        questionType: 'single-shruti',
        availableShrutis: [1, 8, 14], // Sa, G1 (Shuddha Ga), Pa
        questionsPerRound: 8,
        requiredCorrect: 6,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-4-sa-ma-pa',
        name: 'Sa, Ma & Pa',
        hindiName: 'षड्ज-मध्यम-पंचम',
        description: 'Add Shuddha Madhyam (Ma) - the perfect fourth',
        order: 4,
        questionType: 'single-shruti',
        availableShrutis: [1, 10, 14], // Sa, m1 (Shuddha Ma), Pa
        questionsPerRound: 8,
        requiredCorrect: 6,
        isUnlocked: false,
        isCompleted: false,
    },

    // === TIER 3: Building the Thaat ===
    {
        id: 'stage-5-sa-re-ga-pa',
        name: 'Sa, Re, Ga & Pa',
        hindiName: 'षड्ज-ऋषभ-गंधार-पंचम',
        description: 'Combine the first four shuddha swaras',
        order: 5,
        questionType: 'single-shruti',
        availableShrutis: [1, 5, 8, 14], // Sa, R2, G1, Pa
        questionsPerRound: 10,
        requiredCorrect: 8,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-6-dha-ni',
        name: 'Adding Dha & Ni',
        hindiName: 'धैवत-निषाद',
        description: 'Learn Shuddha Dhaivat and Shuddha Nishad',
        order: 6,
        questionType: 'single-shruti',
        availableShrutis: [1, 14, 17, 21], // Sa, Pa, D1, N1
        questionsPerRound: 10,
        requiredCorrect: 8,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-7-bilawal-thaat',
        name: 'Bilawal Thaat',
        hindiName: 'बिलावल थाट',
        description: 'All 7 shuddha swaras - equivalent to major scale',
        order: 7,
        questionType: 'single-shruti',
        availableShrutis: [1, 5, 8, 10, 14, 17, 21], // Sa R2 G1 m1 Pa D1 N1
        questionsPerRound: 12,
        requiredCorrect: 9,
        isUnlocked: false,
        isCompleted: false,
    },

    // === TIER 4: Komal Swaras ===
    {
        id: 'stage-8-komal-re',
        name: 'Komal Rishabh',
        hindiName: 'कोमल ऋषभ',
        description: 'Distinguish between Shuddha and Komal Rishabh',
        order: 8,
        questionType: 'single-shruti',
        availableShrutis: [1, 3, 5, 14], // Sa, r2 (Komal Re), R2 (Shuddha Re), Pa
        questionsPerRound: 10,
        requiredCorrect: 8,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-9-komal-ga',
        name: 'Komal Gandhar',
        hindiName: 'कोमल गंधार',
        description: 'Distinguish between Shuddha and Komal Gandhar',
        order: 9,
        questionType: 'single-shruti',
        availableShrutis: [1, 7, 8, 14], // Sa, g2 (Komal Ga), G1 (Shuddha Ga), Pa
        questionsPerRound: 10,
        requiredCorrect: 8,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-10-teevra-ma',
        name: 'Teevra Madhyam',
        hindiName: 'तीव्र मध्यम',
        description: 'Learn the sharp Madhyam',
        order: 10,
        questionType: 'single-shruti',
        availableShrutis: [1, 10, 13, 14], // Sa, m1, M2, Pa
        questionsPerRound: 10,
        requiredCorrect: 8,
        isUnlocked: false,
        isCompleted: false,
    },

    // === TIER 5: Sequences ===
    {
        id: 'stage-11-2-note-seq',
        name: '2-Note Patterns',
        hindiName: 'दो स्वर',
        description: 'Recognize simple 2-note melodic movements',
        order: 11,
        questionType: 'shruti-sequence',
        availableShrutis: [1, 5, 8, 10, 14], // Sa R2 G1 m1 Pa
        questionsPerRound: 8,
        requiredCorrect: 6,
        sequenceLength: 2,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-12-3-note-seq',
        name: '3-Note Patterns',
        hindiName: 'तीन स्वर',
        description: 'Recognize 3-note melodic phrases',
        order: 12,
        questionType: 'shruti-sequence',
        availableShrutis: [1, 5, 8, 10, 14, 17, 21],
        questionsPerRound: 8,
        requiredCorrect: 6,
        sequenceLength: 3,
        isUnlocked: false,
        isCompleted: false,
    },

    // === TIER 6: Aroha/Avaroha ===
    {
        id: 'stage-13-aroha-basic',
        name: 'Basic Aroha',
        hindiName: 'आरोह',
        description: 'Ascending patterns - Sa Re Ga...',
        order: 13,
        questionType: 'scale-aroha',
        availableShrutis: [1, 5, 8, 10, 14],
        questionsPerRound: 6,
        requiredCorrect: 5,
        sequenceLength: 4,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-14-avaroha-basic',
        name: 'Basic Avaroha',
        hindiName: 'अवरोह',
        description: 'Descending patterns - Pa Ma Ga...',
        order: 14,
        questionType: 'scale-avaroha',
        availableShrutis: [1, 5, 8, 10, 14],
        questionsPerRound: 6,
        requiredCorrect: 5,
        sequenceLength: 4,
        isUnlocked: false,
        isCompleted: false,
    },

    // === TIER 7: Simple Raags ===
    {
        id: 'stage-15-yaman-aroha',
        name: 'Raag Yaman Aroha',
        hindiName: 'राग यमन आरोह',
        description: 'Sing and identify the Yaman ascent with teevra Ma',
        order: 15,
        questionType: 'scale-aroha',
        availableShrutis: [1, 5, 8, 13, 14, 17, 21], // Sa Re Ga Ma# Pa Dha Ni
        questionsPerRound: 5,
        requiredCorrect: 4,
        sequenceLength: 7,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-16-yaman-avaroha',
        name: 'Raag Yaman Avaroha',
        hindiName: 'राग यमन अवरोह',
        description: 'Practice the full Yaman descent and internalize its colour',
        order: 16,
        questionType: 'scale-avaroha',
        availableShrutis: [1, 5, 8, 13, 14, 17, 21],
        questionsPerRound: 5,
        requiredCorrect: 4,
        sequenceLength: 7,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-17-bhupali-aroha',
        name: 'Raag Bhupali Aroha',
        hindiName: 'राग भूपाली आरोह',
        description: 'Learn the pentatonic climb of Bhupali',
        order: 17,
        questionType: 'scale-aroha',
        availableShrutis: [1, 5, 8, 14, 17], // Sa Re Ga Pa Dha
        questionsPerRound: 5,
        requiredCorrect: 4,
        sequenceLength: 5,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-18-bhupali-avaroha',
        name: 'Raag Bhupali Avaroha',
        hindiName: 'राग भूपाली अवरोह',
        description: 'Recognize the Bhupali descent without Ma',
        order: 18,
        questionType: 'scale-avaroha',
        availableShrutis: [1, 5, 8, 14, 17],
        questionsPerRound: 5,
        requiredCorrect: 4,
        sequenceLength: 5,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-19-durga-aroha',
        name: 'Raag Durga Aroha',
        hindiName: 'राग दुर्गा आरोह',
        description: 'Practice the open, bright ascent of Durga',
        order: 19,
        questionType: 'scale-aroha',
        availableShrutis: [1, 5, 10, 14, 17], // Sa Re Ma Pa Dha
        questionsPerRound: 5,
        requiredCorrect: 4,
        sequenceLength: 5,
        isUnlocked: false,
        isCompleted: false,
    },
    {
        id: 'stage-20-durga-avaroha',
        name: 'Raag Durga Avaroha',
        hindiName: 'राग दुर्गा अवरोह',
        description: 'Hear the Durga descent and compare it with Bhupali',
        order: 20,
        questionType: 'scale-avaroha',
        availableShrutis: [1, 5, 10, 14, 17],
        questionsPerRound: 5,
        requiredCorrect: 4,
        sequenceLength: 5,
        isUnlocked: false,
        isCompleted: false,
    },
];

/**
 * Encouraging messages for correct answers
 */
const CORRECT_MESSAGES = [
    'शाबाश! (Excellent!)',
    'बहुत अच्छा! (Very good!)',
    'सही! (Correct!)',
    'वाह! (Wonderful!)',
    'Perfect ear!',
    'You got it!',
    'Well done!',
];

/**
 * Encouraging messages for incorrect answers
 */
const INCORRECT_MESSAGES = [
    'Listen again...',
    'Almost there!',
    'Keep practicing!',
    'Try once more.',
    'Focus on the difference.',
];

/**
 * Get a random message
 */
function getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate a unique question ID
 */
function generateQuestionId(): string {
    return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get a random subset of shrutis
 */
function getRandomShrutis(available: number[], count: number): number[] {
    const shuffled = shuffleArray(available);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Generate a single-shruti question
 */
function generateSingleShrutiQuestion(stage: QuizStage): QuizQuestion {
    const correctShruti = stage.availableShrutis[
        Math.floor(Math.random() * stage.availableShrutis.length)
    ];

    return {
        id: generateQuestionId(),
        correctShrutis: [correctShruti],
        options: shuffleArray([...stage.availableShrutis]),
    };
}

/**
 * Generate a sequence question
 */
function generateSequenceQuestion(stage: QuizStage): QuizQuestion {
    const length = stage.sequenceLength || 2;
    const sequence: number[] = [];

    // Generate a random sequence
    for (let i = 0; i < length; i++) {
        const shruti = stage.availableShrutis[
            Math.floor(Math.random() * stage.availableShrutis.length)
        ];
        sequence.push(shruti);
    }

    return {
        id: generateQuestionId(),
        correctShrutis: sequence,
        options: shuffleArray([...stage.availableShrutis]),
    };
}

/**
 * Generate an aroha (ascending) question
 */
function generateArohaQuestion(stage: QuizStage): QuizQuestion {
    const length = stage.sequenceLength || 4;
    const sorted = [...stage.availableShrutis].sort((a, b) => a - b);

    // Pick a random starting point that allows the full sequence
    const maxStart = Math.max(0, sorted.length - length);
    const startIdx = Math.floor(Math.random() * (maxStart + 1));
    const sequence = sorted.slice(startIdx, startIdx + length);

    return {
        id: generateQuestionId(),
        correctShrutis: sequence,
        options: shuffleArray([...stage.availableShrutis]),
    };
}

/**
 * Generate an avaroha (descending) question
 */
function generateAvarohaQuestion(stage: QuizStage): QuizQuestion {
    const length = stage.sequenceLength || 4;
    const sorted = [...stage.availableShrutis].sort((a, b) => b - a);

    // Pick a random starting point
    const maxStart = Math.max(0, sorted.length - length);
    const startIdx = Math.floor(Math.random() * (maxStart + 1));
    const sequence = sorted.slice(startIdx, startIdx + length);

    return {
        id: generateQuestionId(),
        correctShrutis: sequence,
        options: shuffleArray([...stage.availableShrutis]),
    };
}

/**
 * Generate a question based on stage type
 */
export function generateQuestion(stage: QuizStage): QuizQuestion {
    switch (stage.questionType) {
        case 'single-shruti':
            return generateSingleShrutiQuestion(stage);
        case 'shruti-sequence':
            return generateSequenceQuestion(stage);
        case 'scale-aroha':
            return generateArohaQuestion(stage);
        case 'scale-avaroha':
            return generateAvarohaQuestion(stage);
        default:
            return generateSingleShrutiQuestion(stage);
    }
}

/**
 * Create a new quiz session for a stage
 */
export function createQuizSession(stage: QuizStage): QuizSession {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < stage.questionsPerRound; i++) {
        questions.push(generateQuestion(stage));
    }

    return {
        stageId: stage.id,
        questions,
        currentQuestionIndex: 0,
        correctCount: 0,
        startedAt: Date.now(),
        isComplete: false,
    };
}

/**
 * Check if an answer is correct
 */
export function checkAnswer(
    question: QuizQuestion,
    userAnswer: number[]
): QuizFeedback {
    // For single shruti, just compare the first element
    const isCorrect =
        question.correctShrutis.length === userAnswer.length &&
        question.correctShrutis.every((s, i) => s === userAnswer[i]);

    return {
        isCorrect,
        correctShrutis: question.correctShrutis,
        userAnswer,
        message: isCorrect
            ? getRandomMessage(CORRECT_MESSAGES)
            : getRandomMessage(INCORRECT_MESSAGES),
    };
}

/**
 * Get stage by ID
 */
export function getStageById(stageId: string): QuizStage | undefined {
    return QUIZ_STAGES.find(s => s.id === stageId);
}

/**
 * Get the next stage
 */
export function getNextStage(currentStageId: string): QuizStage | undefined {
    const current = getStageById(currentStageId);
    if (!current) return undefined;

    return QUIZ_STAGES.find(s => s.order === current.order + 1);
}

/**
 * Initialize user progress
 */
export function initializeProgress(): UserProgress {
    return {
        completedStages: [],
        currentStageId: 'stage-1-sa-pa',
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        stageProgress: {},
    };
}

/**
 * Update progress after completing a session
 */
export function updateProgress(
    progress: UserProgress,
    session: QuizSession,
    stage: QuizStage
): UserProgress {
    const score = (session.correctCount / session.questions.length) * 100;
    const isPassed = session.correctCount >= stage.requiredCorrect;

    const stageProgress: StageProgress = progress.stageProgress[stage.id] || {
        attempts: 0,
        bestScore: 0,
        isCompleted: false,
    };

    const updatedStageProgress: StageProgress = {
        attempts: stageProgress.attempts + 1,
        bestScore: Math.max(stageProgress.bestScore, score),
        isCompleted: stageProgress.isCompleted || isPassed,
        lastAttemptAt: Date.now(),
    };

    const newProgress: UserProgress = {
        ...progress,
        totalQuestionsAnswered: progress.totalQuestionsAnswered + session.questions.length,
        totalCorrect: progress.totalCorrect + session.correctCount,
        lastPlayedAt: Date.now(),
        stageProgress: {
            ...progress.stageProgress,
            [stage.id]: updatedStageProgress,
        },
    };

    // If passed and not already completed, unlock next stage
    if (isPassed && !progress.completedStages.includes(stage.id)) {
        newProgress.completedStages = [...progress.completedStages, stage.id];

        const nextStage = getNextStage(stage.id);
        if (nextStage) {
            newProgress.currentStageId = nextStage.id;
        }
    }

    return newProgress;
}

/**
 * Get stages with unlocked status based on progress
 */
export function getStagesWithProgress(progress: UserProgress): QuizStage[] {
    return QUIZ_STAGES.map((stage, index) => {
        const stageProgress = progress.stageProgress[stage.id];
        const isUnlocked = index === 0 || progress.completedStages.includes(QUIZ_STAGES[index - 1].id);

        return {
            ...stage,
            isUnlocked,
            isCompleted: stageProgress?.isCompleted || false,
            bestScore: stageProgress?.bestScore,
        };
    });
}
