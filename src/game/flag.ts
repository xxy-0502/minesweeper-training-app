import { cloneBoard } from './board'
import type { Board } from './types'

export function toggleFlag(
  board: Board,
  row: number,
  col: number,
  maxFlags: number,
) {
  const nextBoard = cloneBoard(board)
  const target = nextBoard[row]?.[col]
  const currentFlags = countFlags(nextBoard)

  if (!target || target.isRevealed) {
    return {
      board: nextBoard,
      changed: false,
      flagCount: currentFlags,
    }
  }

  if (!target.isFlagged && currentFlags >= maxFlags) {
    return {
      board: nextBoard,
      changed: false,
      flagCount: currentFlags,
    }
  }

  target.isFlagged = !target.isFlagged
  return {
    board: nextBoard,
    changed: true,
    flagCount: countFlags(nextBoard),
  }
}

export function countFlags(board: Board) {
  return board.flat().filter((cell) => cell.isFlagged).length
}
