import type { GameStats } from '../game/types'
import type { Difficulty } from './training'

export type TrainingReportSnapshot = {
  trainingName: string
  durationMinutes: number
  difficulty: Difficulty
  sessionStartedAt: string | null
  sessionEndedAt: string | null
  stats: GameStats
}
