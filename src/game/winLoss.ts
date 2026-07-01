import type { Board } from './types'

export function hasWon(board: Board, mineCount: number) {
  const cells = board.flat()
  const revealedSafeCells = cells.filter(
    (cell) => cell.isRevealed && !cell.isMine,
  ).length
  return revealedSafeCells === cells.length - mineCount
}

export function countRevealedSafeCells(board: Board) {
  return board.flat().filter((cell) => cell.isRevealed && !cell.isMine).length
}
