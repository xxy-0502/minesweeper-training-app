import { create } from 'zustand'
import type { Difficulty, TrainingConfig } from '../types/training'

type TrainingState = TrainingConfig & {
  startedAt: string | null
  setDuration: (durationMinutes: number) => void
  setDifficulty: (difficulty: Difficulty) => void
  startTraining: () => void
  resetTraining: () => void
}

const defaultConfig: TrainingConfig = {
  durationMinutes: 10,
  difficulty: 'normal',
}

export const useTrainingStore = create<TrainingState>((set) => ({
  ...defaultConfig,
  startedAt: null,
  setDuration: (durationMinutes) => set({ durationMinutes }),
  setDifficulty: (difficulty) => set({ difficulty }),
  startTraining: () => set({ startedAt: new Date().toISOString() }),
  resetTraining: () => set({ ...defaultConfig, startedAt: null }),
}))
