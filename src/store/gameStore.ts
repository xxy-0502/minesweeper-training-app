import { create } from 'zustand'
import { createEmptyBoard, placeMines, revealAllMines } from '../game/board'
import { difficultyProfiles } from '../game/difficulty'
import { toggleFlag } from '../game/flag'
import { revealCell } from '../game/reveal'
import { calculateScore, createEmptyStats } from '../game/statistics'
import { hasWon } from '../game/winLoss'
import type {
  Board,
  GameSessionConfig,
  GameStats,
  GameStatus,
} from '../game/types'

type GameState = {
  board: Board
  status: GameStatus
  config: GameSessionConfig
  remainingSeconds: number
  flagCount: number
  minesPlaced: boolean
  sessionStartedAt: string | null
  sessionEndedAt: string | null
  lastActionAt: number | null
  resultMessage: string
  stats: GameStats
  prepareGame: (config: GameSessionConfig, startedAt?: string) => void
  revealAt: (row: number, col: number) => void
  toggleFlagAt: (row: number, col: number) => void
  restartRound: () => void
  pause: () => void
  resume: () => void
  tick: () => void
  endTraining: () => void
}

const defaultConfig: GameSessionConfig = {
  durationMinutes: 10,
  difficulty: 'normal',
}

export const useGameStore = create<GameState>((set, get) => ({
  board: createBoardForConfig(defaultConfig),
  status: 'ready',
  config: defaultConfig,
  remainingSeconds: defaultConfig.durationMinutes * 60,
  flagCount: 0,
  minesPlaced: false,
  sessionStartedAt: null,
  sessionEndedAt: null,
  lastActionAt: null,
  resultMessage: '',
  stats: createEmptyStats(),

  prepareGame: (config, startedAt) => {
    set({
      board: createBoardForConfig(config),
      status: 'ready',
      config,
      remainingSeconds: config.durationMinutes * 60,
      flagCount: 0,
      minesPlaced: false,
      sessionStartedAt: startedAt ?? new Date().toISOString(),
      sessionEndedAt: null,
      lastActionAt: null,
      resultMessage: '点击任意格开始，本局首次点击不会踩雷。',
      stats: createEmptyStats(),
    })
  },

  revealAt: (row, col) => {
    const state = get()
    if (!['ready', 'playing'].includes(state.status)) {
      return
    }

    const profile = difficultyProfiles[state.config.difficulty]
    const currentTime = Date.now()
    const baseBoard = state.minesPlaced
      ? state.board
      : placeMines(state.board, profile.mines, { row, col })
    const result = revealCell(baseBoard, row, col)
    const nextStats = recordAction(
      state.stats,
      state,
      currentTime,
      result.revealedCount,
    )

    if (result.hitMine) {
      const stats = {
        ...nextStats,
        losses: nextStats.losses + 1,
        mistakes: nextStats.mistakes + 1,
      }
      stats.score = calculateScore(stats)
      set({
        board: revealAllMines(result.board),
        status: 'lost',
        minesPlaced: true,
        lastActionAt: currentTime,
        resultMessage: '踩到地雷，本局失败。可以重新开始本局。',
        stats,
      })
      return
    }

    if (hasWon(result.board, profile.mines)) {
      const stats = {
        ...nextStats,
        wins: nextStats.wins + 1,
      }
      stats.score = calculateScore(stats)
      set({
        board: result.board,
        status: 'won',
        minesPlaced: true,
        lastActionAt: currentTime,
        resultMessage: '本局胜利，已清除全部非雷方块。',
        stats,
      })
      return
    }

    nextStats.score = calculateScore(nextStats)
    set({
      board: result.board,
      status: 'playing',
      minesPlaced: true,
      lastActionAt: currentTime,
      resultMessage: '',
      stats: nextStats,
    })
  },

  toggleFlagAt: (row, col) => {
    const state = get()
    if (!['ready', 'playing'].includes(state.status)) {
      return
    }

    const profile = difficultyProfiles[state.config.difficulty]
    const result = toggleFlag(state.board, row, col, profile.mines)
    if (!result.changed) {
      return
    }

    const currentTime = Date.now()
    const nextStats = recordAction(state.stats, state, currentTime, 0)
    nextStats.flagsPlaced = result.flagCount
    nextStats.score = calculateScore(nextStats)

    set({
      board: result.board,
      status: state.status === 'ready' ? 'ready' : 'playing',
      flagCount: result.flagCount,
      lastActionAt: currentTime,
      stats: nextStats,
    })
  },

  restartRound: () => {
    const state = get()
    set({
      board: createBoardForConfig(state.config),
      status: 'ready',
      flagCount: 0,
      minesPlaced: false,
      lastActionAt: null,
      resultMessage: '新一局已开始，首次点击仍然安全。',
    })
  },

  pause: () => {
    if (get().status === 'playing') {
      set({ status: 'paused', resultMessage: '训练已暂停。' })
    }
  },

  resume: () => {
    if (get().status === 'paused') {
      set({ status: 'playing', resultMessage: '' })
    }
  },

  tick: () => {
    const state = get()
    if (state.status !== 'playing') {
      return
    }

    if (state.remainingSeconds <= 1) {
      get().endTraining()
      return
    }

    set({ remainingSeconds: state.remainingSeconds - 1 })
  },

  endTraining: () => {
    set({
      status: 'ended',
      sessionEndedAt: new Date().toISOString(),
      resultMessage: '训练时间结束，已生成训练报告。',
    })
  },
}))

function createBoardForConfig(config: GameSessionConfig) {
  const profile = difficultyProfiles[config.difficulty]
  return createEmptyBoard(profile.rows, profile.cols)
}

function recordAction(
  stats: GameStats,
  state: GameState,
  currentTime: number,
  revealedCount: number,
): GameStats {
  const sessionStartTime = state.sessionStartedAt
    ? new Date(state.sessionStartedAt).getTime()
    : currentTime
  const elapsedSecond = Math.max(
    0,
    Math.floor((currentTime - sessionStartTime) / 1000),
  )
  const perSecondActions = [...stats.perSecondActions]
  perSecondActions[elapsedSecond] = (perSecondActions[elapsedSecond] ?? 0) + 1

  const reactionSamplesMs =
    state.lastActionAt === null
      ? stats.reactionSamplesMs
      : [...stats.reactionSamplesMs, currentTime - state.lastActionAt]

  return {
    ...stats,
    totalActions: stats.totalActions + 1,
    safeReveals: stats.safeReveals + revealedCount,
    reactionSamplesMs,
    perSecondActions,
  }
}
