import type { Difficulty } from '../types/training'

export type Cell = {
  id: string
  row: number
  col: number
  isMine: boolean
  adjacentMines: number
  isRevealed: boolean
  isFlagged: boolean
}

export type Board = Cell[][]

export type GameStatus =
  'ready' | 'playing' | 'paused' | 'won' | 'lost' | 'ended'

export type CellPosition = {
  row: number
  col: number
}

export type GameStats = {
  score: number
  wins: number
  losses: number
  safeReveals: number
  flagsPlaced: number
  correctFlags: number
  wrongFlags: number
  mistakes: number
  totalActions: number
  reactionSamplesMs: number[]
  perSecondActions: number[]
}

export type GameSessionConfig = {
  durationMinutes: number
  difficulty: Difficulty
}
