import type { GameStats } from './types'

export function createEmptyStats(): GameStats {
  return {
    score: 0,
    wins: 0,
    losses: 0,
    safeReveals: 0,
    flagsPlaced: 0,
    mistakes: 0,
    totalActions: 0,
    reactionSamplesMs: [],
    perSecondActions: [],
  }
}

export function getAverageReactionMs(stats: GameStats) {
  if (stats.reactionSamplesMs.length === 0) {
    return 0
  }

  return Math.round(
    stats.reactionSamplesMs.reduce((total, sample) => total + sample, 0) /
      stats.reactionSamplesMs.length,
  )
}

export function calculateScore(stats: GameStats) {
  return (
    stats.wins * 100 +
    stats.safeReveals * 2 +
    stats.flagsPlaced * 5 -
    stats.mistakes * 10
  )
}
