# 22 Shrutis 🎵

An interactive web application to learn and master the 22 shrutis (microtones) of Indian classical music through listening, exploration, and progressive quizzes.

## About

In Indian classical music, an octave is divided into 22 shrutis — subtle microtonal intervals that form the foundation of both Hindustani and Carnatic traditions. While Western music uses 12 semitones, Indian music embraces these finer distinctions to create its characteristic melodic richness.

**22 Shrutis** is designed to help music enthusiasts train their ears to recognize and identify these notes. Rather than reading through dense theory, you learn through an intuitive, visual, and audio-driven experience.

## Features

### 🎼 Shruti Explorer
Browse and listen to all 22 shrutis with their traditional frequency ratios. Each shruti displays:
- Traditional name and short notation (S, r1, r2, R1, R2, g1, g2, G1, G2, M1, M2, m1, m2, P, d1, d2, D1, D2, n1, n2, N1, N2, S')
- Mathematical ratio based on classical Indian music theory
- Western note approximation
- Parent swara (Sa, Re, Ga, Ma, Pa, Dha, Ni)

### 🎸 Tanpura (Drone)
A built-in tanpura provides the continuous drone essential for practicing Indian classical music. Features include:
- Adjustable base frequency (Sa)
- Multiple preset configurations
- Visual string representation

### 📚 Learn Mode (Quiz)
Progressive stages that train your ear recognition:
- Start with individual note identification
- Advance to combinations and patterns
- Build towards recognizing scales and ragas
- Audio cues guide you through each challenge

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| Web Audio API | Real-time audio synthesis |

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/22-shrutis.git
cd 22-shrutis/shrutis22

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start exploring the shrutis.

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── audio/         # Audio engines (Tanpura, Quiz)
├── components/    # React components
├── constants/     # Shruti definitions and data
├── engine/        # Quiz logic engine
├── hooks/         # Custom React hooks
└── types/         # TypeScript type definitions
```

## Inspiration

This project is built for anyone who loves Indian classical music and wants to develop a trained ear for its subtle nuances — whether you're a beginner curious about ragas or an enthusiast looking to deepen your understanding.

## License

This project is open source and available under the MIT License.
