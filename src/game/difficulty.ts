import type { Difficulty, DifficultyProfile } from '../types/training'

export const durationOptions = [1, 5, 10, 20, 30]

export const difficultyProfiles: Record<Difficulty, DifficultyProfile> = {
  easy: {
    label: '容易',
    rows: 9,
    cols: 9,
    mines: 10,
  },
  normal: {
    label: '普通',
    rows: 16,
    cols: 16,
    mines: 40,
  },
  hard: {
    label: '困难',
    rows: 16,
    cols: 30,
    mines: 99,
  },
}
