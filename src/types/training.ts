export type Difficulty = 'easy' | 'normal' | 'hard'

export type TrainingConfig = {
  durationMinutes: number
  difficulty: Difficulty
}

export type DifficultyProfile = {
  label: string
  rows: number
  cols: number
  mines: number
}
